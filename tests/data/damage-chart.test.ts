import { describe, expect, it } from "vitest";
import {
  calculateBattleStat,
  calculateDamage,
  calculateHpStat,
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
