import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BattleFormat } from "../lib/champions/types";
import type { MetaHistoryDataset, MetaHistoryPokemon } from "../lib/champions/meta-history";
import type { UsageRankingIndex } from "../lib/champions/usage-ranking";

const API = "https://championsbattledata.com";
const SEASON = "M4";
const OUT = path.join(process.cwd(), "data", "meta-history", "m4.json");
const FORMATS: BattleFormat[] = ["Singles", "Doubles"];
const CONCURRENCY = 24;

interface IndexCsv {
  season: string;
  date?: string;
  format: BattleFormat;
  path: string;
  daily?: boolean;
}

interface IndexPokemon {
  name: string;
  showdownId: string;
  battleDataCsvs: IndexCsv[];
  summary?: { sprite?: string; primary?: { saved_name?: string } };
}

interface ChampionsIndex {
  generatedAt: string;
  dailyDataFolders: string[];
  pokemon: IndexPokemon[];
}

function isoDate(folder: string) {
  const match = folder.match(/^M4\/(\d{2})_(\d{2})_(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

function csvDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}_${month}_${year}`;
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === "\"") {
      if (quoted && line[index + 1] === "\"") {
        value += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      cells.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  cells.push(value);
  return cells;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

async function getRank(sourcePath: string) {
  const response = await fetch(new URL(sourcePath, `${API}/`), { headers: { Range: "bytes=0-1023" } });
  if (!response.ok) throw new Error(`${sourcePath}: HTTP ${response.status}`);
  const [headerLine, rowLine] = (await response.text()).split(/\r?\n/);
  if (!headerLine || !rowLine) throw new Error(`${sourcePath}: missing first data row`);
  const headers = parseCsvLine(headerLine);
  const row = parseCsvLine(rowLine);
  const rank = Number(row[headers.indexOf("column_position")]);
  if (!Number.isInteger(rank) || rank < 1) throw new Error(`${sourcePath}: invalid column_position`);
  return rank;
}

async function mapLimit<T, R>(values: T[], worker: (value: T, index: number) => Promise<R>) {
  const result = new Array<R>(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      result[index] = await worker(values[index], index);
    }
  }));
  return result;
}

function savedNameFromPath(sourcePath: string) {
  return decodeURIComponent(sourcePath.split("/").at(-1)!.replace(/\.csv$/i, ""));
}

async function main() {
  const [index, usageIndex, previous] = await Promise.all([
    getJson<ChampionsIndex>(`${API}/api/index`),
    readFile(path.join(process.cwd(), "data", "usage-ranking", "index.json"), "utf8").then((value) => JSON.parse(value) as UsageRankingIndex),
    readFile(OUT, "utf8").then((value) => JSON.parse(value) as MetaHistoryDataset).catch(() => null),
  ]);
  if (!index.generatedAt || !Array.isArray(index.dailyDataFolders) || !index.pokemon.length) {
    throw new Error("Champions index is incomplete");
  }

  const dates = index.dailyDataFolders.map(isoDate).filter((date): date is string => date !== null).sort();
  if (!dates.length) throw new Error("M4 dailyDataFolders are empty");
  const previousIsValid = previous?.season === SEASON
    && new Set(previous.pokemon.map((pokemon) => pokemon.showdownId)).size === previous.pokemon.length;
  const previousDates = new Set(previousIsValid ? previous.dates : []);
  const newDates = dates.filter((date) => !previousDates.has(date));
  const japaneseByBattleId = new Map(
    usageIndex.pokemon
      .filter((pokemon) => pokemon.formRelation !== "mega")
      .map((pokemon) => [pokemon.battleId, pokemon]),
  );

  const pokemonByShowdownId = new Map<string, IndexPokemon>();
  index.pokemon.forEach((pokemon) => {
    const current = pokemonByShowdownId.get(pokemon.showdownId);
    if (!current) {
      pokemonByShowdownId.set(pokemon.showdownId, { ...pokemon, battleDataCsvs: [...pokemon.battleDataCsvs] });
      return;
    }
    const paths = new Set(current.battleDataCsvs.map((csv) => csv.path));
    pokemon.battleDataCsvs.forEach((csv) => {
      if (!paths.has(csv.path)) current.battleDataCsvs.push(csv);
    });
  });
  const entries = [...pokemonByShowdownId.values()].flatMap((pokemon) => {
    const daily = pokemon.battleDataCsvs.filter((csv) => csv.season === SEASON && csv.daily);
    if (!daily.length) return [];
    const localized = japaneseByBattleId.get(pokemon.showdownId);
    if (!localized) throw new Error(`Missing Japanese display data: ${pokemon.showdownId}`);
    return [{
      pokemon,
      savedName: savedNameFromPath(daily[0].path),
      displayNameJa: localized.displayNameJa,
      sprite: localized.sprite,
    }];
  });
  if (entries.length < 200) throw new Error(`M4 Pokemon count is too small: ${entries.length}`);

  const previousById = new Map(previousIsValid ? previous.pokemon.map((pokemon) => [pokemon.showdownId, pokemon]) : []);
  const pokemon: MetaHistoryPokemon[] = entries.map((entry) => ({
    showdownId: entry.pokemon.showdownId,
    savedName: entry.savedName,
    displayNameJa: entry.displayNameJa,
    sprite: entry.sprite,
    ranks: {
      Singles: dates.map((date) => {
        const oldIndex = previousIsValid ? previous.dates.indexOf(date) : -1;
        return oldIndex >= 0 ? previousById.get(entry.pokemon.showdownId)?.ranks.Singles[oldIndex] ?? null : null;
      }),
      Doubles: dates.map((date) => {
        const oldIndex = previousIsValid ? previous.dates.indexOf(date) : -1;
        return oldIndex >= 0 ? previousById.get(entry.pokemon.showdownId)?.ranks.Doubles[oldIndex] ?? null : null;
      }),
    },
  }));
  const outputById = new Map(pokemon.map((entry) => [entry.showdownId, entry]));

  for (const date of newDates) {
    for (const format of FORMATS) {
      const dateForCsv = csvDate(date);
      const targets = entries.flatMap((entry) => {
        const csv = entry.pokemon.battleDataCsvs.find((candidate) =>
          candidate.season === SEASON && candidate.daily && candidate.date === dateForCsv && candidate.format === format);
        return csv ? [{ showdownId: entry.pokemon.showdownId, path: csv.path }] : [];
      });
      const ranks = await mapLimit(targets, async (target) => ({ ...target, rank: await getRank(target.path) }));
      const dateIndex = dates.indexOf(date);
      ranks.forEach(({ showdownId, rank }) => {
        outputById.get(showdownId)!.ranks[format][dateIndex] = rank;
      });
      const values = ranks.map(({ rank }) => rank);
      const unique = new Set(values);
      const topThirty = Array.from({ length: 30 }, (_, index) => index + 1);
      if (ranks.length < 200 || unique.size !== ranks.length || topThirty.some((rank) => !unique.has(rank))) {
        throw new Error(`${SEASON} ${date} ${format}: ranking validation failed`);
      }
      console.log(`[meta-history] ${date} ${format}: ${ranks.length} ranks`);
    }
  }

  for (const format of FORMATS) {
    dates.forEach((date, dateIndex) => {
      const ranks = pokemon.map((entry) => entry.ranks[format][dateIndex]).filter((rank): rank is number => rank !== null);
      const unique = new Set(ranks);
      if (ranks.length < 200 || unique.size !== ranks.length || Array.from({ length: 30 }, (_, index) => index + 1).some((rank) => !unique.has(rank))) {
        throw new Error(`${SEASON} ${date} ${format}: final validation failed`);
      }
    });
  }

  const output: MetaHistoryDataset = {
    season: SEASON,
    source: `${API}/api/index`,
    sourceGeneratedAt: newDates.length ? index.generatedAt : previous?.sourceGeneratedAt ?? index.generatedAt,
    updatedAt: newDates.length ? new Date().toISOString() : previous?.updatedAt ?? new Date().toISOString(),
    dates,
    pokemon: pokemon.sort((a, b) => a.showdownId.localeCompare(b.showdownId)),
  };
  await mkdir(path.dirname(OUT), { recursive: true });
  const temporary = `${OUT}.tmp`;
  await writeFile(temporary, `${JSON.stringify(output, null, 2)}\n`);
  await rename(temporary, OUT);
  console.log(`[meta-history] validation: ok; dates=${dates.length}; pokemon=${pokemon.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
