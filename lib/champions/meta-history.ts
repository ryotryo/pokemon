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

export interface MetaHistoryRiser {
  pokemon: MetaHistoryPokemon;
  startRank: number;
  latestRank: number;
  rise: number;
}

export function topRankRisers(dataset: MetaHistoryDataset, format: BattleFormat, limit = 3): MetaHistoryRiser[] {
  const latestIndex = dataset.dates.length - 1;
  return dataset.pokemon
    .flatMap((pokemon) => {
      const startRank = pokemon.ranks[format][0];
      const latestRank = pokemon.ranks[format][latestIndex];
      if (startRank === null || latestRank === null || latestRank > 30 || startRank <= latestRank) return [];
      return [{ pokemon, startRank, latestRank, rise: startRank - latestRank }];
    })
    .sort((a, b) => b.rise - a.rise || a.latestRank - b.latestRank || a.pokemon.displayNameJa.localeCompare(b.pokemon.displayNameJa, "ja"))
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
