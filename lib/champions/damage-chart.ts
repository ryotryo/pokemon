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
  tags: Array<"punch" | "sound" | "slicing" | "ballistic" | "pulse" | "bite" | "recoil">;
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
  effectiveMoveType: string;
  effectivePower: number;
}

export interface DamageStatProfile {
  attack: "attack" | "specialAttack";
  defense: "defense" | "specialDefense";
}

// Championsの技説明で、技分類と異なる参照能力が明記されている技。
// 分類とは独立して攻撃側・防御側の能力を解決し、例外を計算と表示で共有する。
const MOVE_STAT_OVERRIDES: Record<string, Partial<DamageStatProfile>> = {
  "473": { defense: "defense" }, // サイコショック
};

export function getDamageStatProfile(move: Pick<DamageChartMove, "id" | "damageClass">): DamageStatProfile {
  const defaults: DamageStatProfile = move.damageClass === "physical"
    ? { attack: "attack", defense: "defense" }
    : { attack: "specialAttack", defense: "specialDefense" };
  return { ...defaults, ...MOVE_STAT_OVERRIDES[move.id] };
}

export const ITEM_DAMAGE_MODIFIERS = [1, 1.1, 1.2, 1.3, 1.5] as const;
export type ItemDamageModifier = typeof ITEM_DAMAGE_MODIFIERS[number];

const TYPE_CHANGE_ABILITIES: Record<string, { fromType: string | null; toType: string; powerModifier: number }> = {
  スカイスキン: { fromType: "normal", toType: "flying", powerModifier: 4915 },
  フェアリースキン: { fromType: "normal", toType: "fairy", powerModifier: 4915 },
  フリーズスキン: { fromType: "normal", toType: "ice", powerModifier: 4915 },
  エレキスキン: { fromType: "normal", toType: "electric", powerModifier: 4915 },
  ドラゴンスキン: { fromType: "normal", toType: "dragon", powerModifier: 4915 },
  うるおいボイス: { fromType: null, toType: "water", powerModifier: 4096 },
};

const IMPLEMENTED_DAMAGE_ABILITIES = new Set([
  ...Object.keys(TYPE_CHANGE_ABILITIES),
  "あついしぼう", "うなぎのぼり", "おやこあい", "かたいツメ", "かたやぶり", "カブトアーマー", "がんじょう", "がんじょうあご",
  "かんそうはだ", "きもったま", "きよめのしお", "きれあじ", "すいほう", "そうしょく", "たいねつ", "ちからもち",
  "ちくでん", "ちょすい", "てきおうりょく", "テクニシャン", "てつのこぶし", "でんきエンジン", "どしょく",
  "すてみ", "ハードロック", "はがねのせいしん", "はどうのぼうご", "はりきり", "パンクロック", "ひらいしん", "ファーコート",
  "フィルター", "フェアリーオーラ", "ふゆう", "マルチスケイル", "メガランチャー", "もふもふ", "もらいび",
  "ヨガパワー", "シェルアーマー", "ぼうおん", "ぼうだん", "ほのおのたてがみ",
]);

// 技1回の直接ダメージには反映しないと監査済み。説明文の「ダメージ」に反応するcoverage判定の例外だけを置く。
const AUDITED_NO_DIRECT_DAMAGE_ABILITIES = new Set(["すながくれ", "ぼうじん", "フレンドガード"]);

