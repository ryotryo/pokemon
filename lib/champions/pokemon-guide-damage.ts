import { readFile } from "node:fs/promises";
import path from "node:path";
import type { GuideDamageSpec } from "@/content/pokemon-guide-research";
import { calculateDamage, getDamageStatProfile, isSupportedDamageMove, type DamageChartDataset, type DamageChartMove, type DamageResult } from "./damage-chart";
import { getDamageChartDataset } from "./damage-chart-data";
import type { UsageFormatDetail, UsageMoveDetail, UsageNatureRow, UsagePokemonDetail, UsageSpreadRow } from "./usage-ranking";

export interface ResolvedGuideDamageExample {
  id: string;
  attackerPokemonId: string;
  defenderPokemonId: string;
  moveNameJa: string;
  result: DamageResult;
  attackerCondition: string;
  defenderCondition: string;
  profileBasis: string;
}

const statLabel = {
  attack: "こうげき",
  defense: "ぼうぎょ",
  specialAttack: "とくこう",
  specialDefense: "とくぼう",
} as const;

// Championsのステータスポイントは0〜32。レベル50・個体値31で同じ実数値になるEVへ変換する。
export function statPointsToEv(points: number | null): number {
  if (!points || points < 1) return 0;
  return Math.min(252, points * 8 - 4);
}

function natureMultiplier(nature: UsageNatureRow, stat: keyof typeof statLabel): number {
  if (nature.statUp === statLabel[stat]) return 1.1;
  if (nature.statDown === statLabel[stat]) return 0.9;
  return 1;
}

function requiredRank<T extends { rank: number }>(rows: T[], rank: number, label: string): T {
  const row = rows.find((entry) => entry.rank === rank);
  if (!row) throw new Error(`Missing ${label} rank ${rank}`);
  return row;
}

function pointForStat(spread: UsageSpreadRow, stat: "attack" | "specialAttack" | "defense" | "specialDefense") {
  return spread[stat];
}

function compactSpread(spread: UsageSpreadRow) {
  return spread.raw.replaceAll(" / ", "・");
}

function condition(format: UsageFormatDetail, spread: UsageSpreadRow, nature: UsageNatureRow, abilityRank: number, itemRank: number) {
  const ability = requiredRank(format.abilities, abilityRank, "ability");
  const item = requiredRank(format.items, itemRank, "item");
  return `${nature.nameJa}・${compactSpread(spread)}・${ability.nameJa}・${item.nameJa}`;
}

async function readDetail(id: string): Promise<UsagePokemonDetail> {
  const raw = await readFile(path.join(process.cwd(), "data/usage-ranking/details", `${id}.json`), "utf8");
  return JSON.parse(raw) as UsagePokemonDetail;
}

function moveSlug(name: string) {
  return name.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function readSupportedMove(moveId: string): Promise<DamageChartMove> {
  const root = process.cwd();
  const [movesRaw, contactRaw, coverageRaw] = await Promise.all([
    readFile(path.join(root, "data/usage-ranking/moves.json"), "utf8"),
    readFile(path.join(root, "data/usage-ranking/contact-moves.json"), "utf8"),
    readFile(path.join(root, "data/moves/move-master.json"), "utf8"),
  ]);
  const move = (JSON.parse(movesRaw) as Record<string, UsageMoveDetail>)[moveId];
  const coverage = JSON.parse(coverageRaw) as Record<string, { isCoverageMove?: boolean }>;
  if (!move || !isSupportedDamageMove(move, coverage[moveSlug(move.nameEn)]?.isCoverageMove === true)) {
    throw new Error(`Unsupported guide move ${moveId}`);
  }
  return {
    id: move.id,
    nameJa: move.nameJa,
    type: move.type,
    damageClass: move.damageClass,
    power: move.power,
    usage: null,
    rank: 0,
    isContact: new Set(JSON.parse(contactRaw) as string[]).has(move.id),
  };
}

export async function resolveGuideDamageExamples(
  specs: GuideDamageSpec[],
  dataset?: DamageChartDataset,
): Promise<ResolvedGuideDamageExample[]> {
  const damageDataset = dataset ?? await getDamageChartDataset();
  return Promise.all(specs.map(async (spec) => {
    const attacker = damageDataset.pokemon.find((entry) => entry.id === spec.attackerPokemonId);
    const defender = damageDataset.pokemon.find((entry) => entry.id === spec.defenderPokemonId);
    if (!attacker || !defender) throw new Error(`Missing guide damage Pokemon: ${spec.attackerPokemonId} -> ${spec.defenderPokemonId}`);
    const move = attacker.moves.Singles.find((entry) => entry.id === spec.moveId) ?? await readSupportedMove(spec.moveId);
    const [attackerDetail, defenderDetail] = await Promise.all([readDetail(spec.attackerPokemonId), readDetail(spec.defenderPokemonId)]);
    const attackerFormat = attackerDetail.formats.Singles;
    const defenderFormat = defenderDetail.formats.Singles;
    const attackerSpread = requiredRank(attackerFormat.spreads, spec.attackerSpreadRank ?? 1, "attacker spread");
    const attackerNature = requiredRank(attackerFormat.natures, spec.attackerNatureRank ?? 1, "attacker nature");
    const defenderSpread = requiredRank(defenderFormat.spreads, spec.defenderSpreadRank ?? 1, "defender spread");
    const defenderNature = requiredRank(defenderFormat.natures, spec.defenderNatureRank ?? 1, "defender nature");
    const profile = getDamageStatProfile(move);
    const attackerAbilityRank = spec.attackerAbilityRank ?? 1;
    const defenderAbilityRank = spec.defenderAbilityRank ?? 1;
    const attackerItemRank = spec.attackerItemRank ?? 1;
    const defenderItemRank = spec.defenderItemRank ?? 1;
    const attackerAbility = requiredRank(attackerFormat.abilities, attackerAbilityRank, "attacker ability");
    const defenderAbility = requiredRank(defenderFormat.abilities, defenderAbilityRank, "defender ability");
    return {
      id: spec.id,
      attackerPokemonId: spec.attackerPokemonId,
      defenderPokemonId: spec.defenderPokemonId,
      moveNameJa: move.nameJa,
      result: calculateDamage({
        attacker,
        defender,
        move,
        attackEv: statPointsToEv(pointForStat(attackerSpread, profile.attack)),
        attackNature: natureMultiplier(attackerNature, profile.attack),
        hpEv: statPointsToEv(defenderSpread.hp),
        defenseEv: statPointsToEv(pointForStat(defenderSpread, profile.defense)),
        defenseNature: natureMultiplier(defenderNature, profile.defense),
        attackerAbility: attackerAbility.nameJa,
        defenderAbility: defenderAbility.nameJa,
        itemDamageModifier: spec.itemDamageModifier ?? 1,
      }),
      attackerCondition: condition(attackerFormat, attackerSpread, attackerNature, attackerAbilityRank, attackerItemRank),
      defenderCondition: condition(defenderFormat, defenderSpread, defenderNature, defenderAbilityRank, defenderItemRank),
      profileBasis: spec.profileBasis,
    };
  }));
}
