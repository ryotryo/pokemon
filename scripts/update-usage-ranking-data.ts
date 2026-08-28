/* eslint-disable @typescript-eslint/no-explicit-any -- External API and upstream dump values are validated before publication. */
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { classifyForm, getAttachedForms, getUsageRank, isCanonicalPokemonRecord } from "../lib/champions/normalize";
import { resolveChampoutLearnsetName } from "../lib/champions/learnset-name";
import { getSeasonDisplayMetadata } from "../lib/champions/season-metadata";
import { getChampionsSprite } from "../lib/champions/sprites";
import type { BattleFormat, DamageClass } from "../lib/champions/types";
import {
  battleFormats,
  parsePoint,
  type PercentageRankingRow,
  type UsageBattleRow,
  type UsageFormatDetail,
  type UsageMoveDetail,
  type UsagePokemonDetail,
  type UsageRankingIndex,
  type UsageRankingPokemon,
} from "../lib/champions/usage-ranking";

const ROOT = process.cwd();
const API = "https://championsbattledata.com";
const OUT = path.join(ROOT, "data/usage-ranking");
const STAGE = path.join(ROOT, `data/.usage-ranking-staging-${Date.now()}`);
const NAMES_FILE = path.join(ROOT, "data/i18n/pokemon-names-ja.json");
const CHAMPOUT_API = "https://api.github.com/repos/projectpokemon/champout/commits/main";
const FORM_LEARNSET_OVERRIDES: Record<string, string> = {
  floette: "Floette-Eternal",
  "gourgeist-jumbo-variety": "Gourgeist-Jumbo",
  "maushold-family-of-four": "Maushold-Family of Four",
  "mega-meowstic": "Meowstic-M-Mega",
};
const ABILITY_NAME_CORRECTIONS: Record<string, string> = {
  boost: "speedboost",
  lronfist: "ironfist",
  leatguard: "leafguard",
};

interface ChampionsIndex {
  generatedAt: string;
  defaultSeason: string;
  pokemon: any[];
  dailyDataFolders?: string[];
  seasons?: string[];
}

interface ChampoutTextEntry {
  Index: number;
  LabelName: string;
  OriginalText: string;
}

interface ChampoutTextFile {
  mSDataSet: ChampoutTextEntry[];
}

interface ChampoutMove {
  id: string;
  type: string;
  category: string;
  direct: string;
  power: string;
  accuracy: string;
  pp: string;
  ms_lbl: string;
  ms_lbl_info: string;
}

interface ChampoutCommit {
  sha: string;
}

