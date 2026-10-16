import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  calculateDamage,
  getAttackPatternLabel,
  ATTACK_PATTERNS,
  type DamageChartPokemon,
  type DamageChartMove,
  type DamageOptions,
} from "../../lib/champions/damage-chart";
import { getDamageChartDataset } from "../../lib/champions/damage-chart-data";
import mechanics from "../../data/damage-chart/mechanics.json";

const mon: DamageChartPokemon = {
  id: "test",
  displayNameJa: "test",
  types: ["normal"],
  sprite: "",
  weightKg: 100,
  baseStats: {
    hp: 100,
    attack: 100,
    defense: 100,
    specialAttack: 100,
    specialDefense: 100,
    speed: 100,
  },
  ranks: { Singles: 1, Doubles: 1 },
  moves: { Singles: [], Doubles: [] },
  abilities: { Singles: [], Doubles: [] },
};
const move: DamageChartMove = {
  id: "1",
  nameJa: "test",
  type: "normal",
  damageClass: "physical",
  power: 100,
  usage: null,
  rank: 1,
  isContact: true,
  tags: [],
};
const options: DamageOptions = {
  attacker: mon,
  defender: mon,
  move,
  attackEv: 0,
  attackNature: 1,
  hpEv: 0,
  defenseEv: 0,
  defenseNature: 1,
};
function calc(
  id: string,
  extra: Partial<DamageOptions> = {},
  changes: Partial<DamageChartMove> = {},
) {
  return calculateDamage({
    ...options,
    ...extra,
    move: { ...move, id, ...changes },
  });
}