export const CONDITIONAL_DAMAGE_ABILITIES: Record<string, string> = {
  アナライズ: "後攻した時だけ威力が変わります",
  あまのじゃく: "対戦中の能力変化によって実数値が変わります",
  あめふらし: "天候と登場順によってダメージが変わります",
  いかく: "登場順・能力変化・相手の特性によって変わります",
  いかりのつぼ: "急所を受けて発動済みかで変わります",
  うなぎのぼり: "地面技の無効化は反映。相手を倒した後の能力上昇は含みません",
  エレキメイカー: "エレキフィールドと登場順によってダメージが変わります",
  かちき: "能力を下げられて発動済みかで変わります",
  かわりもの: "変身先の能力・タイプ・特性によって変わります",
  かんつうドリル: "相手が守る状態の時だけダメージが発生します",
  ぎたい: "現在のフィールドによってタイプが変わります",
  ぎゃくじょう: "攻撃を受けて発動済みかで変わります",
  くさのけがわ: "グラスフィールド時だけ防御が変わります",
  くだけるよろい: "物理技を受けた後かで防御が変わります",
  グラスメイカー: "グラスフィールドと登場順によってダメージが変わります",
  げきりゅう: "残りHPが1/3以下の時だけ発動します",
  こぼれダネ: "攻撃を受けてグラスフィールドが発生済みかで変わります",
  こんじょう: "状態異常の時だけ攻撃が変わります",
  サイコメイカー: "サイコフィールドと登場順によってダメージが変わります",
  サンパワー: "晴れの時だけ特攻が変わります",
  じきゅうりょく: "攻撃を受けた後かで防御が変わります",
  じしんかじょう: "相手を倒して発動済みかで変わります",
  しんりょく: "残りHPが1/3以下の時だけ発動します",
  スキルリンク: "連続技は早見表の固定威力対象外です",
  すなのちから: "砂嵐の時だけ特定タイプの威力が変わります",
  すなおこし: "砂嵐と登場順によって防御側の特防が変わります",
  すなはき: "攻撃を受けて砂嵐が発生済みかで変わります",
  せいぎのこころ: "悪技を受けて攻撃が上がった後かで変わります",
  そうだいしょう: "倒された味方の数で威力が変わります",
  そうしょく: "草技の無効化は反映。発動後の攻撃上昇は含みません",
  ちからずく: "追加効果の有無を現在の技データだけでは全件判定できません",
  でんきにかえる: "攻撃を受けて発動済みかで変わります",
  てんきや: "現在の天候によってタイプが変わります",
  とうそうしん: "相手との性別の組み合わせで変わります",
  トレース: "コピーした相手の特性によって変わります",
  はりこみ: "相手が交代で出てきたターンだけ発動します",
  ひでり: "天候と登場順によってダメージが変わります",
  ひとでなし: "相手がどく・もうどく状態かで変わります",
  ひらいしん: "電気技の無効化は反映。発動後の特攻上昇は含みません",
  バトルスイッチ: "技を出す前のフォルムによって能力値が変わります",
  ばけのかわ: "ばけたすがたが残っている最初の攻撃だけ受け方が変わります",
  びんじょう: "相手からコピーした能力上昇によって変わります",
  へんげんじざい: "その登場中に既に発動したかでタイプが変わります",
  プラス: "場の味方の特性によって特攻が変わります",
  ふかしのこぶし: "相手が守る状態の時だけダメージが発生します",
  ふしぎなうろこ: "状態異常の時だけ防御が変わります",
  マイナス: "場の味方の特性によって特攻が変わります",
  まけんき: "能力を下げられて発動済みかで変わります",
  マイティチェンジ: "交代後のフォルムによって能力値が変わります",
  むしのしらせ: "残りHPが1/3以下の時だけ発動します",
  ムラっけ: "発生済みのランダムな能力変化によって変わります",
  メガソーラー: "晴れ扱いになる技・特性との組み合わせで変わります",
  もうか: "残りHPが1/3以下の時だけ発動します",
  もらいび: "炎技の無効化は反映。発動後の炎技強化は含みません",
  ねつこうかん: "炎技を受けて攻撃が上がった後かで変わります",
  はらぺこスイッチ: "現在のフォルムによって専用技のタイプが変わります",
  ばんけん: "いかくを受けて攻撃が上がった後かで変わります",
  ゆきふらし: "雪と登場順によって防御側の防御が変わります",
  リベロ: "その登場中に既に発動したかでタイプが変わります",
  レシーバー: "倒れた味方から受け継いだ特性によって変わります",
  スナイパー: "急所に当たった時だけ倍率が変わります",
};

const TOGGLEABLE_DAMAGE_ABILITIES = new Set([
  "アナライズ", "くさのけがわ", "げきりゅう", "こんじょう", "サンパワー", "しんりょく", "すなのちから",
  "はりこみ", "ひとでなし", "プラス", "ふしぎなうろこ", "へんげんじざい", "マイナス", "むしのしらせ",
  "もうか", "もらいび", "リベロ", "スナイパー",
]);