interface PokeApiMove {
  flavor_text_entries?: Array<{
    flavor_text?: string;
    language?: { name?: string };
  }>;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { accept: "application/json", "user-agent": "poke-analytics-data-builder/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json() as Promise<T>;
}

async function getText(url: string): Promise<string> {
  const response = await fetch(url, { headers: { accept: "text/plain", "user-agent": "poke-analytics-data-builder/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function getBattleRows(format: BattleFormat, entry: any, season: string): Promise<UsageBattleRow[]> {
  const identifiers = [...new Set([entry.showdownId, entry.slug].filter(Boolean))] as string[];
  for (const identifier of identifiers) {
    const url = `${API}/api/battle/${format}/${encodeURIComponent(identifier)}?season=${encodeURIComponent(season)}`;
    const response = await fetch(url, { headers: { accept: "application/json", "user-agent": "poke-analytics-data-builder/1.0" } });
    if (response.ok) {
      const battle = await response.json() as { rows?: UsageBattleRow[] };
      return Array.isArray(battle.rows) ? battle.rows : [];
    }
    if (response.status !== 404) throw new Error(`${response.status} ${url}`);
  }
  throw new Error(`Battle data not found: ${format} ${entry.showdownId} (${entry.slug})`);
}

async function mapWithConcurrency<T, R>(values: T[], concurrency: number, mapper: (value: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(values.length);
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await mapper(values[index]);
    }
  }));
  return results;
}

function normalizedName(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");
}

function normalizedDescription(value: string | undefined): string | null {
  const normalized = value?.replace(/[\s\u3000]+/g, " ").trim();
  return normalized || null;
}

function pokeApiMoveSlug(value: string): string {
  return value.toLowerCase().replace(/['’:.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function textMap(file: ChampoutTextFile): Map<string, string> {
  return new Map(file.mSDataSet.map((entry) => [entry.LabelName, entry.OriginalText]));
}

function localizedByEnglish(english: ChampoutTextFile, japanese: ChampoutTextFile): Map<string, string> {
  const ja = textMap(japanese);
  return new Map(english.mSDataSet.flatMap((entry) => {
    const localized = ja.get(entry.LabelName);
    return localized ? [[normalizedName(entry.OriginalText), localized] as const] : [];
  }));
}

function parseLearnsets(dump: string): Map<string, string[]> {
  const result = new Map<string, string[]>();
  const headings = [...dump.matchAll(/^(\d{4}) - (.+)$/gm)];
  headings.forEach((heading, index) => {
    const start = heading.index! + heading[0].length;
    const end = headings[index + 1]?.index ?? dump.length;
    const section = dump.slice(start, end);
    const movesStart = section.indexOf("Moves:");
    if (movesStart < 0) return;
    const moves = section.slice(movesStart + 6).split("\n")
      .map((line) => line.match(/^- (.+)$/)?.[1])
      .filter((move): move is string => Boolean(move));
    result.set(normalizedName(heading[2]), moves);
  });
  return result;
}

function parseFormAbilities(dump: string): Map<string, string[]> {
  const result = new Map<string, string[]>();
  const headings = [...dump.matchAll(/^(\d{4}) - (.+)$/gm)];
  headings.forEach((heading, index) => {
    const start = heading.index! + heading[0].length;
    const end = headings[index + 1]?.index ?? dump.length;
    const profile = dump.slice(start, end).split("Moves:")[0].trim().split("\n").map((line) => line.trim()).filter(Boolean);
    const abilities = [...new Set((profile.at(-1) ?? "").split("/").map((ability) => ability.trim()).filter(Boolean))];
    result.set(normalizedName(heading[2]), abilities);
  });
  return result;
}

function basePercentage(row: UsageBattleRow): PercentageRankingRow {
  return {
    rank: Number(row.rank),
    percentage: row.percentage?.trim() || null,
    percentageValue: typeof row.percentage_value === "number" ? row.percentage_value : null,
  };
}

function localizeStat(value: string | undefined): string | null {
  const names: Record<string, string> = {
    HP: "HP", Attack: "こうげき", Defense: "ぼうぎょ", "Sp. Atk": "とくこう",
    "Sp. Def": "とくぼう", Speed: "すばやさ",
  };
  return value ? names[value] ?? null : null;
}

function rowsByCategory(rows: UsageBattleRow[], category: string, limit = 10): UsageBattleRow[] {
  const matching = rows.filter((row) => row.category === category).sort((a, b) => a.rank - b.rank);
  return limit > 0 ? matching.slice(0, limit) : matching;
}

function toFormatDetail(
  context: string,
  rows: UsageBattleRow[],
  rank: number | null,
  movesByEnglish: Map<string, UsageMoveDetail>,
  itemsJa: Map<string, string>,
  naturesJa: Map<string, string>,
  abilitiesJa: Map<string, string>,
  abilityDescriptionsJa: Map<string, string>,
  teammateLookup: Map<string, UsageRankingPokemon>,
): UsageFormatDetail {
  const moves = rowsByCategory(rows, "move").flatMap((row) => {
    const move = movesByEnglish.get(normalizedName(row.name));
    if (!move) {
      console.warn(`[usage] unknown move skipped: ${row.name} (${context})`);
      return [];
    }
    return [{ ...basePercentage(row), moveId: move.id }];
  });
  const items = rowsByCategory(rows, "held_item").flatMap((row) => {
    const nameJa = itemsJa.get(normalizedName(row.name));
    if (!nameJa) {
      console.warn(`[usage] unknown item skipped: ${row.name} (${context})`);
      return [];
    }
    return [{ ...basePercentage(row), nameJa }];
  });
  const natures = rowsByCategory(rows, "stat_alignment").flatMap((row) => {
    const nameJa = naturesJa.get(normalizedName(row.name));
    if (!nameJa) {
      console.warn(`[usage] unknown nature skipped: ${row.name} (${context})`);
      return [];
    }
    return [{ ...basePercentage(row), nameJa, statUp: localizeStat(row.stat_up), statDown: localizeStat(row.stat_down) }];
  });
  const abilities = rowsByCategory(rows, "ability", 0).flatMap((row) => {
    const normalized = normalizedName(row.name);
    const nameJa = abilitiesJa.get(ABILITY_NAME_CORRECTIONS[normalized] ?? normalized);
    if (!nameJa) {
      console.warn(`[usage] unknown ability skipped: ${row.name} (${context})`);
      return [];
    }
    return [{ ...basePercentage(row), nameJa, descriptionJa: abilityDescriptionsJa.get(ABILITY_NAME_CORRECTIONS[normalized] ?? normalized) ?? null }];
  });
  const spreads = rowsByCategory(rows, "stat_points").map((row) => {
    const points = {
      hp: parsePoint(row.hp_points), attack: parsePoint(row.attack_points), defense: parsePoint(row.defense_points),
      specialAttack: parsePoint(row.sp_atk_points), specialDefense: parsePoint(row.sp_def_points), speed: parsePoint(row.speed_points),
    };
    const raw = `HP ${points.hp ?? "—"} / Atk ${points.attack ?? "—"} / Def ${points.defense ?? "—"} / SpA ${points.specialAttack ?? "—"} / SpD ${points.specialDefense ?? "—"} / Spe ${points.speed ?? "—"}`;
    return { ...basePercentage(row), ...points, raw };
  });
  const teammates = rowsByCategory(rows, "teammate").flatMap((row) => {
    const teammate = teammateLookup.get(normalizedName(row.name));
    if (!teammate) {
      console.warn(`[usage] unresolved teammate skipped: ${row.name}`);
      return [];
    }
    return [{
      ...basePercentage(row), pokemonId: teammate.id, displayNameJa: teammate.displayNameJa,
      types: teammate.types, sprite: teammate.sprite,
    }];
  });
  return { rank, usagePercentage: null, moves, items, spreads, natures, abilities, teammates };
}

function formAbilityRows(
  context: string,
  abilityNames: string[],
  usageRows: UsageFormatDetail["abilities"],
  abilityNamesByIndex: Map<string, string>,
  abilitiesJa: Map<string, string>,
  abilityDescriptionsJa: Map<string, string>,
): UsageFormatDetail["abilities"] {
  const usageByName = new Map(usageRows.map((ability) => [ability.nameJa, ability]));
  return abilityNames.flatMap((rawName, index) => {
    const name = abilityNamesByIndex.get(rawName) ?? rawName;
    const normalized = normalizedName(name);
    const corrected = ABILITY_NAME_CORRECTIONS[normalized] ?? normalized;
    const nameJa = abilitiesJa.get(corrected);
    if (!nameJa) {
      console.warn(`[usage] unknown form ability skipped: ${name} (${context})`);
      return [];
    }
    const usage = usageByName.get(nameJa);
    return [{
      rank: usage?.rank ?? index + 1,
      percentage: usage?.percentage ?? null,
      percentageValue: usage?.percentageValue ?? null,
      nameJa,
      descriptionJa: abilityDescriptionsJa.get(corrected) ?? null,
    }];
  }).sort((a, b) => Number(a.percentageValue === null) - Number(b.percentageValue === null) || a.rank - b.rank);
}

async function main() {
  await mkdir(STAGE, { recursive: true });
  try {
    const [index, names, commit] = await Promise.all([
      getJson<ChampionsIndex>(`${API}/api`),
      readFile(NAMES_FILE, "utf8").then((value) => JSON.parse(value) as Record<string, string>),
      getJson<ChampoutCommit>(CHAMPOUT_API),
    ]);
    if (!index.generatedAt || !index.defaultSeason || !index.pokemon.length || !commit.sha) throw new Error("Usage ranking source metadata is incomplete");
    const rawRoot = `https://raw.githubusercontent.com/projectpokemon/champout/${commit.sha}`;
    const [personalDump, waza, moveEn, moveJa, moveInfoJa, itemEn, itemJa, natureEn, natureJa, abilityEn, abilityJa, abilityInfoJa, typeEn, previousMoves] = await Promise.all([
      getText(`${rawRoot}/parse/personal_dump.txt`),
      getJson<ChampoutMove[]>(`${rawRoot}/masterdata/waza.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/usa/wazaname.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/jpn/wazaname.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/jpn/wazainfo_syn.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/usa/itemname.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/jpn/itemname.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/usa/seikaku.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/jpn/seikaku.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/usa/tokusei.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/jpn/tokusei.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/jpn/tokuseiinfo_syn.json`),
      getJson<ChampoutTextFile>(`${rawRoot}/rom-txt/usa/typename.json`),
      readFile(path.join(OUT, "moves.json"), "utf8")
        .then((value) => JSON.parse(value) as Record<string, UsageMoveDetail>)
        .catch(() => ({} as Record<string, UsageMoveDetail>)),
    ]);
    const moveNamesEn = textMap(moveEn);
    const moveNamesJa = textMap(moveJa);
    const moveDescriptionsJa = textMap(moveInfoJa);
    const typeNames = new Map(typeEn.mSDataSet.map((entry) => [String(entry.Index), entry.OriginalText.toLowerCase()]));
    const movesByEnglish = new Map<string, UsageMoveDetail>();
    const movesById: Record<string, UsageMoveDetail> = {};
    for (const row of waza) {
      const nameEn = moveNamesEn.get(row.ms_lbl);
      const nameJa = moveNamesJa.get(row.ms_lbl);
      const type = typeNames.get(row.type);
      const damageClasses: Record<string, DamageClass> = { "0": "physical", "1": "special", "2": "status" };
      const damageClass = damageClasses[row.category];
      if (!nameEn || !nameJa || !type || !damageClass) continue;
      const accuracyValue = Number(row.accuracy);
      const champoutDescription = normalizedDescription(moveDescriptionsJa.get(row.ms_lbl_info));
      const cachedDescription = previousMoves[row.id]?.descriptionSource === "pokeapi"
        ? normalizedDescription(previousMoves[row.id].descriptionJa ?? undefined)
        : null;
      const detail: UsageMoveDetail = {
        id: row.id, nameJa, nameEn, type, damageClass,
        power: Number(row.power) > 0 ? Number(row.power) : null,
        accuracy: accuracyValue > 0 && accuracyValue !== 101 ? accuracyValue : null,
        alwaysHits: accuracyValue === 101,
        pp: Number(row.pp) > 0 ? Number(row.pp) : null,
        descriptionJa: champoutDescription ?? cachedDescription,
        descriptionSource: champoutDescription ? "champout" : cachedDescription ? "pokeapi" : null,
      };
      movesByEnglish.set(normalizedName(nameEn), detail);
      movesById[detail.id] = detail;
    }
    const learnsets = parseLearnsets(personalDump);
    const formAbilities = parseFormAbilities(personalDump);
    const learnableMoveIds = new Set(
      [...learnsets.values()].flatMap((moveNames) => moveNames.flatMap((name) => {
        const move = movesByEnglish.get(normalizedName(name));
        return move ? [move.id] : [];
      })),
    );
    const fallbackMoves = [...learnableMoveIds]
      .flatMap((id) => {
        const move = movesById[id];
        return move && !move.descriptionJa ? [move] : [];
      });
    const pokeApiDescriptions = await mapWithConcurrency(fallbackMoves, 6, async (move) => {
      const response = await fetch(`https://pokeapi.co/api/v2/move/${pokeApiMoveSlug(move.nameEn)}`, {
        headers: { accept: "application/json", "user-agent": "poke-analytics-data-builder/1.0" },
      });
      if (!response.ok) return { id: move.id, description: null };
      const payload = await response.json() as PokeApiMove;
      const entries = payload.flavor_text_entries ?? [];
      const japanese = entries.filter((entry) => entry.language?.name === "ja-Hrkt");
      const fallbackJapanese = entries.filter((entry) => entry.language?.name === "ja");
      const description = normalizedDescription((japanese.at(-1) ?? fallbackJapanese.at(-1))?.flavor_text);
      return { id: move.id, description };
    });
    for (const { id, description } of pokeApiDescriptions) {
      if (!description) continue;
      movesById[id].descriptionJa = description;
      movesById[id].descriptionSource = "pokeapi";
    }
    const itemsJa = localizedByEnglish(itemEn, itemJa);
    const naturesJa = localizedByEnglish(natureEn, natureJa);
    const abilitiesJa = localizedByEnglish(abilityEn, abilityJa);
    const abilityNamesByIndex = new Map(abilityEn.mSDataSet.map((entry) => [String(entry.Index), entry.OriginalText]));
    const abilityInfoByNumber = new Map(abilityInfoJa.mSDataSet.flatMap((entry) => {
      const number = entry.LabelName.match(/(\d+)$/)?.[1];
      const description = normalizedDescription(entry.OriginalText);
      return number && description ? [[number, description] as const] : [];
    }));
    const abilityDescriptionsJa = new Map(abilityEn.mSDataSet.flatMap((entry) => {
      const number = entry.LabelName.match(/(\d+)$/)?.[1];
      const description = number ? abilityInfoByNumber.get(number) : undefined;
      return description ? [[normalizedName(entry.OriginalText), description] as const] : [];
    }));
    const canonicalPokemon = index.pokemon.filter((entry) => isCanonicalPokemonRecord(entry.slug));
    const battleRows = new Map<string, UsageBattleRow[]>();
    for (const format of battleFormats) {
      const fetched = await mapWithConcurrency(canonicalPokemon, 10, async (entry) => {
        const rank = getUsageRank(entry.summary?.battleSummary?.[index.defaultSeason]?.[format]);
        if (rank === null) return { battleId: entry.showdownId as string, rows: [] as UsageBattleRow[] };
        const rows = await getBattleRows(format, entry, index.defaultSeason);
        return { battleId: entry.showdownId as string, rows };
      });
      fetched.forEach(({ battleId, rows }) => battleRows.set(`${format}:${battleId}`, rows));
      console.log(`[usage] ${format} battle responses: ${fetched.length}`);
    }
    const rankingPokemon: UsageRankingPokemon[] = [];
    const sourceById = new Map<string, { entry: any; form: any; learnsetName: string }>();
    for (const entry of canonicalPokemon) {
      const ranks = Object.fromEntries(battleFormats.map((format) => [
        format, getUsageRank(entry.summary?.battleSummary?.[index.defaultSeason]?.[format]),
      ])) as Record<BattleFormat, number | null>;
      for (const form of getAttachedForms(entry)) {
        const formKind = form.form_kind || "Base";
        const id = form.slug;
        const learnsetName = FORM_LEARNSET_OVERRIDES[id]
          ?? resolveChampoutLearnsetName(entry.showdownName, formKind);
        const record: UsageRankingPokemon = {
          id, battleId: entry.showdownId, displayNameJa: names[id] ?? form.saved_name,
          formRelation: classifyForm(formKind), types: (form.types ?? []).map((type: string) => type.toLowerCase()),
          sprite: getChampionsSprite(id, form.image_path), ranks, usagePercentages: { Singles: null, Doubles: null },
        };
        rankingPokemon.push(record);
        sourceById.set(id, { entry, form, learnsetName });
      }
    }
    const uniquePokemon = [...new Map(rankingPokemon.map((pokemon) => [pokemon.id, pokemon])).values()];
    const teammateLookup = new Map<string, UsageRankingPokemon>();
    for (const pokemon of uniquePokemon.filter((entry) => entry.formRelation !== "mega")) {
      const source = sourceById.get(pokemon.id)!;
      const aliases = [source.entry.name, source.entry.battleName, source.entry.slug, source.entry.showdownName, source.form.saved_name, source.form.pokemon_name];
      aliases.forEach((alias) => teammateLookup.set(normalizedName(alias), pokemon));
    }
    const missingLearnsets: string[] = [];
    const details: UsagePokemonDetail[] = [];
    for (const pokemon of uniquePokemon) {
      const source = sourceById.get(pokemon.id)!;
      const moveNames = learnsets.get(normalizedName(source.learnsetName));
      if (!moveNames?.length) {
        missingLearnsets.push(`${pokemon.id} -> ${source.learnsetName}`);
        continue;
      }
      const learnableMoveIds = moveNames.map((name) => {
        const move = movesByEnglish.get(normalizedName(name));
        if (!move) throw new Error(`Learnset move missing from Champions move master: ${name}`);
        return move.id;
      });
      const formats = Object.fromEntries(battleFormats.map((format) => {
        const rows = battleRows.get(`${format}:${pokemon.battleId}`) ?? [];
        const detail = toFormatDetail(`${format}:${pokemon.id}`, rows, pokemon.ranks[format], movesByEnglish, itemsJa, naturesJa, abilitiesJa, abilityDescriptionsJa, teammateLookup);
        const abilityNames = formAbilities.get(normalizedName(source.learnsetName)) ?? [];
        if (!abilityNames.length) throw new Error(`Form abilities missing: ${pokemon.id} -> ${source.learnsetName}`);
        return [format, {
          ...detail,
          abilities: formAbilityRows(`${format}:${pokemon.id}`, abilityNames, detail.abilities, abilityNamesByIndex, abilitiesJa, abilityDescriptionsJa),
        }];
      })) as Record<BattleFormat, UsageFormatDetail>;
      details.push({ ...pokemon, learnableMoveIds: [...new Set(learnableMoveIds)], formats });
    }
    if (missingLearnsets.length) throw new Error(`Unresolved champout learnsets (${missingLearnsets.length}): ${missingLearnsets.join(", ")}`);
    if (uniquePokemon.length < 300 || details.length !== uniquePokemon.length || Object.keys(movesById).length < 800) {
      throw new Error(`Usage ranking validation failed: pokemon=${uniquePokemon.length}, details=${details.length}, moves=${Object.keys(movesById).length}`);
    }
    const garchomp = details.find((detail) => detail.id === "garchomp");
    if (!garchomp || garchomp.formats.Singles.moves.length < 5 || garchomp.formats.Singles.items.length < 5
      || garchomp.formats.Singles.spreads.length < 1 || garchomp.formats.Singles.natures.length < 5
      || garchomp.formats.Singles.abilities.length < 1 || garchomp.formats.Doubles.abilities.length < 1) {
      throw new Error("Usage ranking battle category validation failed");
    }
    const seasonDisplay = getSeasonDisplayMetadata(index);
    const usageIndex: UsageRankingIndex = {
      season: index.defaultSeason, seasonLabel: seasonDisplay.seasonLabel,
      sourceUpdatedAt: index.generatedAt, publishedAt: new Date().toISOString(),
      source: `${API}/api`, pokemon: uniquePokemon,
    };
    await mkdir(path.join(STAGE, "details"), { recursive: true });
    await writeFile(path.join(STAGE, "index.json"), JSON.stringify(usageIndex, null, 2) + "\n");
    await writeFile(path.join(STAGE, "moves.json"), JSON.stringify(movesById, null, 2) + "\n");
    await writeFile(path.join(STAGE, "contact-moves.json"), JSON.stringify(waza.filter((move) => move.direct === "1").map((move) => move.id), null, 2) + "\n");
    await writeFile(path.join(STAGE, "items-ja.json"), JSON.stringify(Object.fromEntries(itemsJa), null, 2) + "\n");
    await writeFile(path.join(STAGE, "natures-ja.json"), JSON.stringify(Object.fromEntries(naturesJa), null, 2) + "\n");
    await writeFile(path.join(STAGE, "metadata.json"), JSON.stringify({
      championsBattleData: `${API}/api`, champoutCommit: commit.sha,
      champoutLearnsets: `${rawRoot}/parse/personal_dump.txt`, champoutMoves: `${rawRoot}/masterdata/waza.json`,
      champoutMoveDescriptions: `${rawRoot}/rom-txt/jpn/wazainfo_syn.json`,
      champoutAbilityDescriptions: `${rawRoot}/rom-txt/jpn/tokuseiinfo_syn.json`,
      pokeApiMoveDescriptions: "https://pokeapi.co/api/v2/move/{move}",
      sourceUpdatedAt: index.generatedAt, publishedAt: usageIndex.publishedAt,
    }, null, 2) + "\n");
    for (const detail of details) {
      await writeFile(path.join(STAGE, "details", `${detail.id}.json`), JSON.stringify(detail, null, 2) + "\n");
    }
    await mkdir(path.join(OUT, "details"), { recursive: true });
    for (const file of ["moves.json", "items-ja.json", "natures-ja.json", "metadata.json"]) {
      await rename(path.join(STAGE, file), path.join(OUT, file));
    }
    for (const detail of details) {
      await rename(path.join(STAGE, "details", `${detail.id}.json`), path.join(OUT, "details", `${detail.id}.json`));
    }
    await rename(path.join(STAGE, "index.json"), path.join(OUT, "index.json"));
    console.log(`[usage] validation passed: ${uniquePokemon.length} Pokemon/forms, ${details.length} details, ${Object.keys(movesById).length} moves`);
    console.log(`[usage] season=${index.defaultSeason}, sourceUpdatedAt=${index.generatedAt}, champout=${commit.sha}`);
  } finally {
    await rm(STAGE, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("[usage] update failed; existing usage-ranking JSON preserved");
  console.error(error);
  process.exitCode = 1;
});
