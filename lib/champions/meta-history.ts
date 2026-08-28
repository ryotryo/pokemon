import type { BattleFormat } from "./types";

export interface MetaHistoryPokemon {
  showdownId: string;
  savedName: string;
  displayNameJa: string;
  sprite: string;
  ranks: Record<BattleFormat, Array<number | null>>;
}

export interface MetaHistoryDataset {
  season: string;
  source: string;
  sourceGeneratedAt: string;
  updatedAt: string;
  dates: string[];
  pokemon: MetaHistoryPokemon[];
}

export interface MetaHistorySeasonMetadata {
  season: string;
  startDate: string;
  endDate: string;
  days: number;
  generatedAt: string;
  source: string;
  sourceGeneratedAt: string;
  pokemon: Array<Omit<MetaHistoryPokemon, "ranks">>;
}

export interface MetaHistoryFormatDataset {
  season: string;
  format: BattleFormat;
  dates: string[];
  ranks: Record<string, Array<number | null>>;
}

export function indexDisplayPokemonByBattleId<T extends { battleId: string; formRelation: string }>(pokemon: T[]): Map<string, T> {
  const result = new Map<string, T>();
  for (const entry of pokemon) {
    const current = result.get(entry.battleId);
    if (!current || (current.formRelation === "mega" && entry.formRelation !== "mega")) {
      result.set(entry.battleId, entry);
    }
  }
  return result;
}

export function assembleMetaHistoryDataset(
  metadata: MetaHistorySeasonMetadata,
  singles: MetaHistoryFormatDataset,
  doubles: MetaHistoryFormatDataset,
): MetaHistoryDataset {
  if (singles.season !== metadata.season || doubles.season !== metadata.season
    || singles.format !== "Singles" || doubles.format !== "Doubles"
    || singles.dates.join() !== doubles.dates.join()
    || singles.dates.length !== metadata.days
    || singles.dates[0] !== metadata.startDate
    || singles.dates.at(-1) !== metadata.endDate) {
    throw new Error(`${metadata.season}: stored meta history files are inconsistent`);
  }
  return {
    season: metadata.season,
    source: metadata.source,
    sourceGeneratedAt: metadata.sourceGeneratedAt,
    updatedAt: metadata.generatedAt,
    dates: singles.dates,
    pokemon: metadata.pokemon.map((pokemon) => ({
      ...pokemon,
      ranks: {
        Singles: singles.ranks[pokemon.showdownId] ?? singles.dates.map(() => null),
        Doubles: doubles.ranks[pokemon.showdownId] ?? doubles.dates.map(() => null),
      },
    })),
  };
}

export function topThirtyCandidates(dataset: MetaHistoryDataset, format: BattleFormat) {
  const latestIndex = dataset.dates.length - 1;
  return dataset.pokemon
    .filter((pokemon) => pokemon.ranks[format].some((rank) => rank !== null && rank <= 30))
    .sort((a, b) => {
      const aLatest = a.ranks[format][latestIndex] ?? Number.MAX_SAFE_INTEGER;
      const bLatest = b.ranks[format][latestIndex] ?? Number.MAX_SAFE_INTEGER;
      const aBest = Math.min(...a.ranks[format].filter((rank): rank is number => rank !== null));
      const bBest = Math.min(...b.ranks[format].filter((rank): rank is number => rank !== null));
      return aLatest - bLatest || aBest - bBest || a.displayNameJa.localeCompare(b.displayNameJa, "ja");
    });
}

export function initialMetaHistorySelection(dataset: MetaHistoryDataset, format: BattleFormat, limit: 10 | 20 | 30 = 10) {
  return latestTopPokemon(dataset, format, limit).map((pokemon) => pokemon.showdownId);
}

export function latestTopPokemon(dataset: MetaHistoryDataset, format: BattleFormat, limit: 10 | 20 | 30) {
  const latestIndex = dataset.dates.length - 1;
  return dataset.pokemon
    .filter((pokemon) => {
      const rank = pokemon.ranks[format][latestIndex];
      return rank !== null && rank <= limit;
    })
    .sort((a, b) => a.ranks[format][latestIndex]! - b.ranks[format][latestIndex]!);
}

export function latestRankBand(dataset: MetaHistoryDataset, format: BattleFormat, startRank: 1 | 11 | 21) {
  const latestIndex = dataset.dates.length - 1;
  const endRank = startRank + 9;
  return dataset.pokemon
    .filter((pokemon) => {
      const rank = pokemon.ranks[format][latestIndex];
      return rank !== null && rank >= startRank && rank <= endRank;
    })
    .sort((a, b) => a.ranks[format][latestIndex]! - b.ranks[format][latestIndex]!);
}

export interface MetaHistoryRankChange {
  pokemon: MetaHistoryPokemon;
  startRank: number;
  latestRank: number;
  change: number;
}

export function topRankRisers(dataset: MetaHistoryDataset, format: BattleFormat, limit = 5): MetaHistoryRankChange[] {
  const latestIndex = dataset.dates.length - 1;
  return dataset.pokemon
    .flatMap((pokemon) => {
      const startRank = pokemon.ranks[format][0];
      const latestRank = pokemon.ranks[format][latestIndex];
      if (startRank === null || latestRank === null || latestRank > 30 || startRank <= latestRank) return [];
      return [{ pokemon, startRank, latestRank, change: startRank - latestRank }];
    })
    .sort((a, b) => b.change - a.change || a.latestRank - b.latestRank || a.pokemon.displayNameJa.localeCompare(b.pokemon.displayNameJa, "ja"))
    .slice(0, limit);
}

export function topRankFallers(dataset: MetaHistoryDataset, format: BattleFormat, limit = 5): MetaHistoryRankChange[] {
  const latestIndex = dataset.dates.length - 1;
  return dataset.pokemon
    .flatMap((pokemon) => {
      const startRank = pokemon.ranks[format][0];
      const latestRank = pokemon.ranks[format][latestIndex];
      if (startRank === null || latestRank === null || latestRank > 30 || latestRank <= startRank) return [];
      return [{ pokemon, startRank, latestRank, change: latestRank - startRank }];
    })
    .sort((a, b) => b.change - a.change || a.latestRank - b.latestRank || a.pokemon.displayNameJa.localeCompare(b.pokemon.displayNameJa, "ja"))
    .slice(0, limit);
}

export function rankSegments(ranks: Array<number | null>) {
  const segments: Array<Array<{ index: number; rank: number }>> = [];
  let current: Array<{ index: number; rank: number }> = [];
  ranks.forEach((rank, index) => {
    if (rank === null) {
      if (current.length) segments.push(current);
      current = [];
      return;
    }
    current.push({ index, rank });
  });
  if (current.length) segments.push(current);
  return segments;
}
