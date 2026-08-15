import { describe, expect, it } from "vitest";
import {
  calculateBattleStat,
  calculateDamage,
  calculateHpStat,
  getDefaultAbilityName,
  getOffensiveAbilityDamageStatus,
  isSupportedDamageMove,
  type DamageChartMove,
  type DamageChartPokemon,
} from "../../lib/champions/damage-chart";

function pokemon(overrides: Partial<DamageChartPokemon> = {}): DamageChartPokemon {
  return {
    id: "test",
    displayNameJa: "テスト",
    types: ["normal"],
    sprite: "",
    baseStats: { hp: 100, attack: 100, defense: 100, specialAttack: 100, specialDefense: 100, speed: 100 },
    ranks: { Singles: 1, Doubles: 1 },
    moves: { Singles: [], Doubles: [] },
    abilities: { Singles: [], Doubles: [] },
    ...overrides,
  };
}

const move: DamageChartMove = {
  id: "test-move",
  nameJa: "テスト技",
  type: "normal",
  damageClass: "physical",
  power: 100,
  usage: null,
  rank: 1,
  isContact: true,
};

describe("damage chart stats", () => {
  it("calculates level 50 HP with IV 31", () => {
    expect(calculateHpStat(100, 0)).toBe(175);
    expect(calculateHpStat(100, 252)).toBe(207);
  });

  it("calculates level 50 battle stats with EV and nature", () => {
    expect(calculateBattleStat(100, 0, 1)).toBe(120);
    expect(calculateBattleStat(100, 252, 1)).toBe(152);
    expect(calculateBattleStat(100, 252, 1.1)).toBe(167);
  });
});