export function isAbilityConditionToggleAvailable(nameJa: string | null): boolean {
  return Boolean(nameJa && TOGGLEABLE_DAMAGE_ABILITIES.has(nameJa));
}
const ITEM_FINAL_MODS: Record<ItemDamageModifier, number> = { 1: 4096, 1.1: 4505, 1.2: 4915, 1.3: 5324, 1.5: 6144 };

export type AbilityDamageStatus = "supported" | "conditional" | "no-modifier";

export function getAbilityDamageStatus(nameJa: string): AbilityDamageStatus {
  if (CONDITIONAL_DAMAGE_ABILITIES[nameJa]) return "conditional";
  if (IMPLEMENTED_DAMAGE_ABILITIES.has(nameJa)) return "supported";
  return "no-modifier";
}

export function getAbilityDamageNote(nameJa: string | null): string | null {
  return nameJa ? CONDITIONAL_DAMAGE_ABILITIES[nameJa] ?? null : null;
}

export function isPotentialDamageAbilityDescription(description: string | null): boolean {
  return Boolean(description && /(?:技の威力|受けるダメージ|物理技の威力|物理技で受けるダメージ|特攻が１．５倍|攻撃が１．５倍|タイプの技が効かず|タイプの技が[^。]*タイプになり|タイプの技を[^。]*当てる|親と子で２回攻撃|ＨＰが満タンの時[^。]*受けるダメージ|効果バツグンの技で[^。]*受けるダメージ)/.test(description));
}

export function isAbilityDamageClassificationKnown(nameJa: string, description: string | null): boolean {
  return IMPLEMENTED_DAMAGE_ABILITIES.has(nameJa)
    || Boolean(CONDITIONAL_DAMAGE_ABILITIES[nameJa])
    || AUDITED_NO_DIRECT_DAMAGE_ABILITIES.has(nameJa)
    || !isPotentialDamageAbilityDescription(description);
}

