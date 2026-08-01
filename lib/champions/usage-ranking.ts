import type { BattleFormat, DamageClass, FormRelation } from "./types";
import type { PokemonBaseStats } from "./speed-ranking";
import { TYPE_ORDER } from "./display-names";

export type UsageBattleCategory =
  | "move"
  | "held_item"
  | "teammate"
  | "stat_alignment"
  | "stat_points"
  | "ability"
  | string;

export interface UsageBattleRow {
  position?: number;
  column_position?: number;
  category: UsageBattleCategory;
  rank: number;
  name: string;
  percentage?: string;
  percentage_value?: number | null;
  stat_up?: string;
  stat_down?: string;
  hp_points?: number | string;
  attack_points?: number | string;
  defense_points?: number | string;
  sp_atk_points?: number | string;
  sp_def_points?: number | string;
  speed_points?: number | string;
}

export interface UsageRankingPokemon {
  id: string;
  battleId: string;
  displayNameJa: string;
  formRelation: FormRelation;
  types: string[];
  sprite: string;
  ranks: Record<BattleFormat, number | null>;
  usagePercentages: Record<BattleFormat, number | null>;
}

export interface UsageRankingIndex {
  season: string;
  seasonLabel: string;
  sourceUpdatedAt: string;
  publishedAt: string;
  source: string;
  pokemon: UsageRankingPokemon[];
}

export interface UsageMoveDetail {
  id: string;
  nameJa: string;
  nameEn: string;
  type: string;
  damageClass: DamageClass;
  power: number | null;
  accuracy: number | null;
  alwaysHits: boolean;
  pp: number | null;
  descriptionJa: string | null;
  descriptionSource: "champout" | "pokeapi" | null;
}

export interface PercentageRankingRow {
  rank: number;
  percentage: string | null;
  percentageValue: number | null;
}

export interface UsageMoveRow extends PercentageRankingRow {
  moveId: string;
}

export interface UsageItemRow extends PercentageRankingRow {
  nameJa: string;
}

export interface UsageNatureRow extends PercentageRankingRow {
  nameJa: string;
  statUp: string | null;
  statDown: string | null;
}

export interface UsageAbilityRow extends PercentageRankingRow {
  nameJa: string;
  descriptionJa: string | null;
}

export interface UsageSpreadRow extends PercentageRankingRow {
  hp: number | null;
  attack: number | null;
  defense: number | null;
  specialAttack: number | null;
  specialDefense: number | null;
  speed: number | null;
  raw: string;
}

export interface UsageTeammateRow extends PercentageRankingRow {
  pokemonId: string;
  displayNameJa: string;
  types: string[];
  sprite: string;
}

export interface UsageFormatDetail {
  rank: number | null;
  usagePercentage: number | null;
  moves: UsageMoveRow[];
  items: UsageItemRow[];
  spreads: UsageSpreadRow[];
  natures: UsageNatureRow[];
  abilities: UsageAbilityRow[];
  teammates: UsageTeammateRow[];
}

export interface UsagePokemonDetail {
  id: string;
  battleId: string;
  displayNameJa: string;
  formRelation: FormRelation;
  types: string[];
  sprite: string;
  learnableMoveIds: string[];
  formats: Record<BattleFormat, UsageFormatDetail>;
}

export interface UsagePokemonPageData extends Omit<UsagePokemonDetail, "learnableMoveIds"> {
  learnableMoves: UsageMoveDetail[];
  baseStats: PokemonBaseStats;
  megaForms: Array<{
    id: string;
    displayNameJa: string;
    sprite: string;
    types: string[];
    baseStats: PokemonBaseStats;
  }>;
}

export type UsageMoveSort = "name" | "type" | "power" | "pp";

export const battleFormats: BattleFormat[] = ["Singles", "Doubles"];

export function parseFormat(value: string | string[] | undefined): BattleFormat {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized?.toLowerCase() === "doubles" ? "Doubles" : "Singles";
}

export function formatQuery(format: BattleFormat): string {
  return format.toLowerCase();
}

export function formatPercentage(value: number | null, fallback: string | null = null): string {
  if (value !== null && Number.isFinite(value)) return `${value}%`;
  return fallback || "—";
}

export function parsePoint(value: number | string | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function sortRankingPokemon(pokemon: UsageRankingPokemon[], format: BattleFormat) {
  return [...pokemon].sort((a, b) => {
    const aRank = a.ranks[format] ?? Number.MAX_SAFE_INTEGER;
    const bRank = b.ranks[format] ?? Number.MAX_SAFE_INTEGER;
    return aRank - bRank || (a.formRelation === "mega" ? 1 : 0) - (b.formRelation === "mega" ? 1 : 0)
      || a.displayNameJa.localeCompare(b.displayNameJa, "ja");
  });
}

export function filterAndSortUsageMoves(
  moves: UsageMoveDetail[],
  options: { query: string; type: string; damageClass: DamageClass | "all"; sort: UsageMoveSort },
) {
  const normalized = options.query.trim().toLocaleLowerCase("ja");
  return moves.filter((move) =>
    (!normalized || move.nameJa.toLocaleLowerCase("ja").includes(normalized))
    && (options.type === "all" || move.type === options.type)
    && (options.damageClass === "all" || move.damageClass === options.damageClass),
  ).sort((a, b) => {
    if (options.sort === "power") return (b.power ?? -1) - (a.power ?? -1) || a.nameJa.localeCompare(b.nameJa, "ja");
    if (options.sort === "pp") return (b.pp ?? -1) - (a.pp ?? -1) || a.nameJa.localeCompare(b.nameJa, "ja");
    if (options.sort === "type") {
      const aTypeOrder = TYPE_ORDER.indexOf(a.type);
      const bTypeOrder = TYPE_ORDER.indexOf(b.type);
      return (aTypeOrder < 0 ? Number.MAX_SAFE_INTEGER : aTypeOrder) - (bTypeOrder < 0 ? Number.MAX_SAFE_INTEGER : bTypeOrder)
        || a.nameJa.localeCompare(b.nameJa, "ja");
    }
    return a.nameJa.localeCompare(b.nameJa, "ja");
  });
}