describe("calculateDamage", () => {
  it("uses the standard level 50 damage range", () => {
    const result = calculateDamage({
      attacker: pokemon(), defender: pokemon(), move,
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    expect(result.minDamage).toBe(58);
    expect(result.maxDamage).toBe(69);
    expect(result.hitLabel).toBe("乱3");
  });

  it("applies STAB and compound type effectiveness", () => {
    const result = calculateDamage({
      attacker: pokemon({ types: ["fire"] }),
      defender: pokemon({ types: ["grass", "steel"] }),
      move: { ...move, type: "fire" },
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    expect(result.minDamage).toBe(234);
    expect(result.maxDamage).toBe(276);
    expect(result.hitLabel).toBe("確1");
  });

  it("uses special attack and special defense for special moves", () => {
    const attacker = pokemon({ baseStats: { hp: 100, attack: 20, defense: 100, specialAttack: 150, specialDefense: 100, speed: 100 } });
    const defender = pokemon({ baseStats: { hp: 100, attack: 100, defense: 200, specialAttack: 100, specialDefense: 50, speed: 100 } });
    const special = calculateDamage({
      attacker, defender, move: { ...move, damageClass: "special" },
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    const physical = calculateDamage({
      attacker, defender, move,
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    expect(special.maxDamage).toBeGreaterThan(physical.maxDamage);
  });

  it("returns zero for an immune target", () => {
    const result = calculateDamage({
      attacker: pokemon({ types: ["electric"] }), defender: pokemon({ types: ["ground"] }),
      move: { ...move, type: "electric" },
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    expect(result.maxDamage).toBe(0);
    expect(result.hitLabel).toBe("無効");
  });

  it("applies the selected item multiplier as a final damage modifier", () => {
    const result = calculateDamage({
      attacker: pokemon(), defender: pokemon(), move,
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
      itemDamageModifier: 1.3,
    });
    expect(result.minDamage).toBe(75);
    expect(result.maxDamage).toBe(90);
  });

  it("applies Huge Power and Pure Power only to physical attacks", () => {
    const options = { attacker: pokemon(), defender: pokemon(), attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1 } as const;
    const boosted = calculateDamage({ ...options, move, attackerAbility: "ちからもち" });
    const special = calculateDamage({ ...options, move: { ...move, damageClass: "special" }, attackerAbility: "ヨガパワー" });
    const unboostedSpecial = calculateDamage({ ...options, move: { ...move, damageClass: "special" } });
    expect(boosted.maxDamage).toBe(135);
    expect(special).toEqual(unboostedSpecial);
  });

  it("applies Technician only when the move power is 60 or lower", () => {
    const options = { attacker: pokemon(), defender: pokemon(), attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1 } as const;
    const boosted = calculateDamage({ ...options, move: { ...move, power: 60 }, attackerAbility: "テクニシャン" });
    const overLimit = calculateDamage({ ...options, move: { ...move, power: 61 }, attackerAbility: "テクニシャン" });
    const unboostedOverLimit = calculateDamage({ ...options, move: { ...move, power: 61 } });
    expect(boosted.maxDamage).toBe(61);
    expect(overLimit).toEqual(unboostedOverLimit);
  });

  it("applies Tough Claws only to contact moves", () => {
    const options = { attacker: pokemon(), defender: pokemon(), attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1 } as const;
    const boosted = calculateDamage({ ...options, move, attackerAbility: "かたいツメ" });
    const nonContact = calculateDamage({ ...options, move: { ...move, isContact: false }, attackerAbility: "かたいツメ" });
    const baseline = calculateDamage({ ...options, move: { ...move, isContact: false } });
    expect(boosted.maxDamage).toBeGreaterThan(baseline.maxDamage);
    expect(nonContact).toEqual(baseline);
  });

  it("applies Adaptability only to same-type attacks and safely ignores other abilities", () => {
    const options = { attacker: pokemon(), defender: pokemon(), attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1 } as const;
    const adapted = calculateDamage({ ...options, move, attackerAbility: "てきおうりょく" });
    const baseline = calculateDamage({ ...options, move });
    const unsupported = calculateDamage({ ...options, move, attackerAbility: "がんじょうあご" });
    const noModifier = calculateDamage({ ...options, move, attackerAbility: "さめはだ" });
    expect(adapted.maxDamage).toBe(92);
    expect(unsupported).toEqual(baseline);
    expect(noModifier).toEqual(baseline);
  });
});

describe("damage ability support", () => {
  it("separates supported, unsupported, and non-modifying abilities", () => {
    expect(getOffensiveAbilityDamageStatus("テクニシャン")).toBe("supported");
    expect(getOffensiveAbilityDamageStatus("がんじょうあご")).toBe("unsupported");
    expect(getOffensiveAbilityDamageStatus("さめはだ")).toBe("no-modifier");
    expect(getOffensiveAbilityDamageStatus("クリアボディ")).toBe("no-modifier");
  });

  it("defaults one ability, otherwise uses the highest real usage rate", () => {
    expect(getDefaultAbilityName([{ nameJa: "かたいツメ", descriptionJa: null, percentageValue: null }])).toBe("かたいツメ");
    expect(getDefaultAbilityName([
      { nameJa: "A", descriptionJa: null, percentageValue: 25 },
      { nameJa: "B", descriptionJa: null, percentageValue: 70 },
    ])).toBe("B");
  });

  it("does not guess when multiple abilities have no usage data", () => {
    expect(getDefaultAbilityName([
      { nameJa: "A", descriptionJa: null, percentageValue: null },
      { nameJa: "B", descriptionJa: null, percentageValue: null },
    ])).toBeNull();
  });
});

describe("isSupportedDamageMove", () => {
  it("keeps ordinary attacks", () => {
    expect(isSupportedDamageMove({ id: "89", damageClass: "physical", power: 100 }, true)).toBe(true);
  });

  it("excludes status, fixed/counter, and multi-hit moves", () => {
    expect(isSupportedDamageMove({ id: "182", damageClass: "status", power: null }, false)).toBe(false);
    expect(isSupportedDamageMove({ id: "68", damageClass: "physical", power: 1 }, true)).toBe(false);
    expect(isSupportedDamageMove({ id: "999", damageClass: "physical", power: 25, descriptionJa: "2〜5回連続で攻撃する。" }, true)).toBe(false);
  });
});
