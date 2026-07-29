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

export function initialMetaHistorySelection(dataset: MetaHistoryDataset, format: BattleFormat, limit = 10) {
  return topThirtyCandidates(dataset, format).slice(0, limit).map((pokemon) => pokemon.showdownId);
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