export function getEffectiveMove(move: Pick<DamageChartMove, "type" | "power" | "tags">, attackerAbility?: string | null) {
  const conversion = attackerAbility ? TYPE_CHANGE_ABILITIES[attackerAbility] : undefined;
  const applies = conversion && (conversion.fromType === null || move.type === conversion.fromType)
    && (attackerAbility !== "うるおいボイス" || move.tags.includes("sound"));
  return {
    type: applies ? conversion.toType : move.type,
    power: applies ? applyFixedModifier(move.power, conversion.powerModifier) : move.power,
  };
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

export function getAttackPatternLabel(move: Pick<DamageChartMove, "id" | "damageClass">, pattern: typeof ATTACK_PATTERNS[number]): string {
  return getDamageStatProfile(move).attack === "attack" ? pattern.physicalLabel : pattern.specialLabel;
}

export function getDefensePatternLabel(move: Pick<DamageChartMove, "id" | "damageClass">, pattern: typeof DEFENSE_PATTERNS[number]): string {
  return getDamageStatProfile(move).defense === "defense" ? pattern.physicalLabel : pattern.specialLabel;
}

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
  attackerAbilityCondition?: boolean;
  defenderAbilityCondition?: boolean;
  itemDamageModifier?: ItemDamageModifier;
}): DamageResult {
  const { attacker, defender, move } = options;
  const physical = move.damageClass === "physical";
  const statProfile = getDamageStatProfile(move);
  const attackBase = attacker.baseStats[statProfile.attack];
  const defenseBase = defender.baseStats[statProfile.defense];
  let attack = calculateBattleStat(attackBase, options.attackEv, options.attackNature);
  let defense = calculateBattleStat(defenseBase, options.defenseEv, options.defenseNature);
  const hp = calculateHpStat(defender.baseStats.hp, options.hpEv);
  const effectiveMove = getEffectiveMove(move, options.attackerAbility);
  const effectiveType = effectiveMove.type;
  let power = effectiveMove.power;
  if (options.attackerAbility === "テクニシャン" && power <= 60) power = applyFixedModifier(power, 6144);
  if (options.attackerAbility === "かたいツメ" && move.isContact) power = applyFixedModifier(power, 5325);
  if (options.attackerAbility === "がんじょうあご" && move.tags.includes("bite")) power = applyFixedModifier(power, 6144);
  if (options.attackerAbility === "きれあじ" && move.tags.includes("slicing")) power = applyFixedModifier(power, 6144);
  if (options.attackerAbility === "てつのこぶし" && move.tags.includes("punch")) power = applyFixedModifier(power, 4915);
  if (options.attackerAbility === "メガランチャー" && move.tags.includes("pulse")) power = applyFixedModifier(power, 6144);
  if (options.attackerAbility === "パンクロック" && move.tags.includes("sound")) power = applyFixedModifier(power, 5325);
  if (options.attackerAbility === "すてみ" && move.tags.includes("recoil")) power = applyFixedModifier(power, 4915);
  if (options.attackerAbilityCondition && options.attackerAbility === "アナライズ") power = applyFixedModifier(power, 5325);
  if (options.attackerAbilityCondition && options.attackerAbility === "すなのちから" && ["rock", "ground", "steel"].includes(effectiveType)) power = applyFixedModifier(power, 5325);
  if (options.attackerAbility === "ほのおのたてがみ" && effectiveType === "fire") power = applyFixedModifier(power, 6144);
  if (options.attackerAbility === "はがねのせいしん" && effectiveType === "steel") power = applyFixedModifier(power, 6144);
  if ((options.attackerAbility === "フェアリーオーラ" || options.defenderAbility === "フェアリーオーラ") && effectiveType === "fairy") power = applyFixedModifier(power, 5448);
  if (options.attackerAbility === "すいほう" && effectiveType === "water") attack = applyFixedModifier(attack, 8192);
  if (physical && (options.attackerAbility === "ちからもち" || options.attackerAbility === "ヨガパワー")) attack = applyFixedModifier(attack, 8192);
  if (physical && options.attackerAbility === "はりきり") attack = applyFixedModifier(attack, 6144);
  if (options.attackerAbilityCondition && ((options.attackerAbility === "げきりゅう" && effectiveType === "water")
    || (options.attackerAbility === "しんりょく" && effectiveType === "grass")
    || (options.attackerAbility === "むしのしらせ" && effectiveType === "bug")
    || (options.attackerAbility === "もうか" && effectiveType === "fire"))) attack = applyFixedModifier(attack, 6144);
  if (physical && options.attackerAbilityCondition && options.attackerAbility === "こんじょう") attack = applyFixedModifier(attack, 6144);
  if (!physical && options.attackerAbilityCondition && options.attackerAbility === "サンパワー") attack = applyFixedModifier(attack, 6144);
  if (!physical && options.attackerAbilityCondition && (options.attackerAbility === "プラス" || options.attackerAbility === "マイナス")) attack = applyFixedModifier(attack, 6144);
  if (options.attackerAbilityCondition && options.attackerAbility === "はりこみ") attack = applyFixedModifier(attack, 8192);
  if (options.attackerAbilityCondition && options.attackerAbility === "もらいび" && effectiveType === "fire") attack = applyFixedModifier(attack, 6144);
  if (physical && options.defenderAbility === "ファーコート" && options.attackerAbility !== "かたやぶり") defense = applyFixedModifier(defense, 8192);
  if (physical && options.defenderAbilityCondition && options.attackerAbility !== "かたやぶり" && (options.defenderAbility === "くさのけがわ" || options.defenderAbility === "ふしぎなうろこ")) defense = applyFixedModifier(defense, 6144);
  const ignoresDefenderAbility = options.attackerAbility === "かたやぶり";
  const defenderAbility = ignoresDefenderAbility ? null : options.defenderAbility;
  if (defenderAbility === "あついしぼう" && (effectiveType === "fire" || effectiveType === "ice")) attack = applyFixedModifier(attack, 2048);
  if (defenderAbility === "きよめのしお" && effectiveType === "ghost") attack = applyFixedModifier(attack, 2048);
  if (defenderAbility === "すいほう" && effectiveType === "fire") attack = applyFixedModifier(attack, 2048);
  if (defenderAbility === "たいねつ" && effectiveType === "fire") attack = applyFixedModifier(attack, 2048);
  const baseDamage = Math.floor(Math.floor(Math.floor((2 * 50 / 5 + 2) * power * attack / defense) / 50) + 2);
  const abilityChangesUserType = options.attackerAbilityCondition && (options.attackerAbility === "へんげんじざい" || options.attackerAbility === "リベロ");
  const isStab = abilityChangesUserType || attacker.types.includes(effectiveType);
  const stab = isStab ? options.attackerAbility === "てきおうりょく" ? 2 : 1.5 : 1;
  const defenderTypes = options.attackerAbility === "きもったま" && (effectiveType === "normal" || effectiveType === "fighting")
    ? defender.types.filter((type) => type !== "ghost")
    : defender.types;
  let typeMultiplier = getTypeMultiplier(effectiveType, defenderTypes);
  const immunityTypes: Record<string, string[]> = {
    うなぎのぼり: ["ground"],
    かんそうはだ: ["water"],
    そうしょく: ["grass"],
    ちくでん: ["electric"],
    ちょすい: ["water"],
    でんきエンジン: ["electric"],
    どしょく: ["ground"],
    ひらいしん: ["electric"],
    ふゆう: ["ground"],
    もらいび: ["fire"],
  };
  if (defenderAbility && immunityTypes[defenderAbility]?.includes(effectiveType)) typeMultiplier = 0;
  if (defenderAbility === "ぼうおん" && move.tags.includes("sound")) typeMultiplier = 0;
  if (defenderAbility === "ぼうだん" && move.tags.includes("ballistic")) typeMultiplier = 0;
  const itemFinalMod = ITEM_FINAL_MODS[options.itemDamageModifier ?? 1];
  let defensiveModifier = 4096;
  if (defenderAbility === "かんそうはだ" && effectiveType === "fire") defensiveModifier = applyFixedModifier(defensiveModifier, 5120);
  if ((defenderAbility === "ハードロック" || defenderAbility === "フィルター") && typeMultiplier > 1) defensiveModifier = applyFixedModifier(defensiveModifier, 3072);
  if (defenderAbility === "はどうのぼうご" && move.isContact) defensiveModifier = applyFixedModifier(defensiveModifier, 2048);
  if (defenderAbility === "パンクロック" && move.tags.includes("sound")) defensiveModifier = applyFixedModifier(defensiveModifier, 2048);
  if (defenderAbility === "もふもふ" && move.isContact) defensiveModifier = applyFixedModifier(defensiveModifier, 2048);
  if (defenderAbility === "もふもふ" && effectiveType === "fire") defensiveModifier = applyFixedModifier(defensiveModifier, 8192);
  const criticalBlocked = defenderAbility === "シェルアーマー" || defenderAbility === "カブトアーマー";
  const critical = !criticalBlocked && options.attackerAbilityCondition && (options.attackerAbility === "ひとでなし" || options.attackerAbility === "スナイパー");
  const criticalModifier = critical ? options.attackerAbility === "スナイパー" ? 2.25 : 1.5 : 1;
  const calculateHit = (randomModifier: number, child = false) => {
    const hitBaseDamage = child ? applyFixedModifier(baseDamage, 1024) : baseDamage;
    const multiscaleModifier = defenderAbility === "マルチスケイル" && !child ? 2048 : 4096;
    const raw = Math.floor(hitBaseDamage * criticalModifier * stab * typeMultiplier * randomModifier);
    return applyFixedModifier(applyFixedModifier(applyFixedModifier(raw, itemFinalMod), defensiveModifier), multiscaleModifier);
  };
  let maxDamage = calculateHit(1);
  let minDamage = calculateHit(0.85);
  if (defenderAbility === "がんじょう" && hp > 1) {
    maxDamage = Math.min(maxDamage, hp - 1);
    minDamage = Math.min(minDamage, hp - 1);
  }
  if (options.attackerAbility === "おやこあい" && typeMultiplier > 0) {
    maxDamage += calculateHit(1, true);
    minDamage += calculateHit(0.85, true);
  }
  return {
    minDamage,
    maxDamage,
    minPercent: minDamage / hp * 100,
    maxPercent: maxDamage / hp * 100,
    hitLabel: hitLabel(minDamage, maxDamage, hp),
    effectiveMoveType: effectiveType,
    effectivePower: power,
  };
}

export function damageBarColor(maxPercent: number): string {
  if (maxPercent >= 100) return "bg-red-500";
  if (maxPercent >= 75) return "bg-orange-500";
  if (maxPercent >= 50) return "bg-amber-500";
  if (maxPercent >= 25) return "bg-sky-500";
  return "bg-blue-300";
}