describe("Champions damage chart regression", () => {
  it("Body Press uses own Defense and B investment", () => {
    const attacker = {
      ...mon,
      baseStats: { ...mon.baseStats, attack: 10, defense: 200 },
    };
    expect(
      calc("776", { attacker }, { power: 80, type: "fighting" }).maxDamage,
    ).toBe(132);
    expect(
      calc(
        "776",
        {
          attacker: {
            ...attacker,
            baseStats: { ...attacker.baseStats, attack: 250 },
          },
        },
        { power: 80, type: "fighting" },
      ),
    ).toEqual(calc("776", { attacker }, { power: 80, type: "fighting" }));
    expect(
      getAttackPatternLabel({ ...move, id: "776" }, ATTACK_PATTERNS[2]),
    ).toBe("B252+");
  });
  it("Foul Play's rows refer to target Attack, not user's Attack", () => {
    const a = calc("492", {
      attacker: { ...mon, baseStats: { ...mon.baseStats, attack: 5 } },
    });
    const b = calc("492", {
      attacker: { ...mon, baseStats: { ...mon.baseStats, attack: 255 } },
    });
    expect(a).toEqual(b);
    expect(
      calc("492", {
        defender: { ...mon, baseStats: { ...mon.baseStats, attack: 200 } },
      }).maxDamage,
    ).toBeGreaterThan(a.maxDamage);
    expect(calc("492", { attackEv: 252 }).maxDamage).toBeGreaterThan(
      a.maxDamage,
    );
    expect(
      getAttackPatternLabel({ ...move, id: "492" }, ATTACK_PATTERNS[1]),
    ).toBe("相手A252");
  });
  it("Freeze Dry overrides only Water in the compound matchup", () => {
    expect(
      calc(
        "573",
        {
          attacker: { ...mon, types: ["ice"] },
          defender: { ...mon, types: ["water", "flying"] },
        },
        { type: "ice", power: 70, damageClass: "special" },
      ),
    ).toMatchObject({ minDamage: 160, maxDamage: 192 });
  });
  it.each(["870", "480", "524"])(
    "%s is always critical unless armor blocks it",
    (id) => {
      const critical = calc(id, {}, { power: 70, type: "grass" });
      expect(critical).toMatchObject({ minDamage: 40, maxDamage: 48 });
      expect(
        calc(
          id,
          { defenderAbility: "シェルアーマー" },
          { power: 70, type: "grass" },
        ).maxDamage,
      ).toBe(32);
    },
  );
  it.each([
    ["paldean-tauros-combat-breed", "fighting"],
    ["paldean-tauros-blaze-breed", "fire"],
    ["paldean-tauros-aqua-breed", "water"],
  ])("resolves Raging Bull for exact form %s", (id, type) => {
    expect(calc("873", { attacker: { ...mon, id } }).effectiveMoveType).toBe(
      type,
    );
  });
  it("Flying Press combines Fighting and Flying effectiveness", () => {
    expect(
      calc(
        "560",
        { defender: { ...mon, types: ["grass", "fighting"] } },
        { type: "fighting" },
      ).maxDamage,
    ).toBe(184);
  });
  it("Shell Side Arm chooses classification using both defensive profiles", () => {
    const physical = calc(
      "801",
      {
        defender: {
          ...mon,
          baseStats: { ...mon.baseStats, defense: 10, specialDefense: 200 },
        },
      },
      { damageClass: "special", type: "poison", power: 90 },
    );
    const special = calc(
      "801",
      {
        defender: {
          ...mon,
          baseStats: { ...mon.baseStats, defense: 200, specialDefense: 10 },
        },
      },
      { damageClass: "special", type: "poison", power: 90 },
    );
    expect(physical.effectiveDamageClass).toBe("physical");
    expect(special.effectiveDamageClass).toBe("special");
  });
  it.each(["120", "153", "802"])("Damp blocks %s from either side", (id) => {
    expect(calc(id, { attackerAbility: "しめりけ" }).hitLabel).toBe("使用不可");
    expect(
      calc(id, { defenderAbility: "しめりけ", attackerAbility: "かたやぶり" })
        .hitLabel,
    ).toBe("使用不可");
  });
  it.each(["テイルアーマー", "じょおうのいげん"])(
    "%s blocks priority, not ordinary moves",
    (defenderAbility) => {
      expect(calc("252", { defenderAbility }, { priority: 3 }).maxDamage).toBe(
        0,
      );
      expect(calc("1", { defenderAbility }).maxDamage).toBe(69);
    },
  );
  it("Klutz suppresses named items and the explicit extra multiplier", () => {
    expect(
      calc("1", {
        attackerAbility: "ぶきよう",
        itemDamageModifier: 1.3,
        attackerConditions: { item: "life-orb" },
      }).maxDamage,
    ).toBe(69);
  });
  it.each(["ファーコート", "ふしぎなうろこ", "くさのけがわ"])(
    "Psyshock uses B modifier from %s",
    (defenderAbility) => {
      expect(
        calc(
          "473",
          {
            defenderAbility,
            defenderConditions: { status: "burn" },
            field: { terrain: "grass" },
          },
          { damageClass: "special", type: "psychic", power: 80 },
        ).maxDamage,
      ).toBeLessThan(
        calc("473", {}, { damageClass: "special", type: "psychic", power: 80 })
          .maxDamage,
      );
    },
  );
  it("Knock Off distinguishes no item, removable item, and Mega stone", () => {
    expect(
      calc("282", { defenderConditions: { item: "other" } }, { power: 65 })
        .effectivePower,
    ).toBe(97);
    expect(
      calc("282", { defenderConditions: { item: "mega-stone" } }, { power: 65 })
        .effectivePower,
    ).toBe(65);
    expect(
      calc(
        "282",
        { defenderConditions: { item: "other", itemRemovable: false } },
        { power: 65 },
      ).effectivePower,
    ).toBe(65);
  });
  it("Acrobatics doubles only without a held item", () => {
    expect(calc("512", {}, { power: 55 }).effectivePower).toBe(110);
    expect(
      calc("512", { attackerConditions: { item: "other" } }, { power: 55 })
        .effectivePower,
    ).toBe(55);
  });
  it.each(["506", "844", "474", "839"])("status changes power for %s", (id) => {
    expect(
      calc(id, { defenderConditions: { status: "poison" } }, { power: 65 })
        .effectivePower,
    ).toBe(130);
  });
  it("Facade doubles for status without burn's ordinary physical penalty", () => {
    expect(
      calc("263", { attackerConditions: { status: "burn" } }, { power: 70 })
        .maxDamage,
    ).toBe(calc("263", {}, { power: 140 }).maxDamage);
    expect(
      calc("1", { attackerConditions: { status: "burn" } }).maxDamage,
    ).toBe(34);
  });
  it("Guts raises attack and cancels burn's damage reduction", () => {
    expect(
      calc("1", {
        attackerAbility: "こんじょう",
        attackerConditions: { status: "burn" },
      }).maxDamage,
    ).toBe(102);
  });
  it("Rage Fist caps at 350, Last Respects and Stored Power use state", () => {
    expect(
      calc("889", { attackerConditions: { receivedHits: 6 } }).effectivePower,
    ).toBe(350);
    expect(
      calc("854", { attackerConditions: { faintedAllies: 3 } }).effectivePower,
    ).toBe(200);
    expect(
      calc("500", {
        attackerConditions: { attackStage: 2, defenseStage: 2, speedStage: -2 },
      }).effectivePower,
    ).toBe(100);
  });
  it.each([
    ["419", "damagedThisTurn"],
    ["371", "movedLast"],
    ["707", "previousMoveFailed"],
    ["915", "previousMoveFailed"],
    ["907", "enhancedMove"],
  ] as const)("conditional power for %s", (id, key) => {
    expect(
      calc(id, { attackerConditions: { [key]: true } }, { power: 80 })
        .effectivePower,
    ).toBe(160);
  });
  it("Assurance reads damage already taken by the target", () =>
    expect(
      calc(
        "372",
        { defenderConditions: { damagedThisTurn: true } },
        { power: 60 },
      ).effectivePower,
    ).toBe(120));
  it("Weather Ball changes type and power; Cloud Nine suppresses weather", () => {
    expect(
      calc("311", { field: { weather: "rain" } }, { power: 50 }),
    ).toMatchObject({ effectivePower: 100, effectiveMoveType: "water" });
    expect(
      calc(
        "311",
        { field: { weather: "rain" }, defenderAbility: "ノーてんき" },
        { power: 50 },
      ),
    ).toMatchObject({ effectivePower: 50, effectiveMoveType: "normal" });
  });
  it("weather strengthens Fire and Water only in their appropriate weather", () => {
    const base = calc("53", {}, { type: "fire" });
    expect(
      calc("53", { field: { weather: "sun" } }, { type: "fire" }).maxDamage,
    ).toBeGreaterThan(base.maxDamage);
    expect(
      calc("53", { field: { weather: "rain" } }, { type: "fire" }).maxDamage,
    ).toBeLessThan(base.maxDamage);
  });
  it("Sand and snow boost only the appropriate defensive stat/type", () => {
    expect(
      calc("1", {
        defender: { ...mon, types: ["ice"] },
        field: { weather: "snow" },
      }).maxDamage,
    ).toBeLessThan(
      calc("1", { defender: { ...mon, types: ["ice"] } }).maxDamage,
    );
    expect(
      calc(
        "1",
        { defender: { ...mon, types: ["rock"] }, field: { weather: "sand" } },
        { damageClass: "special" },
      ).maxDamage,
    ).toBeLessThan(
      calc(
        "1",
        { defender: { ...mon, types: ["rock"] } },
        { damageClass: "special" },
      ).maxDamage,
    );
  });
  it("terrain boosts require grounding and Psychic Terrain blocks priority", () => {
    expect(
      calc("1", { field: { terrain: "electric" } }, { type: "electric" })
        .maxDamage,
    ).toBeGreaterThan(calc("1", {}, { type: "electric" }).maxDamage);
    expect(
      calc(
        "1",
        {
          attacker: { ...mon, types: ["flying"] },
          field: { terrain: "electric" },
        },
        { type: "electric" },
      ).maxDamage,
    ).toBe(
      calc(
        "1",
        { attacker: { ...mon, types: ["flying"] } },
        { type: "electric" },
      ).maxDamage,
    );
    expect(
      calc("252", { field: { terrain: "psychic" } }, { priority: 3 }).hitLabel,
    ).toBe("使用不可");
    expect(
      calc(
        "252",
        {
          field: { terrain: "psychic" },
          defender: { ...mon, types: ["flying"] },
        },
        { priority: 3 },
      ).maxDamage,
    ).toBeGreaterThan(0);
  });
  it("Gravity removes Flying and Levitate's Ground immunity", () => {
    expect(
      calc(
        "89",
        {
          defender: { ...mon, types: ["flying"] },
          defenderAbility: "ふゆう",
          field: { gravity: true },
        },
        { type: "ground" },
      ).maxDamage,
    ).toBe(46);
  });
  it("Doubles spread reduction depends on actual targets", () => {
    expect(
      calc("89", { field: { doubles: true, targets: 2 } }, { spread: true })
        .maxDamage,
    ).toBe(51);
    expect(
      calc("89", { field: { doubles: true, targets: 1 } }, { spread: true })
        .maxDamage,
    ).toBe(69);
  });
  it("ally Friend Guard survives Mold Breaker", () => {
    expect(
      calc("1", {
        attackerAbility: "かたやぶり",
        field: { doubles: true },
        defenderConditions: { allyAbility: "フレンドガード" },
      }).maxDamage,
    ).toBe(52);
  });
  it("Helping Hand and ally Steel Spirit boost the proper attack", () => {
    expect(
      calc("1", {
        field: { doubles: true },
        attackerConditions: { helpingHand: true },
      }).maxDamage,
    ).toBeGreaterThan(69);
    expect(
      calc(
        "1",
        {
          field: { doubles: true },
          attackerConditions: { allyAbility: "はがねのせいしん" },
        },
        { type: "steel" },
      ).maxDamage,
    ).toBeGreaterThan(calc("1", {}, { type: "steel" }).maxDamage);
  });
  it("Sheer Force distinguishes secondary effects from criticals/conditional power", () => {
    expect(
      calc("53", { attackerAbility: "ちからずく" }, { type: "fire", power: 90 })
        .effectivePower,
    ).toBe(117);
    expect(
      calc(
        "870",
        { attackerAbility: "ちからずく" },
        { type: "grass", power: 70 },
      ).effectivePower,
    ).toBe(70);
    expect(
      calc("907", { attackerAbility: "ちからずく" }, { power: 80 })
        .effectivePower,
    ).toBe(80);
    expect(
      calc("585", { attackerAbility: "ちからずく" }, { power: 95 })
        .effectivePower,
    ).toBe(124);
  });
  it("critical hits ignore negative attack/positive defense and screens", () => {
    expect(
      calc(
        "870",
        {
          attackerConditions: { attackStage: -6 },
          defenderConditions: { defenseStage: 6, reflect: true },
        },
        { type: "grass", power: 70 },
      ),
    ).toEqual(calc("870", {}, { type: "grass", power: 70 }));
  });
  it("Unaware and defense-ignoring moves ignore the corresponding ranks", () => {
    expect(
      calc("1", {
        defenderAbility: "てんねん",
        attackerConditions: { attackStage: 6 },
      }),
    ).toEqual(calc("1", { defenderAbility: "てんねん" }));
    expect(calc("533", { defenderConditions: { defenseStage: 6 } })).toEqual(
      calc("533"),
    );
    expect(
      calc("1", {
        attackerAbility: "てんねん",
        defenderConditions: { defenseStage: 6 },
      }),
    ).toEqual(calc("1", { attackerAbility: "てんねん" }));
  });
  it("Stance Change attacks in Blade, and Zero to Hero requires selected form", () => {
    expect(
      calc("1", { attackerAbility: "バトルスイッチ" }).maxDamage,
    ).toBeGreaterThan(69);
    expect(
      calc("1", {
        attackerAbility: "マイティチェンジ",
        attackerConditions: { form: "hero" },
      }).maxDamage,
    ).toBeGreaterThan(
      calc("1", { attackerAbility: "マイティチェンジ" }).maxDamage,
    );
  });
  it("Imposter copies target stats and uses the selected copied ability", () => {
    const defender = { ...mon, baseStats: { ...mon.baseStats, attack: 200 } };
    expect(
      calc("1", {
        defender,
        attackerAbility: "かわりもの",
        attackerConditions: { copiedAbility: "ちからもち" },
      }).maxDamage,
    ).toBeGreaterThan(
      calc("1", { defender, attackerAbility: "かわりもの" }).maxDamage,
    );
  });
  it("hunger form changes Aura Wheel only", () => {
    expect(
      calc(
        "783",
        { attackerConditions: { form: "hangry" } },
        { type: "electric" },
      ).effectiveMoveType,
    ).toBe("dark");
    expect(
      calc(
        "85",
        { attackerConditions: { form: "hangry" } },
        { type: "electric" },
      ).effectiveMoveType,
    ).toBe("electric");
  });
  it("Unseen Fist and Piercing Drill penetrate protection for contact attacks at a quarter", () => {
    for (const attackerAbility of ["ふかしのこぶし", "かんつうドリル"]) {
      expect(
        calc("1", { attackerAbility, defenderConditions: { protect: true } })
          .maxDamage,
      ).toBe(17);
      expect(
        calc(
          "1",
          { attackerAbility, defenderConditions: { protect: true } },
          { isContact: false },
        ).maxDamage,
      ).toBe(0);
    }
  });
  it("Disguise absorbs the first strike; multi-hit damage continues", () => {
    expect(calc("1", { defenderAbility: "ばけのかわ" })).toMatchObject({
      minDamage: 21,
      maxDamage: 21,
    });
    expect(
      calc("814", { defenderAbility: "ばけのかわ" }, { power: 40 }),
    ).toMatchObject({ minDamage: 45, maxDamage: 49 });
  });
  it("multi-hit state clears full-HP protections and applies Stamina between hits", () => {
    expect(
      calc("814", { defenderAbility: "マルチスケイル" }, { power: 40 })
        .maxDamage,
    ).toBe(42);
    expect(
      calc("814", { defenderAbility: "じきゅうりょく" }, { power: 40 })
        .maxDamage,
    ).toBeLessThan(calc("814", {}, { power: 40 }).maxDamage);
    expect(calc("1", { defenderAbility: "マルチスケイル" }).hitLabel).toBe(
      "命中1回",
    );
  });
  it("Skill Link forces 5 strikes and Triple Axel increments each hit power", () => {
    expect(
      calc("331", { attackerAbility: "スキルリンク" }, { power: 25 }),
    ).toMatchObject({ minDamage: 80, maxDamage: 95 });
    expect(
      calc("813", { attackerConditions: { hits: 3 } }, { power: 20 }),
    ).toMatchObject({ minDamage: 70, maxDamage: 85 });
  });
  it("Dragon Darts can be split across two opponents", () => {
    const full = calc("751", { field: { doubles: true } }, { power: 50 });
    expect(
      calc(
        "751",
        {
          field: { doubles: true },
          attackerConditions: { dragonDartsSplit: true },
        },
        { power: 50 },
      ).maxDamage,
    ).toBe(full.maxDamage / 2);
  });
  it("weight-based moves use authoritative weight and Heavy/Light Metal", () => {
    expect(
      calc("67", { defender: { ...mon, weightKg: 100 } }, { power: 1 })
        .effectivePower,
    ).toBe(100);
    expect(
      calc(
        "67",
        {
          defender: { ...mon, weightKg: 100 },
          defenderAbility: "ヘヴィメタル",
        },
        { power: 1 },
      ).effectivePower,
    ).toBe(120);
    expect(
      calc(
        "484",
        {
          attacker: { ...mon, weightKg: 500 },
          defender: { ...mon, weightKg: 100 },
        },
        { power: 1 },
      ).effectivePower,
    ).toBe(120);
  });
  it("HP-based moves respond to actual remaining HP", () => {
    expect(
      calc("323", { attackerConditions: { hpPercent: 50 } }, { power: 1 })
        .effectivePower,
    ).toBe(74);
    expect(
      calc("175", { attackerConditions: { hpPercent: 1 } }, { power: 1 })
        .effectivePower,
    ).toBe(200);
    expect(
      calc("912", { defenderConditions: { hpPercent: 50 } }, { power: 1 })
        .effectivePower,
    ).toBe(49);
  });
  it("Gyro Ball and Electro Ball use speed stages, paralysis and held Scarf", () => {
    expect(calc("360", {}, { power: 1 }).effectivePower).toBe(26);
    expect(
      calc("360", { attackerConditions: { status: "paralysis" } }, { power: 1 })
        .effectivePower,
    ).toBe(51);
    expect(
      calc("486", { attackerConditions: { speedStage: 6 } }, { power: 1 })
        .effectivePower,
    ).toBe(150);
  });
  it.each([
    ["69", 50],
    ["101", 50],
    ["49", 20],
    ["82", 40],
    ["162", 87],
    ["515", 175],
  ])("fixed damage %s ignores STAB/weather/items/screens", (id, damage) => {
    expect(
      calc(
        String(id),
        {
          itemDamageModifier: 1.3,
          field: { weather: "sun" },
          defenderConditions: { reflect: true },
        },
        { power: 1 },
      ).maxDamage,
    ).toBe(damage);
  });
  it("Endeavor and counter paths use HP/damage inputs", () => {
    expect(
      calc("283", { attackerConditions: { hpPercent: 50 } }, { power: 1 })
        .maxDamage,
    ).toBe(88);
    expect(
      calc("68", { attackerConditions: { receivedDamage: 60 } }, { power: 1 })
        .maxDamage,
    ).toBe(120);
    expect(
      calc("894", { attackerConditions: { receivedDamage: 61 } }, { power: 1 })
        .maxDamage,
    ).toBe(91);
  });
  it("Beat Up and Fling require explicit participants/item power", () => {
    expect(calc("251", {}, { power: 1 }).hitLabel).toBe("条件を設定");
    expect(
      calc(
        "251",
        { attackerConditions: { beatUpAttacks: "100,100" } },
        { power: 1 },
      ).maxDamage,
    ).toBe(24);
    expect(
      calc(
        "374",
        { attackerConditions: { item: "iron-ball", flingPower: 130 } },
        { power: 1 },
      ).effectivePower,
    ).toBe(130);
    expect(
      calc(
        "374",
        { attackerConditions: { item: "mega-stone", flingPower: 130 } },
        { power: 1 },
      ).maxDamage,
    ).toBe(0);
  });
  it("OHKO is displayed as a separate probability and honors Sturdy/type immunity", () => {
    expect(calc("329", {}, { type: "ice", power: 1 }).hitLabel).toBe(
      "一撃必殺・命中20%",
    );
    expect(
      calc("329", { defenderAbility: "がんじょう" }, { type: "ice", power: 1 })
        .maxDamage,
    ).toBe(0);
    expect(
      calc(
        "329",
        { defender: { ...mon, types: ["ice"] } },
        { type: "ice", power: 1 },
      ).maxDamage,
    ).toBe(0);
  });
  it("Focus Sash and resist berries are consumed only on the first eligible hit", () => {
    expect(
      calc(
        "814",
        { defenderConditions: { item: "focus-sash" } },
        { power: 500 },
      ).maxDamage,
    ).toBeGreaterThan(175);
    expect(
      calc(
        "814",
        {
          defender: { ...mon, types: ["grass"] },
          defenderConditions: { item: "resist:fire" },
        },
        { type: "fire", power: 40 },
      ).maxDamage,
    ).toBe(57);
  });
});

