import type { DamageClass } from "./types";
import type { PokemonBaseStats } from "./speed-ranking";
import { getTypeMultiplier } from "./type-matchup";

export interface DamageChartMove {
  id: string;
  nameJa: string;
  type: string;
  damageClass: Extract<DamageClass, "physical" | "special">;
  power: number;
  usage: number | null;
  rank: number;
  isContact: boolean;
}

export interface DamageChartAbility {
  nameJa: string;
  descriptionJa: string | null;
  percentageValue: number | null;
}

export interface DamageChartPokemon {
  id: string;
  displayNameJa: string;
  types: string[];
  sprite: string;
  baseStats: PokemonBaseStats;
  ranks: { Singles: number | null; Doubles: number | null };
  moves: { Singles: DamageChartMove[]; Doubles: DamageChartMove[] };
  abilities: { Singles: DamageChartAbility[]; Doubles: DamageChartAbility[] };
}

export interface DamageChartDataset {
  season: string;
  seasonLabel: string;
  updatedAt: string;
  pokemon: DamageChartPokemon[];
}

export interface DamageResult {
  minDamage: number;
  maxDamage: number;
  minPercent: number;
  maxPercent: number;
  hitLabel: string;
}

export const ITEM_DAMAGE_MODIFIERS = [1, 1.1, 1.2, 1.3, 1.5] as const;
export type ItemDamageModifier = typeof ITEM_DAMAGE_MODIFIERS[number];

const SUPPORTED_OFFENSIVE_ABILITIES = new Set(["テクニシャン", "ちからもち", "ヨガパワー", "てきおうりょく", "かたいツメ"]);
// 威力・攻撃実数値・技タイプ/STAB・急所・攻撃回数など、攻撃ダメージを直接変えるが早見表では未実装の特性。
// 被ダメージだけに関係する特性や、発動後に通常の能力ランクを変えるだけの特性はここへ含めない。
const UNSUPPORTED_OFFENSIVE_ABILITIES = new Set([
  "あめふらし", "うるおいボイス", "おやこあい", "かたやぶり", "がんじょうあご", "きもったま", "きれあじ", "ぎたい",
  "げきりゅう", "こんじょう", "しんりょく", "すいほう", "すてみ", "すなのちから", "スキルリンク",
  "そうだいしょう", "ちからずく", "てつのこぶし", "てんきや", "でんきにかえる", "とうそうしん", "はりきり",
  "ひでり", "ひとでなし", "バトルスイッチ", "へんげんじざい", "ほのおのたてがみ", "むしのしらせ",
  "もうか", "もらいび", "アナライズ", "エレキメイカー", "サンパワー", "スカイスキン", "スナイパー",
  "ドラゴンスキン", "フェアリーオーラ", "フェアリースキン", "フリーズスキン", "プラス", "マイナス",
  "メガソーラー", "メガランチャー",
]);
const ITEM_FINAL_MODS: Record<ItemDamageModifier, number> = { 1: 4096, 1.1: 4505, 1.2: 4915, 1.3: 5324, 1.5: 6144 };

export type OffensiveAbilityDamageStatus = "supported" | "unsupported" | "no-modifier";

export function getOffensiveAbilityDamageStatus(nameJa: string): OffensiveAbilityDamageStatus {
  if (SUPPORTED_OFFENSIVE_ABILITIES.has(nameJa)) return "supported";
  if (UNSUPPORTED_OFFENSIVE_ABILITIES.has(nameJa)) return "unsupported";
  return "no-modifier";
}

export function getDefaultAbilityName(abilities: DamageChartAbility[]): string | null {
  if (abilities.length === 1) return abilities[0].nameJa;
  const withUsage = abilities.filter((ability) => ability.percentageValue !== null && Number.isFinite(ability.percentageValue));
  if (!withUsage.length) return null;
  return withUsage.reduce((top, ability) => ability.percentageValue! > top.percentageValue! ? ability : top).nameJa;
}

function pokeRound(value: number): number {
  return value % 1 > 0.5 ? Math.ceil(value) : Math.floor(value);
}

function applyFixedModifier(value: number, modifier: number): number {
  if (value <= 0) return 0;
  return Math.max(1, pokeRound(value * modifier / 4096));
}

export const ATTACK_PATTERNS = [
  { id: "zero", physicalLabel: "A0", specialLabel: "C0", ev: 0, nature: 1 },
  { id: "max", physicalLabel: "A252", specialLabel: "C252", ev: 252, nature: 1 },
  { id: "max-plus", physicalLabel: "A252+", specialLabel: "C252+", ev: 252, nature: 1.1 },
] as const;

