import { normalizeJapaneseSearchText, TYPE_ORDER } from "./display-names";
import type { BattleFormat } from "./types";
import type { UsageMoveDetail, UsageRankingPokemon } from "./usage-ranking";

export type MoveSearchSort = "type" | "name";

export interface MoveSearchPokemon extends UsageRankingPokemon {
  learnableMoveIds: string[];
}

export interface MoveSearchDataset {
  seasonLabel: string;
  updatedAt: string;
  moves: UsageMoveDetail[];
  pokemon: MoveSearchPokemon[];
}

export function filterAndSortMoveSearch(
  moves: UsageMoveDetail[],
  query: string,
  sort: MoveSearchSort,
) {
  const normalizedQuery = normalizeJapaneseSearchText(query);
  return moves
    .filter((move) => !normalizedQuery || normalizeJapaneseSearchText(move.nameJa).includes(normalizedQuery))
    .sort((a, b) => {
      if (sort === "type") {
        const aType = TYPE_ORDER.indexOf(a.type);
        const bType = TYPE_ORDER.indexOf(b.type);
        const typeOrder = (aType < 0 ? Number.MAX_SAFE_INTEGER : aType)
          - (bType < 0 ? Number.MAX_SAFE_INTEGER : bType);
        if (typeOrder !== 0) return typeOrder;
      }
      return a.nameJa.localeCompare(b.nameJa, "ja");
    });
}

export function getMoveLearners(
  pokemon: MoveSearchPokemon[],
  moveId: string,
  format: BattleFormat,
) {
  return pokemon
    .filter((entry) => entry.learnableMoveIds.includes(moveId))
    .sort((a, b) => {
      const aRank = a.ranks[format];
      const bRank = b.ranks[format];
      if (aRank === null && bRank !== null) return 1;
      if (aRank !== null && bRank === null) return -1;
      if (aRank !== null && bRank !== null && aRank !== bRank) return aRank - bRank;
      return a.displayNameJa.localeCompare(b.displayNameJa, "ja");
    });
}