describe("additional state interactions", () => {
  it.each([
    ["805", "electric", 260],
    ["797", "psychic", 195],
    ["804", "electric", 260],
    ["802", "misty", 150],
    ["89", "grass", 50],
    ["523", "grass", 50],
  ])("terrain power for %s", (id, terrain, power) => {
    expect(
      calc(
        id,
        { field: { terrain: String(terrain) } },
        {
          power: 100,
          type: id === "797" ? "psychic" : id === "804" ? "electric" : "normal",
        },
      ).effectivePower,
    ).toBe(power);
  });
  it.each(["76", "669"])("bad weather halves %s", (id) =>
    expect(
      calc(id, { field: { weather: "rain" } }, { power: 120 }).effectivePower,
    ).toBe(60),
  );
  it("Mega Solar overrides weather for the user's moves, including Weather Ball", () => {
    expect(
      calc(
        "311",
        { attackerAbility: "メガソーラー", field: { weather: "rain" } },
        { power: 50 },
      ),
    ).toMatchObject({ effectivePower: 100, effectiveMoveType: "fire" });
    expect(
      calc(
        "76",
        { attackerAbility: "メガソーラー", field: { weather: "rain" } },
        { power: 120 },
      ).effectivePower,
    ).toBe(120);
  });
  it("weather type changes precede skin power boosts", () => {
    expect(
      calc(
        "311",
        { attackerAbility: "スカイスキン", field: { weather: "rain" } },
        { power: 50 },
      ),
    ).toMatchObject({ effectivePower: 100, effectiveMoveType: "water" });
    expect(
      calc(
        "805",
        { attackerAbility: "スカイスキン", field: { terrain: "electric" } },
        { power: 50 },
      ),
    ).toMatchObject({ effectivePower: 130, effectiveMoveType: "electric" });
  });
  it("Gravity strengthens Grav Apple; Minimize and underground position alter power", () => {
    expect(
      calc("788", { field: { gravity: true } }, { power: 80 }).effectivePower,
    ).toBe(120);
    expect(
      calc("916", { defenderConditions: { minimized: true } }, { power: 100 })
        .effectivePower,
    ).toBe(200);
    expect(
      calc("89", { defenderConditions: { airborne: "dig" } }, { power: 100 })
        .effectivePower,
    ).toBe(200);
    expect(
      calc("57", { defenderConditions: { airborne: "dive" } }, { power: 90 })
        .effectivePower,
    ).toBe(180);
  });
  it("Grassy Glide gains priority and can be blocked by Armor Tail", () =>
    expect(
      calc(
        "803",
        { field: { terrain: "grass" }, defenderAbility: "テイルアーマー" },
        { type: "grass", priority: 0 },
      ).hitLabel,
    ).toBe("使用不可"));
  it("Iron Ball halves speed, but Klutz suppresses it", () => {
    expect(
      calc("360", { attackerConditions: { item: "iron-ball" } }, { power: 1 })
        .effectivePower,
    ).toBe(51);
    expect(
      calc(
        "360",
        {
          attackerAbility: "ぶきよう",
          attackerConditions: { item: "iron-ball" },
        },
        { power: 1 },
      ).effectivePower,
    ).toBe(26);
  });
  it("Quick Feet overrides paralysis slow-down, and Unburden requires activation", () => {
    expect(
      calc(
        "360",
        {
          attackerAbility: "はやあし",
          attackerConditions: { status: "paralysis" },
        },
        { power: 1 },
      ).effectivePower,
    ).toBe(17);
    expect(
      calc(
        "360",
        { attackerAbility: "かるわざ", attackerConditions: { unburden: true } },
        { power: 1 },
      ).effectivePower,
    ).toBe(13);
  });
  it("Balloon prevents Ground hits and prevents terrain grounding", () => {
    expect(
      calc(
        "89",
        { defenderConditions: { item: "air-balloon" } },
        { type: "ground" },
      ).maxDamage,
    ).toBe(0);
    expect(
      calc(
        "89",
        {
          defenderConditions: { item: "air-balloon" },
          field: { gravity: true },
        },
        { type: "ground" },
      ).maxDamage,
    ).toBe(46);
    expect(
      calc(
        "1",
        {
          attackerConditions: { item: "air-balloon" },
          field: { terrain: "electric" },
        },
        { type: "electric" },
      ).effectivePower,
    ).toBe(100);
  });
  it("friend abilities and Helping Hand do not apply in Singles", () =>
    expect(
      calc("1", {
        attackerConditions: { helpingHand: true },
        defenderConditions: { allyAbility: "フレンドガード" },
      }).maxDamage,
    ).toBe(69));
  it("expert belt needs a super effective hit, and Muscle Band needs physical damage", () => {
    expect(
      calc("1", { attackerConditions: { item: "expert-belt" } }).maxDamage,
    ).toBe(69);
    expect(
      calc(
        "1",
        { attackerConditions: { item: "muscle-band" } },
        { damageClass: "special" },
      ).maxDamage,
    ).toBe(69);
    expect(
      calc("1", { attackerConditions: { item: "boost:normal" } })
        .effectivePower,
    ).toBe(120);
  });
  it("a normal resist berry works even on neutral damage", () =>
    expect(
      calc("1", { defenderConditions: { item: "resist:normal" } }).maxDamage,
    ).toBe(34));
  it("parental fixed damage strikes both times; child Knock Off no longer gets held-item boost", () => {
    expect(
      calc("69", { attackerAbility: "おやこあい" }, { power: 1 }).maxDamage,
    ).toBe(100);
    expect(
      calc(
        "282",
        {
          attackerAbility: "おやこあい",
          defenderConditions: { item: "other" },
        },
        { power: 65 },
      ).maxDamage,
    ).toBe(76);
  });
  it("Mold Breaker leaves Klutz and after-hit Stamina in effect", () => {
    expect(
      calc(
        "1",
        {
          attackerAbility: "かたやぶり",
          defenderAbility: "ぶきよう",
          defenderConditions: { item: "focus-sash" },
        },
        { power: 500 },
      ).maxDamage,
    ).toBeGreaterThan(175);
    expect(
      calc(
        "814",
        { attackerAbility: "かたやぶり", defenderAbility: "じきゅうりょく" },
        { power: 40 },
      ).maxDamage,
    ).toBeLessThan(
      calc("814", { attackerAbility: "かたやぶり" }, { power: 40 }).maxDamage,
    );
  });
  it("Foul Play borrows target stats but applies the user's offensive ability", () => {
    expect(calc("492", { defenderAbility: "ちからもち" }).maxDamage).toBe(69);
    expect(calc("492", { attackerAbility: "ちからもち" }).maxDamage).toBe(135);
  });
  it("Mega form metadata enforces an unremovable stone", () => {
    const mega = { ...mon, formRelation: "mega" };
    expect(calc("512", { attacker: mega }, { power: 55 }).effectivePower).toBe(
      55,
    );
    expect(
      calc(
        "282",
        { defender: mega, defenderConditions: { item: "other" } },
        { power: 65 },
      ).effectivePower,
    ).toBe(65);
  });
  it("named Fling items have known power without a manual override", () =>
    expect(
      calc("374", { attackerConditions: { item: "iron-ball" } }, { power: 1 })
        .effectivePower,
    ).toBe(130));
});

