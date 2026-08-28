import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BattleFormat } from "../lib/champions/types";
import {
  assembleMetaHistoryDataset,
  indexDisplayPokemonByBattleId,
  type MetaHistoryDataset,
  type MetaHistoryFormatDataset,
  type MetaHistoryPokemon,
  type MetaHistorySeasonMetadata,
} from "../lib/champions/meta-history";
import type { UsageRankingIndex } from "../lib/champions/usage-ranking";

const API = "https://championsbattledata.com";
const DATA_DIRECTORY = path.join(process.cwd(), "data", "meta-history");
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
}

interface ChampionsIndex {
  generatedAt: string;
  dailyDataFolders: string[];
  pokemon: IndexPokemon[];
}

function folderDate(folder: string, season: string) {
  const match = folder.match(new RegExp(`^${season}/(\\d{2})_(\\d{2})_(\\d{4})$`, "i"));
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
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.ok || (response.status < 500 && response.status !== 429)) return response;
      lastError = new Error(`${url}: HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }
  throw lastError;
}

async function getRank(sourcePath: string) {
  const response = await fetchWithRetry(new URL(sourcePath, `${API}/`).toString(), { headers: { Range: "bytes=0-1023" } });
  if (!response.ok) throw new Error(`${sourcePath}: HTTP ${response.status}`);
  const [headerLine, rowLine] = (await response.text()).split(/\r?\n/);
  if (!headerLine || !rowLine) throw new Error(`${sourcePath}: missing first data row`);
  const headers = parseCsvLine(headerLine);
  const row = parseCsvLine(rowLine);
  const rank = Number(row[headers.indexOf("column_position")]);
  if (!Number.isInteger(rank) || rank < 1) throw new Error(`${sourcePath}: invalid column_position`);
  return rank;
}

async function mapLimit<T, R>(values: T[], worker: (value: T) => Promise<R>) {
  const result = new Array<R>(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      result[index] = await worker(values[index]);
    }
  }));
  return result;
}

function savedNameFromPath(sourcePath: string) {
  return decodeURIComponent(sourcePath.split("/").at(-1)!.replace(/\.csv$/i, ""));
}

async function readStoredSeason(season: string): Promise<MetaHistoryDataset | null> {
  const directory = path.join(DATA_DIRECTORY, season);
  try {
    const [metadata, singles, doubles] = await Promise.all([
      readFile(path.join(directory, "metadata.json"), "utf8").then((value) => JSON.parse(value) as MetaHistorySeasonMetadata),
      readFile(path.join(directory, "singles.json"), "utf8").then((value) => JSON.parse(value) as MetaHistoryFormatDataset),
      readFile(path.join(directory, "doubles.json"), "utf8").then((value) => JSON.parse(value) as MetaHistoryFormatDataset),
    ]);
    return assembleMetaHistoryDataset(metadata, singles, doubles);
  } catch {
    return readFile(path.join(DATA_DIRECTORY, `${season.toLowerCase()}.json`), "utf8")
      .then((value) => JSON.parse(value) as MetaHistoryDataset)
      .catch(() => null);
  }
}

function validateDataset(dataset: MetaHistoryDataset) {
  if (!dataset.dates.length || dataset.pokemon.length < 200) throw new Error(`${dataset.season}: stored data is too small`);
  for (const format of FORMATS) {
    dataset.dates.forEach((date, dateIndex) => {
      const ranks = dataset.pokemon.map((pokemon) => pokemon.ranks[format][dateIndex]).filter((rank): rank is number => rank !== null);
      const unique = new Set(ranks);
      const required = Array.from({ length: 30 }, (_, index) => index + 1);
      if (ranks.length < 200 || unique.size !== ranks.length || required.some((rank) => !unique.has(rank))) {
        throw new Error(`${dataset.season} ${date} ${format}: final validation failed`);
      }
    });
  }
}

async function publishSeason(dataset: MetaHistoryDataset) {
  const directory = path.join(DATA_DIRECTORY, dataset.season);
  const metadata: MetaHistorySeasonMetadata = {
    season: dataset.season,
    startDate: dataset.dates[0],
    endDate: dataset.dates.at(-1)!,
    days: dataset.dates.length,
    generatedAt: dataset.updatedAt,
    source: dataset.source,
    sourceGeneratedAt: dataset.sourceGeneratedAt,
    pokemon: dataset.pokemon.map((pokemon) => ({
      showdownId: pokemon.showdownId,
      savedName: pokemon.savedName,
      displayNameJa: pokemon.displayNameJa,
      sprite: pokemon.sprite,
    })),
  };
  const formatData = (format: BattleFormat): MetaHistoryFormatDataset => ({
    season: dataset.season,
    format,
    dates: dataset.dates,
    ranks: Object.fromEntries(dataset.pokemon.map((pokemon) => [pokemon.showdownId, pokemon.ranks[format]])),
  });
  const files = [
    ["metadata.json", metadata],
    ["singles.json", formatData("Singles")],
    ["doubles.json", formatData("Doubles")],
  ] as const;
  await mkdir(directory, { recursive: true });
  await Promise.all(files.map(([name, value]) => writeFile(path.join(directory, `${name}.tmp`), `${JSON.stringify(value, null, 2)}\n`)));
  for (const [name] of files) await rename(path.join(directory, `${name}.tmp`), path.join(directory, name));
}

async function updateSeason(index: ChampionsIndex, usageIndex: UsageRankingIndex, season: string) {
  const previous = await readStoredSeason(season);
  const apiDates = index.dailyDataFolders
    .map((folder) => folderDate(folder, season))
    .filter((date): date is string => date !== null)
    .sort();
  if (!apiDates.length) throw new Error(`${season} dailyDataFolders are empty`);
  const previousDates = new Set(previous?.dates ?? []);
  const newDates = apiDates.filter((date) => !previousDates.has(date));
  const dates = [...new Set([...(previous?.dates ?? []), ...apiDates])].sort();
  const japaneseByBattleId = indexDisplayPokemonByBattleId(usageIndex.pokemon);

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
  const currentEntries = [...pokemonByShowdownId.values()].flatMap((pokemon) => {
    const daily = pokemon.battleDataCsvs.filter((csv) => csv.season === season && csv.daily);
    if (!daily.length) return [];
    const localized = japaneseByBattleId.get(pokemon.showdownId);
    if (!localized) throw new Error(`Missing Japanese display data: ${pokemon.showdownId}`);
    return [{ pokemon, savedName: savedNameFromPath(daily[0].path), displayNameJa: localized.displayNameJa, sprite: localized.sprite }];
  });
  if (currentEntries.length < 200) throw new Error(`${season} Pokemon count is too small: ${currentEntries.length}`);

  const previousById = new Map(previous?.pokemon.map((pokemon) => [pokemon.showdownId, pokemon]) ?? []);
  const metadataById = new Map(previous?.pokemon.map((pokemon) => [pokemon.showdownId, {
    showdownId: pokemon.showdownId,
    savedName: pokemon.savedName,
    displayNameJa: pokemon.displayNameJa,
    sprite: pokemon.sprite,
  }]) ?? []);
  currentEntries.forEach(({ pokemon, savedName, displayNameJa, sprite }) => metadataById.set(pokemon.showdownId, { showdownId: pokemon.showdownId, savedName, displayNameJa, sprite }));
  const pokemon: MetaHistoryPokemon[] = [...metadataById.values()].map((entry) => ({
    ...entry,
    ranks: Object.fromEntries(FORMATS.map((format) => [format, dates.map((date) => {
      const previousIndex = previous?.dates.indexOf(date) ?? -1;
      return previousIndex >= 0 ? previousById.get(entry.showdownId)?.ranks[format][previousIndex] ?? null : null;
    })])) as MetaHistoryPokemon["ranks"],
  }));
  const outputById = new Map(pokemon.map((entry) => [entry.showdownId, entry]));

  for (const date of newDates) {
    for (const format of FORMATS) {
      const dateForCsv = csvDate(date);
      const targets = currentEntries.flatMap((entry) => {
        const csv = entry.pokemon.battleDataCsvs.find((candidate) => candidate.season === season && candidate.daily && candidate.date === dateForCsv && candidate.format === format);
        return csv ? [{ showdownId: entry.pokemon.showdownId, path: csv.path }] : [];
      });
      const ranks = await mapLimit(targets, async (target) => ({ ...target, rank: await getRank(target.path) }));
      const dateIndex = dates.indexOf(date);
      ranks.forEach(({ showdownId, rank }) => { outputById.get(showdownId)!.ranks[format][dateIndex] = rank; });
      console.log(`[meta-history] ${season} ${date} ${format}: ${ranks.length} ranks`);
    }
  }

  const changed = newDates.length > 0 || !previous;
  const output: MetaHistoryDataset = {
    season,
    source: `${API}/api/index`,
    sourceGeneratedAt: changed ? index.generatedAt : previous.sourceGeneratedAt,
    updatedAt: changed ? new Date().toISOString() : previous.updatedAt,
    dates,
    pokemon: pokemon.sort((a, b) => a.showdownId.localeCompare(b.showdownId)),
  };
  validateDataset(output);
  await publishSeason(output);
  console.log(`[meta-history] ${season} validation: ok; saved=${dates.length}; new=${newDates.length}; pokemon=${pokemon.length}`);
}

async function main() {
  const [index, usageIndex] = await Promise.all([
    getJson<ChampionsIndex>(`${API}/api/index`),
    readFile(path.join(process.cwd(), "data", "usage-ranking", "index.json"), "utf8").then((value) => JSON.parse(value) as UsageRankingIndex),
  ]);
  if (!index.generatedAt || !Array.isArray(index.dailyDataFolders) || !index.pokemon.length) throw new Error("Champions index is incomplete");
  const seasons = [...new Set(index.dailyDataFolders.map((folder) => folder.split("/")[0]).filter((season) => /^M\d+$/i.test(season)))];
  if (!seasons.length) throw new Error("No season has dailyDataFolders");
  for (const season of seasons) await updateSeason(index, usageIndex, season.toUpperCase());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
