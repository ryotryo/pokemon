/* eslint-disable @typescript-eslint/no-explicit-any -- Champions API values are normalized and validated before publication. */
import { getAttachedForms, getUsageRank } from "./normalize";
import { getChampionsSprite } from "./sprites";

export interface SpeedStats {
  decreasingMin: number;
  neutral: number;
  neutralMax: number;
  increasingMax: number;
}

export interface PokemonBaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface SpeedRankingPokemon {
  id: string;
  name: string;
  displayNameJa: string;
  formKind: string;
  formRelation: "base" | "mega" | "independent";
  sprite: string;
  baseSpeed: number;
  baseStats: PokemonBaseStats;
  usageRanks: { Singles: number | null; Doubles: number | null };
  stats: SpeedStats;
}

export interface SpeedRankingDataset {
  season: string;
  updatedAt: string;
  source: string;
  scale: { min: number; max: number };
  pokemon: SpeedRankingPokemon[];
}

export interface SpeedMultiplier {
  id: string;
  label: string;
  note?: string;
  multiplier: number;
}

export const SPEED_MULTIPLIERS: SpeedMultiplier[] = [
  { id: "normal", label: "通常", multiplier: 1 },
  { id: "speed-rank-1", label: "ランク+1", note: "＝🧣こだわりスカーフ", multiplier: 1.5 },
  { id: "speed-rank-2", label: "ランク+2", multiplier: 2 },
];

export function calculateSpeedStats(neutral: number): SpeedStats {
  const neutralMax = neutral + 32;
  return {
    decreasingMin: Math.floor(neutral * 0.9),
    neutral,
    neutralMax,
    increasingMax: Math.floor(neutralMax * 1.1),
  };
}

export function normalizeBaseStats(form: any): PokemonBaseStats {
  return {
    hp: Number(form.hp) - 75,
    attack: Number(form.attack) - 20,
    defense: Number(form.defense) - 20,
    specialAttack: Number(form.sp_attack) - 20,
    specialDefense: Number(form.sp_defense) - 20,
    speed: Number(form.speed) - 20,
  };
}

export function calculateModifiedSpeed(fastest: number, multiplier: number): number {
  return Math.floor(fastest * multiplier);
}

export function calculateEffectiveBaseSpeed(baseSpeed: number, multiplier: number): number {
  return Math.round((baseSpeed + 20) * multiplier - 20);
}

export function normalizeSpeedRanking(indexPokemon: any[], season: string, namesJa: Record<string, string>, updatedAt: string, source: string): SpeedRankingDataset {
  const records = new Map<string, SpeedRankingPokemon>();
  for (const entry of indexPokemon) {
    const singlesRank = getUsageRank(entry.summary?.battleSummary?.[season]?.Singles);
    const doublesRank = getUsageRank(entry.summary?.battleSummary?.[season]?.Doubles);
    if (singlesRank === null && doublesRank === null) continue;
    for (const form of getAttachedForms(entry)) {
      const neutral = Number(form.speed);
      if (!Number.isFinite(neutral) || neutral <= 20) continue;
      const formKind = form.form_kind || "Base";
      const baseStats = normalizeBaseStats(form);
      if (Object.values(baseStats).some((value) => !Number.isFinite(value) || value <= 0)) continue;
      records.set(form.slug, {
        id: form.slug,
        name: form.saved_name,
        displayNameJa: namesJa[form.slug] ?? form.saved_name,
        formKind,
        formRelation: /^mega(?:\s|$)/i.test(formKind) ? "mega" : formKind === "Base" ? "base" : "independent",
        sprite: getChampionsSprite(form.slug, form.image_path),
        baseSpeed: baseStats.speed,
        baseStats,
        usageRanks: { Singles: singlesRank, Doubles: doublesRank },
        stats: calculateSpeedStats(neutral),
      });
    }
  }
  const pokemon = [...records.values()];
  return {
    season,
    updatedAt,
    source,
    scale: { min: 0, max: Math.max(...pokemon.map((entry) => entry.stats.increasingMax)) },
    pokemon,
  };
}

export function getScalePosition(value: number, scale: { min: number; max: number }): number {
  if (scale.max <= scale.min) return 0;
  return Math.max(0, Math.min(100, ((value - scale.min) / (scale.max - scale.min)) * 100));
}
