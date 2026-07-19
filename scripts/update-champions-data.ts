/* eslint-disable @typescript-eslint/no-explicit-any -- External API values are normalized and validated before publication. */
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getRanking, normalizePokemon, slugifyMove } from "../lib/champions/normalize";
import { isCoverageMove } from "../lib/champions/move-coverage";
import { getSeasonDisplayMetadata } from "../lib/champions/season-metadata";
import type { BattleFormat, ChampionsDataset, MoveMasterEntry } from "../lib/champions/types";

const ROOT = process.cwd();
const API = "https://championsbattledata.com";
const OUT = path.join(ROOT, "data");
const STAGE = path.join(OUT, `.staging-${Date.now()}`);
const MOVE_FILE = path.join(OUT, "moves/move-master.json");
const POKEMON_NAMES_FILE = path.join(OUT, "i18n/pokemon-names-ja.json");
const POKEMON_NAME_OVERRIDES: Record<string, string> = { "fan-rotom": "スピンロトム" };

async function getJson(url: string) {
  const response = await fetch(url, { headers: { accept: "application/json", "user-agent": "champions-party-checker-data-builder/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function loadMoveMaster(): Promise<Record<string, MoveMasterEntry>> {
  try { return JSON.parse(await readFile(MOVE_FILE, "utf8")); } catch { return {}; }
}

async function loadPokemonNames(): Promise<Record<string, string>> {
  try { return JSON.parse(await readFile(POKEMON_NAMES_FILE, "utf8")); } catch { return {}; }
}

function localizeForm(baseNameJa: string, formKind: string): string {
  const megaMatch = formKind.match(/^Mega(?:\s+([XY]))?$/i);
  if (megaMatch) return `メガ${baseNameJa}${megaMatch[1] ?? ""}`;
  const prefixes: Record<string, string> = { Alolan: "アローラ", Galarian: "ガラル", Hisuian: "ヒスイ" };
  if (prefixes[formKind]) return `${prefixes[formKind]}${baseNameJa}`;
  const labels: Record<string, string> = {
    "Dusk Form": "たそがれのすがた", "Midnight Form": "まよなかのすがた", "Family of Four": "4ひきかぞく",
    "Fancy Pattern": "ファンシーなもよう", Female: "メスのすがた", Male: "オスのすがた",
    "Jumbo Variety": "とくだいサイズ", "Large Variety": "おおきいサイズ", "Small Variety": "ちいさいサイズ",
    "Natural Form": "あるがまま", "Paldean Aqua Breed": "パルデアのすがた・ウォーター種",
    "Paldean Blaze Breed": "パルデアのすがた・ブレイズ種", "Paldean Combat Breed": "パルデアのすがた・コンバット種",
    "Red Flower": "あかいはな", "Shield Forme": "シールドフォルム", "Zero Form": "ナイーブフォルム",
  };
  return labels[formKind] ? `${baseNameJa}（${labels[formKind]}）` : baseNameJa;
}

async function hydratePokemonNames(indexPokemon: any[], names: Record<string, string>) {
  Object.assign(names, POKEMON_NAME_OVERRIDES);
  const baseNames = new Map<string, string>();
  for (const entry of indexPokemon) {
    const primary = entry.summary?.primary;
    const baseId = slugifyMove(primary?.pokemon_name || entry.name);
    if (baseNames.has(baseId)) continue;
    const existingBase = indexPokemon.find((candidate: any) => candidate.slug === baseId && names[candidate.slug]);
    if (existingBase) { baseNames.set(baseId, names[existingBase.slug]); continue; }
    const species = await getJson(`https://pokeapi.co/api/v2/pokemon-species/${encodeURIComponent(baseId)}`);
    const nameJa = species.names?.find((item: any) => item.language?.name === "ja-hrkt")?.name;
    if (!nameJa) throw new Error(`${baseId}: Japanese Pokemon name missing from PokeAPI`);
    baseNames.set(baseId, nameJa);
  }
  let addedCount = 0;
  for (const entry of indexPokemon) {
    if (names[entry.slug]) continue;
    const primary = entry.summary?.primary;
    const baseId = slugifyMove(primary?.pokemon_name || entry.name);
    names[entry.slug] = localizeForm(baseNames.get(baseId)!, primary?.form_kind || "Base");
    addedCount += 1;
  }
  for (const entry of indexPokemon) {
    const primary = entry.summary?.primary;
    const baseId = slugifyMove(primary?.pokemon_name || entry.name);
    for (const form of entry.summary?.forms ?? []) {
      if (names[form.slug]) continue;
      names[form.slug] = localizeForm(baseNames.get(baseId)!, form.form_kind || "Base");
      addedCount += 1;
    }
  }
  return { names, addedCount };
}

async function hydrateMoves(names: string[], master: Record<string, MoveMasterEntry>) {
  const missingDetails = [...new Set(names)].filter((name) => {
    const entry = master[slugifyMove(name)];
    return !entry?.displayNameJa || !entry.metaCategory || typeof entry.isCoverageMove !== "boolean";
  });
  for (const name of missingDetails) {
    const id = slugifyMove(name);
    const move = await getJson(`https://pokeapi.co/api/v2/move/${encodeURIComponent(id)}`);
    const displayNameJa = move.names?.find((entry: any) => entry.language?.name === "ja-hrkt")?.name;
    if (!displayNameJa) throw new Error(`${name}: Japanese move name missing from PokeAPI`);
    const damageClass = move.damage_class?.name;
    const metaCategory = move.meta?.category?.name ?? "";
    master[id] = { id, name, displayNameJa, type: move.type?.name, damageClass, metaCategory, isCoverageMove: isCoverageMove(id, damageClass, metaCategory), source: "pokeapi" };
  }
  return { master, fetchedCount: missingDetails.length };
}

function validate(dataset: ChampionsDataset) {
  if (!dataset.season) throw new Error("season is empty");
  if (dataset.pokemon.length < 30) throw new Error(`${dataset.format}: Pokemon data is incomplete`);
  dataset.pokemon.forEach((pokemon) => {
    if (!pokemon.name || !pokemon.types.length || !pokemon.forms.length) throw new Error(`${pokemon.name || "unknown"}: required Pokemon data missing`);
    if (!Array.isArray(pokemon.moves)) throw new Error(`${pokemon.name}: invalid move data`);
  });
}

async function main() {
  await mkdir(STAGE, { recursive: true });
  try {
    const index = await getJson(`${API}/api`);
    const season = index.defaultSeason;
    if (!season || !Array.isArray(index.pokemon) || !index.pokemon.length) throw new Error("invalid index or season");
    const seasonDisplay = getSeasonDisplayMetadata(index);
    console.log(`[data] season: ${season} (${seasonDisplay.seasonLabel || "label unavailable"})`);
    const formats: BattleFormat[] = ["Singles", "Doubles"];
    const rankings = new Map(formats.map((format) => [format, getRanking(index.pokemon, season, format)]));
    const raw = new Map<BattleFormat, Array<{ entry: any; rank: number; battle: any }>>();
    const availableRaw = new Map<BattleFormat, Array<{ entry: any; rank: number; battle: any }>>();
    const moveNames: string[] = [];
    for (const format of formats) {
      const ranking = rankings.get(format)!;
      if (ranking.length < 30) throw new Error(`${format}: ranking is incomplete`);
      const rows = await Promise.all(ranking.slice(0, 30).map(async ({ entry, rank }) => {
        const battle = await getJson(`${API}/api/battle/${format}/${encodeURIComponent(entry.slug)}?season=${encodeURIComponent(season)}`);
        battle.rows.filter((row: any) => row.category === "move" && row.rank <= 10).forEach((row: any) => moveNames.push(row.name));
        return { entry, rank, battle };
      }));
      const availableRows = index.pokemon.map((entry: any) => {
        const summary = entry.summary?.battleSummary?.[season]?.[format];
        const rank = Number(summary?.rows?.find((row: any) => row.column_position)?.column_position);
        const rows = Array.isArray(summary?.rows) ? summary.rows : [];
        rows.filter((row: any) => row.category === "move" && row.rank <= 10).forEach((row: any) => moveNames.push(row.name));
        return { entry, rank: Number.isInteger(rank) ? rank : Number.MAX_SAFE_INTEGER, battle: { rows } };
      });
      availableRaw.set(format, availableRows);
      raw.set(format, rows);
      console.log(`[data] ${format}: ranked ${ranking.length}, TOP30 battle responses ${rows.length}, Champions records ${availableRows.length}`);
    }
    console.log(`[data] pokemon count: Singles ${raw.get("Singles")!.length}, Doubles ${raw.get("Doubles")!.length}, total ${formats.reduce((total, format) => total + raw.get(format)!.length, 0)}`);
    console.log(`[data] move rows: ${moveNames.length}, unique ${new Set(moveNames).size}`);
    const { master, fetchedCount } = await hydrateMoves(moveNames, await loadMoveMaster());
    console.log(`[data] PokéAPI newly fetched: ${fetchedCount}`);
    console.log(`[data] move master count: ${Object.keys(master).length}`);
    const { names: pokemonNamesJa, addedCount: pokemonNamesAdded } = await hydratePokemonNames(index.pokemon, await loadPokemonNames());
    console.log(`[data] Pokemon Japanese names newly added: ${pokemonNamesAdded}`);
    const updatedAt = new Date().toISOString();
    await mkdir(path.join(STAGE, "champions"), { recursive: true });
    await mkdir(path.join(STAGE, "moves"), { recursive: true });
    await mkdir(path.join(STAGE, "i18n"), { recursive: true });
    const metadata: any = { season, ...seasonDisplay, updatedAt, source: `${API}/api`, formats: {} };
    for (const format of formats) {
      for (const { entry, battle } of raw.get(format)!) {
        const topMoves = battle.rows.filter((row: any) => row.category === "move" && row.rank <= 10);
        if (topMoves.length < 5) throw new Error(`${entry.name}: unusually few source moves (${topMoves.length})`);
      }
      const dataset: ChampionsDataset = {
        season, format, updatedAt, source: API,
        pokemon: availableRaw.get(format)!.map(({ entry, rank, battle }) => normalizePokemon(entry, rank, battle, master, pokemonNamesJa)).sort((a, b) => a.rank - b.rank),
      };
      validate(dataset);
      console.log(`[data] validation: ${format} passed (${dataset.pokemon.length} Pokemon)`);
      metadata.formats[format] = { count: dataset.pokemon.length, source: `${API}/api/battle/${format}/:name?season=${encodeURIComponent(season)}` };
      await writeFile(path.join(STAGE, `champions/${format.toLowerCase()}.json`), JSON.stringify(dataset, null, 2) + "\n");
    }
    await writeFile(path.join(STAGE, "moves/move-master.json"), JSON.stringify(master, null, 2) + "\n");
    await writeFile(path.join(STAGE, "i18n/pokemon-names-ja.json"), JSON.stringify(pokemonNamesJa, null, 2) + "\n");
    await writeFile(path.join(STAGE, "metadata.json"), JSON.stringify(metadata, null, 2) + "\n");
    for (const relative of ["champions/singles.json", "champions/doubles.json", "moves/move-master.json", "i18n/pokemon-names-ja.json", "metadata.json"]) {
      await mkdir(path.dirname(path.join(OUT, relative)), { recursive: true });
      await rename(path.join(STAGE, relative), path.join(OUT, relative));
    }
    console.log("[data] validation result: passed");
    console.log(`[data] published: season ${season}, Singles ${availableRaw.get("Singles")!.length}, Doubles ${availableRaw.get("Doubles")!.length}, moves ${Object.keys(master).length}`);
  } finally { await rm(STAGE, { recursive: true, force: true }); }
}

main().catch((error) => { console.error("[data] validation/update result: failed; existing JSON preserved"); console.error(error); process.exitCode = 1; });