describe("damage metadata coverage", () => {
  it("uses the same Champions snapshot and maps every legal form to positive weight", async () => {
    const metadata = JSON.parse(
      readFileSync("data/usage-ranking/metadata.json", "utf8"),
    );
    expect(mechanics.sourceCommit).toBe(metadata.champoutCommit);
    const dataset = await getDamageChartDataset();
    expect(dataset.pokemon).toHaveLength(341);
    expect(dataset.pokemon.every((p) => p.weightKg! > 0)).toBe(true);
    expect(
      dataset.pokemon.find((p) => p.id === "paldean-tauros-aqua-breed")
        ?.weightKg,
    ).toBe(110);
    expect(
      dataset.pokemon.find((p) => p.id === "aegislash-shield-forme")?.weightKg,
    ).toBe(53);
  });
  it("all former 35 exclusions are represented and produce finite results for all grid cells", async () => {
    const dataset = await getDamageChartDataset();
    const moves = new Map(
      dataset.pokemon.flatMap((p) =>
        [...p.moves.Singles, ...p.moves.Doubles].map((m) => [m.id, m] as const),
      ),
    );
    for (const id of [
      "329",
      "814",
      "484",
      "368",
      "500",
      "243",
      "283",
      "333",
      "350",
      "90",
      "799",
      "42",
      "323",
      "284",
      "67",
      "162",
      "447",
      "751",
      "32",
      "68",
      "175",
      "515",
      "888",
      "360",
      "813",
      "374",
      "594",
      "331",
      "12",
      "179",
      "894",
      "860",
      "251",
      "535",
      "893",
    ])
      expect(moves.has(id), id).toBe(true);
    // Usage snapshots can add represented moves; keep the existing coverage floor.
    expect(moves.size).toBeGreaterThanOrEqual(289);
    for (const p of dataset.pokemon)
      for (const format of ["Singles", "Doubles"] as const)
        for (const m of p.moves[format])
          for (const attackEv of [0, 252])
            for (const defenseEv of [0, 252]) {
              const r = calculateDamage({
                ...options,
                attacker: p,
                defender: dataset.pokemon[0],
                move: m,
                attackEv,
                defenseEv,
                attackerAbility: p.abilities[format][0]?.nameJa,
                field: { doubles: format === "Doubles", targets: 2 },
              });
              expect(Number.isFinite(r.maxDamage), `${p.id} ${m.id}`).toBe(
                true,
              );
              expect(r.maxDamage).toBeGreaterThanOrEqual(r.minDamage);
            }
  });
});
