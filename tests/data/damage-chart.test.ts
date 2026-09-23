import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ATTACK_PATTERNS,
  DEFENSE_PATTERNS,
  calculateBattleStat,
  calculateDamage,
  calculateHpStat,
  getAttackPatternLabel,
  getDamageStatProfile,
  getDefaultAbilityName,
  getDefensePatternLabel,
  getAbilityDamageStatus,
  getEffectiveMove,
  isAbilityDamageClassificationKnown,
  isPotentialDamageAbilityDescription,
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
  tags: [],
};

const psyshock: DamageChartMove = {
  ...move,
  id: "473",
  nameJa: "サイコショック",
  type: "psychic",
  damageClass: "special",
  power: 80,
  isContact: false,
  tags: [],
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

  it("uses special attack and physical defense for Psyshock", () => {
    const attacker = pokemon({ baseStats: { hp: 100, attack: 20, defense: 100, specialAttack: 150, specialDefense: 100, speed: 100 } });
    const defender = pokemon({ baseStats: { hp: 100, attack: 100, defense: 200, specialAttack: 100, specialDefense: 50, speed: 100 } });
    const result = calculateDamage({
      attacker, defender, move: psyshock,
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    const higherSpecialDefense = calculateDamage({
      attacker,
      defender: pokemon({ baseStats: { ...defender.baseStats, specialDefense: 200 } }),
      move: psyshock,
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    const lowerDefense = calculateDamage({
      attacker,
      defender: pokemon({ baseStats: { ...defender.baseStats, defense: 50 } }),
      move: psyshock,
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    const lowerSpecialAttack = calculateDamage({
      attacker: pokemon({ baseStats: { ...attacker.baseStats, attack: 200, specialAttack: 50 } }),
      defender,
      move: psyshock,
      attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
    });
    expect(result).toEqual(higherSpecialDefense);
    expect(lowerDefense.maxDamage).toBeGreaterThan(result.maxDamage);
    expect(lowerSpecialAttack.maxDamage).toBeLessThan(result.maxDamage);
  });

  it("changes Psyshock damage across C and B investment patterns", () => {
    const options = { attacker: pokemon(), defender: pokemon(), move: psyshock, hpEv: 0 } as const;
    const c0 = calculateDamage({ ...options, attackEv: 0, attackNature: 1, defenseEv: 0, defenseNature: 1 });
    const c252 = calculateDamage({ ...options, attackEv: 252, attackNature: 1, defenseEv: 0, defenseNature: 1 });
    const c252Plus = calculateDamage({ ...options, attackEv: 252, attackNature: 1.1, defenseEv: 0, defenseNature: 1 });
    const b252Plus = calculateDamage({ ...options, attackEv: 252, attackNature: 1.1, defenseEv: 252, defenseNature: 1.1 });
    expect(c252.maxDamage).toBeGreaterThan(c0.maxDamage);
    expect(c252Plus.maxDamage).toBeGreaterThan(c252.maxDamage);
    expect(b252Plus.maxDamage).toBeLessThan(c252Plus.maxDamage);
  });

  it("applies the H0/B0, H252/B0, and H252/B252+ defensive grid to Psyshock", () => {
    const results = DEFENSE_PATTERNS.map((pattern) => calculateDamage({
      attacker: pokemon(), defender: pokemon(), move: psyshock,
      attackEv: 0, attackNature: 1,
      hpEv: pattern.hpEv, defenseEv: pattern.defenseEv, defenseNature: pattern.nature,
    }));
    expect(results[1].maxDamage).toBe(results[0].maxDamage);
    expect(results[1].maxPercent).toBeLessThan(results[0].maxPercent);
    expect(results[2].maxDamage).toBeLessThan(results[1].maxDamage);
  });

  it("keeps ordinary special moves dependent on special defense, not defense", () => {
    const specialMove = { ...move, id: "53", damageClass: "special" as const };
    const options = { attacker: pokemon(), move: specialMove, attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1 } as const;
    const baseline = calculateDamage({ ...options, defender: pokemon() });
    const higherDefense = calculateDamage({ ...options, defender: pokemon({ baseStats: { ...pokemon().baseStats, defense: 200 } }) });
    const higherSpecialDefense = calculateDamage({ ...options, defender: pokemon({ baseStats: { ...pokemon().baseStats, specialDefense: 200 } }) });
    expect(higherDefense).toEqual(baseline);
    expect(higherSpecialDefense.maxDamage).toBeLessThan(baseline.maxDamage);
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

describe("damage stat profiles", () => {
  it("keeps ordinary physical and special stat references", () => {
    expect(getDamageStatProfile(move)).toEqual({ attack: "attack", defense: "defense" });
    expect(getDamageStatProfile({ ...move, damageClass: "special" })).toEqual({ attack: "specialAttack", defense: "specialDefense" });
  });

  it("uses C labels and B labels for Psyshock's 3x3 grid", () => {
    expect(ATTACK_PATTERNS.map((pattern) => getAttackPatternLabel(psyshock, pattern))).toEqual(["C0", "C252", "C252+"]);
    expect(DEFENSE_PATTERNS.map((pattern) => getDefensePatternLabel(psyshock, pattern))).toEqual(["H0/B0", "H252/B0", "H252/B252+"]);
  });

  it("does not apply Psyshock's override to an ordinary special move", () => {
    const ordinarySpecial = { ...move, id: "53", damageClass: "special" as const };
    expect(DEFENSE_PATTERNS.map((pattern) => getDefensePatternLabel(ordinarySpecial, pattern))).toEqual(["H0/D0", "H252/D0", "H252/D252+"]);
  });
});

describe("damage ability support", () => {
  it("separates supported, unsupported, and non-modifying abilities", () => {
    expect(getAbilityDamageStatus("テクニシャン")).toBe("supported");
    expect(getAbilityDamageStatus("がんじょうあご")).toBe("supported");
    expect(getAbilityDamageStatus("アナライズ")).toBe("conditional");
    expect(getAbilityDamageStatus("さめはだ")).toBe("no-modifier");
    expect(getAbilityDamageStatus("クリアボディ")).toBe("no-modifier");
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

  it("classifies every current damage-related legal ability", () => {
    const abilities = new Map<string, string | null>();
    for (const file of readdirSync("data/usage-ranking/details")) {
      const detail = JSON.parse(readFileSync(path.join("data/usage-ranking/details", file), "utf8")) as {
        formats: Record<"Singles" | "Doubles", { abilities: Array<{ nameJa: string; descriptionJa: string | null }> }>;
      };
      for (const format of ["Singles", "Doubles"] as const) {
        for (const ability of detail.formats[format].abilities) abilities.set(ability.nameJa, ability.descriptionJa);
      }
    }
    expect(abilities.size).toBe(215);
    const unclassified = [...abilities].filter(([name, description]) => !isAbilityDamageClassificationKnown(name, description));
    expect(unclassified).toEqual([]);
    expect([...abilities].filter(([, description]) => isPotentialDamageAbilityDescription(description)).length).toBeGreaterThan(40);
  });
});

describe("damage ability integration", () => {
  const neutralOptions = {
    attackEv: 0, attackNature: 1, hpEv: 0, defenseEv: 0, defenseNature: 1,
  } as const;

  it.each([
    ["スカイスキン", "flying", ["flying"], ["grass"]],
    ["フェアリースキン", "fairy", ["fairy"], ["dragon"]],
    ["フリーズスキン", "ice", ["ice"], ["dragon"]],
    ["エレキスキン", "electric", ["electric"], ["water"]],
    ["ドラゴンスキン", "dragon", ["dragon"], ["dragon"]],
  ])("converts Normal moves before STAB and effectiveness for %s", (ability, effectiveType, attackerTypes, defenderTypes) => {
    const effective = getEffectiveMove(move, ability);
    expect(effective).toEqual({ type: effectiveType, power: 120 });
    const converted = calculateDamage({
      attacker: pokemon({ types: attackerTypes }), defender: pokemon({ types: defenderTypes }), move,
      ...neutralOptions, attackerAbility: ability,
    });
    const normal = calculateDamage({
      attacker: pokemon({ types: attackerTypes }), defender: pokemon({ types: defenderTypes }), move,
      ...neutralOptions,
    });
    expect(converted.effectiveMoveType).toBe(effectiveType);
    expect(converted.effectivePower).toBe(120);
    expect(converted.maxDamage).toBeGreaterThan(normal.maxDamage * 2);
  });

  it("uses Mega Salamence's form-specific Aerilate ability", () => {
    const mega = JSON.parse(readFileSync("data/usage-ranking/details/mega-salamence.json", "utf8")) as { formats: { Singles: { abilities: Array<{ nameJa: string }> } } };
    const base = JSON.parse(readFileSync("data/usage-ranking/details/salamence.json", "utf8")) as { formats: { Singles: { abilities: Array<{ nameJa: string }> } } };
    expect(mega.formats.Singles.abilities.map((ability) => ability.nameJa)).toEqual(["スカイスキン"]);
    expect(base.formats.Singles.abilities.map((ability) => ability.nameJa)).not.toContain("スカイスキン");
  });

  it("publishes Champions move classifications as reusable damage tags", () => {
    const moves = JSON.parse(readFileSync("data/usage-ranking/moves.json", "utf8")) as Record<string, { tags?: string[] }>;
    expect(moves["5"].tags).toContain("punch");
    expect(moves["44"].tags).toContain("bite");
    expect(moves["304"].tags).toContain("sound");
    expect(moves["406"].tags).toContain("pulse");
    expect(moves["400"].tags).toContain("slicing");
    expect(moves["402"].tags).toContain("ballistic");
    expect(moves["38"].tags).toContain("recoil");
  });

  it.each([
    ["てつのこぶし", "punch"],
    ["がんじょうあご", "bite"],
    ["きれあじ", "slicing"],
    ["メガランチャー", "pulse"],
    ["パンクロック", "sound"],
    ["すてみ", "recoil"],
  ] as const)("applies %s only to matching move metadata", (ability, tag) => {
    const tagged = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move: { ...move, tags: [tag] }, attackerAbility: ability });
    const untagged = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move, attackerAbility: ability });
    const baseline = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move });
    expect(tagged.maxDamage).toBeGreaterThan(baseline.maxDamage);
    expect(untagged).toEqual(baseline);
  });

  it("applies defensive reductions and ability immunities", () => {
    const fireMove = { ...move, type: "fire" };
    const baseline = calculateDamage({ ...neutralOptions, attacker: pokemon({ types: ["fire"] }), defender: pokemon(), move: fireMove });
    const thickFat = calculateDamage({ ...neutralOptions, attacker: pokemon({ types: ["fire"] }), defender: pokemon(), move: fireMove, defenderAbility: "あついしぼう" });
    const waterAbsorb = calculateDamage({ ...neutralOptions, attacker: pokemon({ types: ["water"] }), defender: pokemon(), move: { ...move, type: "water" }, defenderAbility: "ちょすい" });
    expect(thickFat.maxDamage).toBeLessThan(baseline.maxDamage);
    expect(waterAbsorb.maxDamage).toBe(0);
    expect(waterAbsorb.hitLabel).toBe("無効");
  });

  it("lets Mold Breaker bypass a defensive immunity", () => {
    const groundMove = { ...move, type: "ground" };
    const blocked = calculateDamage({ ...neutralOptions, attacker: pokemon({ types: ["ground"] }), defender: pokemon(), move: groundMove, defenderAbility: "ふゆう" });
    const bypassed = calculateDamage({ ...neutralOptions, attacker: pokemon({ types: ["ground"] }), defender: pokemon(), move: groundMove, attackerAbility: "かたやぶり", defenderAbility: "ふゆう" });
    expect(blocked.maxDamage).toBe(0);
    expect(bypassed.maxDamage).toBeGreaterThan(0);
  });

  it("applies a toggleable offensive condition only when enabled", () => {
    const inactive = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move, attackerAbility: "アナライズ" });
    const active = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move, attackerAbility: "アナライズ", attackerAbilityCondition: true });
    expect(active.maxDamage).toBeGreaterThan(inactive.maxDamage);
  });

  it("applies a toggleable defensive condition only when enabled", () => {
    const inactive = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move, defenderAbility: "ふしぎなうろこ" });
    const active = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move, defenderAbility: "ふしぎなうろこ", defenderAbilityCondition: true });
    expect(active.maxDamage).toBeLessThan(inactive.maxDamage);
  });

  it("blocks conditional critical hits with Shell Armor and Battle Armor", () => {
    for (const defenderAbility of ["シェルアーマー", "カブトアーマー"]) {
      const normal = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move, attackerAbility: "スナイパー", defenderAbility });
      const critical = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move, attackerAbility: "スナイパー", defenderAbility, attackerAbilityCondition: true });
      expect(critical).toEqual(normal);
    }
  });

  it("models full-HP Multiscale and Sturdy, including Parental Bond's second hit", () => {
    const strongMove = { ...move, power: 250 };
    const multiscale = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move: strongMove, defenderAbility: "マルチスケイル" });
    const baseline = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move: strongMove });
    const sturdy = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move: strongMove, defenderAbility: "がんじょう" });
    const parentalBond = calculateDamage({ ...neutralOptions, attacker: pokemon(), defender: pokemon(), move: strongMove, attackerAbility: "おやこあい", defenderAbility: "がんじょう" });
    expect(multiscale.maxDamage).toBeLessThan(baseline.maxDamage);
    expect(sturdy.maxPercent).toBeLessThan(100);
    expect(parentalBond.maxPercent).toBeGreaterThan(100);
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