export const DEFENSE_PATTERNS = [
  { id: "zero", physicalLabel: "H0/B0", specialLabel: "H0/D0", hpEv: 0, defenseEv: 0, nature: 1 },
  { id: "hp-max", physicalLabel: "H252/B0", specialLabel: "H252/D0", hpEv: 252, defenseEv: 0, nature: 1 },
  { id: "max-plus", physicalLabel: "H252/B252+", specialLabel: "H252/D252+", hpEv: 252, defenseEv: 252, nature: 1.1 },
] as const;

// 威力欄だけでは通常ダメージを確定できない技。試作版では一覧から除外する。
const UNSUPPORTED_MOVE_IDS = new Set([
  "49", "67", "68", "69", "82", "101", "117", "149", "162", "175", "179", "216", "217", "218", "222",
  "243", "251", "255", "283", "284", "323", "360", "363", "368", "374", "376", "378", "386", "447", "462",
  "484", "486", "500", "515", "535", "820", "912",
]);

export function isSupportedDamageMove(move: {
  id: string;
  damageClass: DamageClass;
  power: number | null;
  descriptionJa?: string | null;
}, isCoverageMove: boolean): move is typeof move & { damageClass: "physical" | "special"; power: number } {
  if (!isCoverageMove || (move.damageClass !== "physical" && move.damageClass !== "special")) return false;
  if (move.power === null || move.power <= 0 || UNSUPPORTED_MOVE_IDS.has(move.id)) return false;
  // 連続技は1発分の威力しか保持しないため、総ダメージを誤表示しないよう除外する。
  if (move.descriptionJa && /(?:回|回数).*連続|連続で攻撃/.test(move.descriptionJa)) return false;
  return true;
}

export function calculateHpStat(base: number, ev: number): number {
  return Math.floor((2 * base + 31 + Math.floor(ev / 4)) * 50 / 100) + 60;
}

export function calculateBattleStat(base: number, ev: number, nature: number): number {
  const neutral = Math.floor((2 * base + 31 + Math.floor(ev / 4)) * 50 / 100) + 5;
  return Math.floor(neutral * nature);
}

function hitLabel(minDamage: number, maxDamage: number, hp: number): string {
  if (maxDamage <= 0) return "無効";
  const possibleHits = Math.ceil(hp / maxDamage);
  const guaranteedHits = Math.ceil(hp / minDamage);
  return possibleHits === guaranteedHits ? `確${guaranteedHits}` : `乱${possibleHits}`;
}

export function calculateDamage(options: {
  attacker: DamageChartPokemon;
  defender: DamageChartPokemon;
  move: DamageChartMove;
  attackEv: number;
  attackNature: number;
  hpEv: number;
  defenseEv: number;
  defenseNature: number;
  attackerAbility?: string | null;
  defenderAbility?: string | null;
  itemDamageModifier?: ItemDamageModifier;
}): DamageResult {
  const { attacker, defender, move } = options;
  const physical = move.damageClass === "physical";
  const attackBase = physical ? attacker.baseStats.attack : attacker.baseStats.specialAttack;
  const defenseBase = physical ? defender.baseStats.defense : defender.baseStats.specialDefense;
  let attack = calculateBattleStat(attackBase, options.attackEv, options.attackNature);
  const defense = calculateBattleStat(defenseBase, options.defenseEv, options.defenseNature);
  const hp = calculateHpStat(defender.baseStats.hp, options.hpEv);
  let power = move.power;
  if (options.attackerAbility === "テクニシャン" && power <= 60) power = applyFixedModifier(power, 6144);
  if (options.attackerAbility === "かたいツメ" && move.isContact) power = applyFixedModifier(power, 5325);
  if (physical && (options.attackerAbility === "ちからもち" || options.attackerAbility === "ヨガパワー")) attack = applyFixedModifier(attack, 8192);
  const baseDamage = Math.floor(Math.floor(Math.floor((2 * 50 / 5 + 2) * power * attack / defense) / 50) + 2);
  const isStab = attacker.types.includes(move.type);
  const stab = isStab ? options.attackerAbility === "てきおうりょく" ? 2 : 1.5 : 1;
  const typeMultiplier = getTypeMultiplier(move.type, defender.types);
  const itemFinalMod = ITEM_FINAL_MODS[options.itemDamageModifier ?? 1];
  const maxDamage = applyFixedModifier(Math.floor(baseDamage * stab * typeMultiplier), itemFinalMod);
  const minDamage = applyFixedModifier(Math.floor(baseDamage * stab * typeMultiplier * 0.85), itemFinalMod);
  return {
    minDamage,
    maxDamage,
    minPercent: minDamage / hp * 100,
    maxPercent: maxDamage / hp * 100,
    hitLabel: hitLabel(minDamage, maxDamage, hp),
  };
}

export function damageBarColor(maxPercent: number): string {
  if (maxPercent >= 100) return "bg-red-500";
  if (maxPercent >= 75) return "bg-orange-500";
  if (maxPercent >= 50) return "bg-amber-500";
  if (maxPercent >= 25) return "bg-sky-500";
  return "bg-blue-300";
}
