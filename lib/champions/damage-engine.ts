import {
  calculateBattleStat,
  calculateHpStat,
  getEffectiveMove,
  getDamageStatProfile,
  type DamageOptions,
  type DamageResult,
} from "./damage-chart";
import { getTypeMultiplier } from "./type-matchup";

export interface DamageConditions {
  unburden: boolean;
  hpPercent: number;
  status: string;
  attackStage: number;
  specialAttackStage: number;
  defenseStage: number;
  specialDefenseStage: number;
  speedStage: number;
  speedEv: number;
  speedNature: number;
  attackEv: number;
  attackNature: number;
  hpEv: number;
  stockpiles: number;
  tailwind: boolean;
  grounded: boolean;
  dragonDartsSplit: boolean;
  item: string;
  itemRemovable: boolean;
  receivedHits: number;
  faintedAllies: number;
  positiveStages: number;
  movedLast: boolean;
  damagedThisTurn: boolean;
  previousMoveFailed: boolean;
  switchedIn: boolean;
  charged: boolean;
  critical: boolean;
  disguiseIntact: boolean;
  minimized: boolean;
  airborne: string;
  protect: boolean;
  reflect: boolean;
  lightScreen: boolean;
  auroraVeil: boolean;
  helpingHand: boolean;
  allyAbility: string;
  gender: string;
  copiedAbility: string;
  changedTypes: string;
  form: string;
  hits: number;
  enhancedMove: boolean;
  receivedDamage: number;
  beatUpAttacks: string;
  flingPower: number;
  sheerForceEligible: boolean;
}
export interface DamageField {
  weather: string;
  terrain: string;
  gravity: boolean;
  doubles: boolean;
  targets: number;
  fairyAura: boolean;
}
export const DEFAULT_DAMAGE_CONDITIONS: DamageConditions = {
  unburden: false,
  hpPercent: 100,
  status: "none",
  attackStage: 0,
  specialAttackStage: 0,
  defenseStage: 0,
  specialDefenseStage: 0,
  speedStage: 0,
  speedEv: 0,
  speedNature: 1,
  attackEv: 0,
  attackNature: 1,
  hpEv: 0,
  stockpiles: 0,
  tailwind: false,
  grounded: false,
  dragonDartsSplit: false,
  item: "none",
  itemRemovable: true,
  receivedHits: 0,
  faintedAllies: 0,
  positiveStages: 0,
  movedLast: false,
  damagedThisTurn: false,
  previousMoveFailed: false,
  switchedIn: false,
  charged: false,
  critical: false,
  disguiseIntact: true,
  minimized: false,
  airborne: "none",
  protect: false,
  reflect: false,
  lightScreen: false,
  auroraVeil: false,
  helpingHand: false,
  allyAbility: "none",
  gender: "none",
  copiedAbility: "",
  changedTypes: "",
  form: "base",
  hits: 0,
  enhancedMove: false,
  receivedDamage: 0,
  beatUpAttacks: "",
  flingPower: 0,
  sheerForceEligible: false,
};
export const DEFAULT_DAMAGE_FIELD: DamageField = {
  weather: "none",
  terrain: "none",
  gravity: false,
  doubles: false,
  targets: 1,
  fairyAura: false,
};
const round = (n: number) => (n % 1 > 0.5 ? Math.ceil(n) : Math.floor(n));
const chain = (current: number, factor: number) =>
  Math.floor((current * Math.round(factor * 4096) + 2048) / 4096);
const mod = (n: number, m: number) => Math.max(n > 0 ? 1 : 0, round(n * m));
const stage = (n: number, s: number) =>
  Math.floor(
    n * (s >= 0 ? (2 + Math.min(6, s)) / 2 : 2 / (2 - Math.max(-6, s))),
  );
const MULTI: Record<string, [number, number]> = {
  "814": [2, 2],
  "751": [2, 2],
  "888": [2, 2],
  "813": [1, 3],
  "860": [1, 10],
  "331": [2, 5],
  "350": [2, 5],
  "333": [2, 5],
  "594": [2, 5],
  "799": [2, 5],
  "42": [2, 5],
};
const IMMUNITIES: Record<string, string[]> = {
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
// Championsの説明から追加効果を照合した技ID。確定急所・反動・自身の能力低下は対象外。
const SHEER_FORCE = new Set([
  "7",
  "8",
  "9",
  "23",
  "29",
  "34",
  "44",
  "51",
  "52",
  "53",
  "58",
  "59",
  "60",
  "61",
  "62",
  "84",
  "85",
  "87",
  "93",
  "94",
  "122",
  "123",
  "124",
  "126",
  "127",
  "132",
  "143",
  "157",
  "161",
  "172",
  "181",
  "188",
  "189",
  "196",
  "209",
  "223",
  "225",
  "231",
  "242",
  "246",
  "247",
  "252",
  "257",
  "290",
  "295",
  "299",
  "305",
  "309",
  "310",
  "317",
  "326",
  "330",
  "341",
  "342",
  "344",
  "352",
  "394",
  "398",
  "399",
  "403",
  "405",
  "407",
  "411",
  "412",
  "414",
  "421",
  "422",
  "423",
  "424",
  "428",
  "430",
  "431",
  "435",
  "436",
  "440",
  "441",
  "442",
  "451",
  "482",
  "488",
  "490",
  "491",
  "503",
  "522",
  "523",
  "527",
  "534",
  "539",
  "542",
  "551",
  "552",
  "555",
  "556",
  "558",
  "583",
  "585",
  "595",
  "610",
  "612",
  "679",
  "680",
  "688",
  "710",
  "716",
  "778",
  "780",
  "787",
  "788",
  "789",
  "801",
  "806",
  "815",
  "827",
  "828",
  "836",
  "839",
  "841",
  "843",
  "844",
  "855",
  "871",
  "872",
  "884",
  "885",
  "886",
  "902",
  "918",
]);

// かたやぶりは場全体の効果、道具無効、技を受けた後の能力変化まで消さない。
const MOLD_BREAKER_ABILITIES = new Set([
  "ふゆう",
  "どしょく",
  "うなぎのぼり",
  "ちょすい",
  "ちくでん",
  "ひらいしん",
  "でんきエンジン",
  "そうしょく",
  "もらいび",
  "かんそうはだ",
  "すいほう",
  "あついしぼう",
  "たいねつ",
  "きよめのしお",
  "ファーコート",
  "ふしぎなうろこ",
  "くさのけがわ",
  "ハードロック",
  "フィルター",
  "はどうのぼうご",
  "パンクロック",
  "もふもふ",
  "マルチスケイル",
  "がんじょう",
  "ばけのかわ",
  "シェルアーマー",
  "カブトアーマー",
  "ぼうおん",
  "ぼうだん",
  "てんねん",
  "テイルアーマー",
  "じょおうのいげん",
  "ヘヴィメタル",
  "ライトメタル",
]);

function resolvedAbility(
  ability: string | null | undefined,
  c: DamageConditions,
) {
  return ["トレース", "レシーバー", "かわりもの"].includes(ability ?? "") &&
    c.copiedAbility
    ? c.copiedAbility
    : ability;
}

export function calculateAdvancedDamage(o: DamageOptions): DamageResult {
  const a = { ...DEFAULT_DAMAGE_CONDITIONS, ...o.attackerConditions },
    d = { ...DEFAULT_DAMAGE_CONDITIONS, ...o.defenderConditions };
  if (o.attacker.formRelation === "mega") {
    a.item = "mega-stone";
    a.itemRemovable = false;
  }
  if (o.defender.formRelation === "mega") {
    d.item = "mega-stone";
    d.itemRemovable = false;
  }
  const f = { ...DEFAULT_DAMAGE_FIELD, ...o.field };
  if (!f.doubles) {
    a.allyAbility = "none";
    d.allyAbility = "none";
    a.helpingHand = false;
  }
  const aa = resolvedAbility(o.attackerAbility, a),
    originalDa = resolvedAbility(o.defenderAbility, d);
  const da =
    aa === "かたやぶり" && MOLD_BREAKER_ABILITIES.has(originalDa ?? "")
      ? null
      : originalDa;
  const id = o.move.id;
  let weather = f.weather;
  if (
    [aa, originalDa, a.allyAbility, d.allyAbility].some(
      (x) => x === "ノーてんき" || x === "エアロック",
    )
  )
    weather = "none";
  const attackWeather = aa === "メガソーラー" ? "sun" : weather;
  const sunny = attackWeather === "sun";
  const grounded = (
    types: string[],
    ability: string | null | undefined,
    c: DamageConditions,
  ) =>
    f.gravity ||
    c.grounded ||
    (c.item === "iron-ball" && ability !== "ぶきよう") ||
    (!types.includes("flying") &&
      ability !== "ふゆう" &&
      !(c.item === "air-balloon" && ability !== "ぶきよう") &&
      c.airborne !== "floating");
  let at = a.changedTypes ? a.changedTypes.split(",") : o.attacker.types;
  let dt = d.changedTypes ? d.changedTypes.split(",") : o.defender.types;
  const terrainType: Record<string, string> = {
    electric: "electric",
    grass: "grass",
    psychic: "psychic",
    misty: "fairy",
  };
  if (aa === "ぎたい" && terrainType[f.terrain]) at = [terrainType[f.terrain]];
  if (da === "ぎたい" && terrainType[f.terrain]) dt = [terrainType[f.terrain]];
  const castform = (ability: string | null | undefined, types: string[]) =>
    ability === "てんきや"
      ? [
          weather === "sun"
            ? "fire"
            : weather === "rain"
              ? "water"
              : weather === "snow"
                ? "ice"
                : "normal",
        ]
      : types;
  at = castform(aa, at);
  dt = castform(da, dt);
  const ag = grounded(at, aa, a),
    dg = grounded(dt, da, d);
  const aStats = {
      ...(o.attackerAbility === "かわりもの"
        ? o.defender.baseStats
        : o.attacker.baseStats),
      hp: o.attacker.baseStats.hp,
    },
    dStats = {
      ...(o.defenderAbility === "かわりもの"
        ? o.attacker.baseStats
        : o.defender.baseStats),
      hp: o.defender.baseStats.hp,
    };
  if (o.attackerAbility === "かわりもの") at = dt;
  if (o.defenderAbility === "かわりもの") dt = at;
  if (aa === "バトルスイッチ")
    Object.assign(aStats, {
      attack: 140,
      specialAttack: 140,
      defense: 50,
      specialDefense: 50,
    });
  if (da === "バトルスイッチ" && d.form === "blade")
    Object.assign(dStats, {
      attack: 140,
      specialAttack: 140,
      defense: 50,
      specialDefense: 50,
    });
  if (aa === "マイティチェンジ" && a.form === "hero")
    Object.assign(aStats, {
      attack: 160,
      defense: 97,
      specialAttack: 106,
      specialDefense: 87,
      speed: 100,
    });
  if (da === "マイティチェンジ" && d.form === "hero")
    Object.assign(dStats, {
      attack: 160,
      defense: 97,
      specialAttack: 106,
      specialDefense: 87,
      speed: 100,
    });
  const fullHp = calculateHpStat(dStats.hp, o.hpEv),
    hp = Math.max(1, Math.floor((fullHp * d.hpPercent) / 100));
  const ahpMax = calculateHpStat(aStats.hp, a.hpEv),
    ahp = Math.max(1, Math.floor((ahpMax * a.hpPercent) / 100));
  const critical =
    da !== "シェルアーマー" &&
    da !== "カブトアーマー" &&
    (a.critical ||
      ["870", "480", "524"].includes(id) ||
      (aa === "ひとでなし" && ["poison", "toxic"].includes(d.status)) ||
      (o.attackerAbilityCondition &&
        ["ひとでなし", "スナイパー"].includes(aa ?? "")));
  if (id === "801" && !o.move.resolvedDamageClass) {
    const physicalResult = calculateAdvancedDamage({
      ...o,
      move: { ...o.move, resolvedDamageClass: "physical" },
    });
    const specialResult = calculateAdvancedDamage({
      ...o,
      move: { ...o.move, resolvedDamageClass: "special" },
    });
    return physicalResult.maxDamage > specialResult.maxDamage
      ? physicalResult
      : specialResult;
  }
  const physical =
    (o.move.resolvedDamageClass ?? o.move.damageClass) === "physical";
  const profile = getDamageStatProfile({
    id,
    damageClass: physical ? "physical" : "special",
  });
  let attack = calculateBattleStat(
    aStats[profile.attack],
    o.attackEv,
    o.attackNature,
  );
  let defense = calculateBattleStat(
    dStats[profile.defense],
    o.defenseEv,
    o.defenseNature,
  );
  let attackStage =
    profile.attack === "defense"
      ? a.defenseStage
      : physical
        ? a.attackStage
        : a.specialAttackStage;
  let defenseStage =
    profile.defense === "defense" ? d.defenseStage : d.specialDefenseStage;
  if (id === "492") {
    attack = calculateBattleStat(dStats.attack, o.attackEv, o.attackNature);
    attackStage = d.attackStage;
  }
  if ((critical && attackStage < 0) || da === "てんねん") attackStage = 0;
  if (
    (critical && defenseStage > 0) ||
    aa === "てんねん" ||
    ["533", "663"].includes(id)
  )
    defenseStage = 0;
  attack = stage(attack, attackStage);
  defense = stage(defense, defenseStage);
  if (profile.defense === "defense") {
    if (da === "ファーコート") defense = mod(defense, 2);
    if (
      (da === "ふしぎなうろこ" &&
        (d.status !== "none" || o.defenderAbilityCondition)) ||
      (da === "くさのけがわ" &&
        (f.terrain === "grass" || o.defenderAbilityCondition))
    )
      defense = mod(defense, 1.5);
    if (weather === "snow" && dt.includes("ice")) defense = mod(defense, 1.5);
  } else if (weather === "sand" && dt.includes("rock"))
    defense = mod(defense, 1.5);
  const effective = getEffectiveMove(o.move, aa);
  let type = effective.type,
    power = effective.power;
  if (id === "873")
    type =
      (
        {
          "paldean-tauros-combat-breed": "fighting",
          "paldean-tauros-blaze-breed": "fire",
          "paldean-tauros-aqua-breed": "water",
          "tauros-paldea-combat": "fighting",
          "tauros-paldea-blaze": "fire",
          "tauros-paldea-aqua": "water",
          "tauros-paldea-combat-breed": "fighting",
          "tauros-paldea-blaze-breed": "fire",
          "tauros-paldea-aqua-breed": "water",
        } as Record<string, string>
      )[o.attacker.id] ?? type;
  if (id === "873" && type !== "normal") power = o.move.power;
  if (id === "783" && a.form === "hangry") type = "dark";
  if (id === "311" && attackWeather !== "none") {
    type =
      (
        { sun: "fire", rain: "water", sand: "rock", snow: "ice" } as Record<
          string,
          string
        >
      )[attackWeather] ?? type;
    power = o.move.power * 2;
  }
  if (id === "805" && f.terrain !== "none" && ag) {
    type = terrainType[f.terrain];
    power = o.move.power * 2;
  }
  if (
    (id === "282" &&
      d.item !== "none" &&
      d.item !== "mega-stone" &&
      d.itemRemovable) ||
    (id === "512" && a.item === "none") ||
    (id === "263" &&
      ["burn", "poison", "toxic", "paralysis"].includes(a.status)) ||
    (["506", "844"].includes(id) && d.status !== "none") ||
    (["474", "839"].includes(id) && ["poison", "toxic"].includes(d.status)) ||
    (id === "419" && a.damagedThisTurn) ||
    (id === "371" && a.movedLast) ||
    (["707", "915"].includes(id) && a.previousMoveFailed) ||
    (id === "372" && d.damagedThisTurn) ||
    (id === "907" && a.enhancedMove)
  )
    power *= 2;
  // はたきおとすだけは1.5倍。
  if (
    id === "282" &&
    d.item !== "none" &&
    d.item !== "mega-stone" &&
    d.itemRemovable
  )
    power = mod(effective.power, 1.5);
  if (id === "889") power = 50 + 50 * Math.min(6, a.receivedHits);
  if (id === "854") power = 50 + 50 * a.faintedAllies;
  if (["500", "681"].includes(id))
    power =
      20 +
      20 *
        Math.max(
          a.positiveStages,
          Math.max(0, a.attackStage) +
            Math.max(0, a.defenseStage) +
            Math.max(0, a.specialAttackStage) +
            Math.max(0, a.specialDefenseStage) +
            Math.max(0, a.speedStage),
        );
  const weight = (kg: number | undefined, ability: string | null | undefined) =>
    (kg ?? 0) *
    (ability === "ヘヴィメタル" ? 2 : ability === "ライトメタル" ? 0.5 : 1);
  const aw = weight(o.attacker.weightKg, aa),
    dw = weight(o.defender.weightKg, da);
  if (
    ["67", "447", "484", "535"].includes(id) &&
    (!(dw > 0) || (["484", "535"].includes(id) && !(aw > 0)))
  )
    return {
      minDamage: 0,
      maxDamage: 0,
      minPercent: 0,
      maxPercent: 0,
      hitLabel: "体重データなし",
      effectiveMoveType: type,
      effectivePower: 0,
    };
  if (["67", "447"].includes(id))
    power =
      dw >= 200
        ? 120
        : dw >= 100
          ? 100
          : dw >= 50
            ? 80
            : dw >= 25
              ? 60
              : dw >= 10
                ? 40
                : 20;
  if (["484", "535"].includes(id))
    power =
      aw / dw >= 5
        ? 120
        : aw / dw >= 4
          ? 100
          : aw / dw >= 3
            ? 80
            : aw / dw >= 2
              ? 60
              : 40;
  if (["284", "323"].includes(id))
    power = Math.max(1, Math.floor((150 * ahp) / ahpMax));
  if (["175", "179"].includes(id)) {
    const ratio = Math.floor((48 * ahp) / ahpMax);
    power =
      ratio <= 1
        ? 200
        : ratio <= 4
          ? 150
          : ratio <= 9
            ? 100
            : ratio <= 16
              ? 80
              : ratio <= 32
                ? 40
                : 20;
  }
  const speed = (
    base: number,
    c: DamageConditions,
    ability: string | null | undefined,
  ) => {
    let s = stage(
      calculateBattleStat(base, c.speedEv, c.speedNature),
      c.speedStage,
    );
    if (c.tailwind) s *= 2;
    if (c.status === "paralysis" && ability !== "はやあし")
      s = Math.floor(s / 2);
    if (ability === "はやあし" && c.status !== "none") s = mod(s, 1.5);
    if (ability === "かるわざ" && c.unburden && c.item === "none") s *= 2;
    if (c.item === "iron-ball" && ability !== "ぶきよう") s = Math.floor(s / 2);
    if (c.item === "choice-scarf" && ability !== "ぶきよう") s = mod(s, 1.5);
    if (
      (ability === "すいすい" && weather === "rain") ||
      (ability === "ようりょくそ" && sunny) ||
      (ability === "すなかき" && weather === "sand") ||
      (ability === "ゆきかき" && weather === "snow") ||
      (ability === "サーフテール" && f.terrain === "electric")
    )
      s *= 2;
    return Math.max(1, s);
  };
  if (id === "360")
    power = Math.min(
      150,
      Math.floor(
        (25 * speed(dStats.speed, d, da)) / speed(aStats.speed, a, aa),
      ) + 1,
    );
  if (id === "486") {
    const ratio = speed(aStats.speed, a, aa) / speed(dStats.speed, d, da);
    power =
      ratio >= 4
        ? 150
        : ratio >= 3
          ? 120
          : ratio >= 2
            ? 80
            : ratio >= 1
              ? 60
              : 40;
  }
  if (id === "912") power = Math.max(1, Math.floor((100 * hp) / fullHp));
  if (id === "255") power = 100 * a.stockpiles;
  if (id === "374") {
    const flingPower: Record<string, number> = {
      "iron-ball": 130,
      "life-orb": 30,
      "expert-belt": 10,
      "focus-sash": 10,
      "normal-gem": 10,
      "choice-scarf": 10,
      "muscle-band": 10,
      "wise-glasses": 10,
      "light-ball": 30,
    };
    power =
      ["none", "mega-stone"].includes(a.item) || aa === "ぶきよう"
        ? 0
        : a.flingPower ||
          (a.item.startsWith("resist:") ? 10 : (flingPower[a.item] ?? 0));
  }
  if (
    ["76", "669"].includes(id) &&
    ["rain", "sand", "snow"].includes(attackWeather)
  )
    power = mod(power, 0.5);
  if (
    (id === "797" && f.terrain === "psychic" && ag) ||
    (id === "802" && f.terrain === "misty" && ag) ||
    (id === "788" && f.gravity)
  )
    power = mod(power, 1.5);
  if (id === "804" && f.terrain === "electric" && dg) power *= 2;
  if (["89", "523"].includes(id) && f.terrain === "grass" && dg)
    power = mod(power, 0.5);
  if (d.minimized && ["34", "407", "560", "916", "484", "535"].includes(id))
    power *= 2;
  if (
    (d.airborne === "dig" && ["89", "222"].includes(id)) ||
    (d.airborne === "dive" && ["57", "250"].includes(id))
  )
    power *= 2;
  let multiplier = getTypeMultiplier(
    type,
    dt.filter(
      (t) =>
        !(
          t === "ghost" &&
          aa === "きもったま" &&
          ["normal", "fighting"].includes(type)
        ) && !(t === "flying" && type === "ground" && f.gravity),
    ),
  );
  if (type === "ground" && (f.gravity || d.grounded || d.item === "iron-ball"))
    multiplier = getTypeMultiplier(
      type,
      dt.filter((t) => t !== "flying"),
    );
  if (id === "573")
    multiplier = dt.reduce(
      (n, t) => n * (t === "water" ? 2 : getTypeMultiplier(type, [t])),
      1,
    );
  if (id === "560") multiplier *= getTypeMultiplier("flying", dt);
  if (
    da &&
    IMMUNITIES[da]?.includes(type) &&
    !(da === "ふゆう" && (f.gravity || d.grounded || d.item === "iron-ball"))
  )
    multiplier = 0;
  if (
    type === "ground" &&
    d.item === "air-balloon" &&
    da !== "ぶきよう" &&
    !f.gravity &&
    !d.grounded
  )
    multiplier = 0;
  if (
    (da === "ぼうおん" && o.move.tags.includes("sound")) ||
    (da === "ぼうだん" && o.move.tags.includes("ballistic"))
  )
    multiplier = 0;
  let priority = o.move.priority ?? 0;
  if (id === "803" && f.terrain === "grass" && ag) priority = 1;
  if (aa === "はやてのつばさ" && type === "flying" && a.hpPercent === 100)
    priority++;
  let blocked =
    ([aa, originalDa, a.allyAbility, d.allyAbility].includes("しめりけ") &&
      ["120", "153", "802"].includes(id)) ||
    (priority > 0 &&
      ([da, d.allyAbility].some(
        (x) => x === "テイルアーマー" || x === "じょおうのいげん",
      ) ||
        (f.terrain === "psychic" && dg)));
  const contact = id === "801" ? physical : o.move.isContact;
  if (
    d.protect &&
    !(["ふかしのこぶし", "かんつうドリル"].includes(aa ?? "") && contact)
  )
    blocked = true;
  if (
    (d.airborne === "fly" &&
      !["87", "239", "16", "18", "327", "542", "614"].includes(id)) ||
    (d.airborne === "dig" && !["89", "222"].includes(id)) ||
    (d.airborne === "dive" && !["57", "250"].includes(id))
  )
    blocked = true;
  const result = (lo: number, hi: number, label?: string): DamageResult => ({
    minDamage: lo,
    maxDamage: hi,
    minPercent: (lo / fullHp) * 100,
    maxPercent: (hi / fullHp) * 100,
    hitLabel:
      label ??
      (hi <= 0 ? "無効" : lo >= hp ? "確1" : hi >= hp ? "乱1" : "命中1回"),
    effectiveMoveType: type,
    effectivePower: power,
    effectiveDamageClass: physical ? "physical" : "special",
  });
  if (blocked) return result(0, 0, "使用不可");
  if (!multiplier) return result(0, 0, "無効");
  if (["12", "32", "90", "329"].includes(id))
    return da === "がんじょう" ||
      (id === "329" && dt.includes("ice")) ||
      (id === "90" && !dg)
      ? result(0, 0, "無効")
      : result(
          hp,
          hp,
          `一撃必殺・命中${id === "329" && !at.includes("ice") ? 20 : 30}%`,
        );
  let fixed: [number, number] | null = null;
  if (["69", "101"].includes(id)) fixed = [50, 50];
  if (id === "49") fixed = [20, 20];
  if (id === "82") fixed = [40, 40];
  if (id === "149") fixed = [25, 75];
  if (id === "162")
    fixed = [Math.max(1, Math.floor(hp / 2)), Math.max(1, Math.floor(hp / 2))];
  if (id === "515") fixed = [ahp, ahp];
  if (id === "283") fixed = [Math.max(0, hp - ahp), Math.max(0, hp - ahp)];
  if (["68", "243", "117"].includes(id))
    fixed = [a.receivedDamage * 2, a.receivedDamage * 2];
  if (["368", "894"].includes(id))
    fixed = [
      Math.floor(a.receivedDamage * 1.5),
      Math.floor(a.receivedDamage * 1.5),
    ];
  if (fixed) {
    if (fixed[1] === 0)
      return result(0, 0, id === "283" ? "失敗" : "条件を設定");
    const fixedHits =
      aa === "おやこあい" && ["49", "69", "82", "101", "149"].includes(id)
        ? 2
        : 1;
    const fixedRun = (damage: number) => {
      let remaining = hp,
        total = 0,
        disguise = da === "ばけのかわ" && d.disguiseIntact;
      for (let hit = 0; hit < fixedHits; hit++) {
        let n = damage;
        if (d.protect) n = Math.floor(n / 4);
        if (disguise) {
          n = Math.floor(fullHp / 8);
          disguise = false;
        } else if (
          remaining === fullHp &&
          (da === "がんじょう" ||
            (d.item === "focus-sash" && da !== "ぶきよう"))
        )
          n = Math.min(n, remaining - 1);
        total += n;
        remaining -= n;
      }
      return total;
    };
    return result(fixedRun(fixed[0]), fixedRun(fixed[1]));
  }
  let powerModifier = 4096;
  const boostPower = (factor: number) => {
    powerModifier = chain(powerModifier, factor);
  };
  const sheer =
    aa === "ちからずく" && (SHEER_FORCE.has(id) || a.sheerForceEligible);
  if (sheer) boostPower(5325 / 4096);
  if (aa === "テクニシャン" && power <= 60) boostPower(1.5);
  const boosts: [string, boolean, number][] = [
    ["かたいツメ", contact, 5325 / 4096],
    ["がんじょうあご", o.move.tags.includes("bite"), 1.5],
    ["きれあじ", o.move.tags.includes("slicing"), 1.5],
    ["てつのこぶし", o.move.tags.includes("punch"), 4915 / 4096],
    ["メガランチャー", o.move.tags.includes("pulse"), 1.5],
    ["パンクロック", o.move.tags.includes("sound"), 5325 / 4096],
    ["すてみ", o.move.tags.includes("recoil"), 4915 / 4096],
    ["アナライズ", a.movedLast || !!o.attackerAbilityCondition, 5325 / 4096],
    [
      "すなのちから",
      (weather === "sand" || !!o.attackerAbilityCondition) &&
        ["rock", "ground", "steel"].includes(type),
      5325 / 4096,
    ],
    ["ほのおのたてがみ", type === "fire", 1.5],
    ["はがねのせいしん", type === "steel", 1.5],
  ];
  for (const [name, active, factor] of boosts)
    if (aa === name && active) boostPower(factor);
  if (
    (aa === "フェアリーオーラ" ||
      originalDa === "フェアリーオーラ" ||
      f.fairyAura ||
      a.allyAbility === "フェアリーオーラ" ||
      d.allyAbility === "フェアリーオーラ") &&
    type === "fairy"
  )
    boostPower(5448 / 4096);
  if (a.allyAbility === "はがねのせいしん" && type === "steel") boostPower(1.5);
  if (aa === "そうだいしょう")
    boostPower(1 + 0.1 * Math.min(5, a.faintedAllies));
  if (a.helpingHand) boostPower(1.5);
  // イカサマは相手の能力値・ランクを借りるが、攻撃補正の特性は技を使う側。
  const attackAbility = aa;
  if (physical && ["ちからもち", "ヨガパワー"].includes(attackAbility ?? ""))
    attack = mod(attack, 2);
  if (physical && attackAbility === "はりきり") attack = mod(attack, 1.5);
  if (aa === "すいほう" && type === "water") attack = mod(attack, 2);
  if (
    (physical &&
      aa === "こんじょう" &&
      (a.status !== "none" || o.attackerAbilityCondition)) ||
    (!physical &&
      aa === "サンパワー" &&
      (sunny || o.attackerAbilityCondition)) ||
    (!physical &&
      ["プラス", "マイナス"].includes(aa ?? "") &&
      (["プラス", "マイナス"].includes(a.allyAbility) ||
        o.attackerAbilityCondition))
  )
    attack = mod(attack, 1.5);
  if (aa === "はりこみ" && (d.switchedIn || o.attackerAbilityCondition))
    attack = mod(attack, 2);
  if (aa === "もらいび" && o.attackerAbilityCondition && type === "fire")
    attack = mod(attack, 1.5);
  if (
    (a.hpPercent <= 100 / 3 || o.attackerAbilityCondition) &&
    (
      {
        げきりゅう: "water",
        しんりょく: "grass",
        むしのしらせ: "bug",
        もうか: "fire",
      } as Record<string, string>
    )[aa ?? ""] === type
  )
    attack = mod(attack, 1.5);
  if (
    (da === "あついしぼう" && ["fire", "ice"].includes(type)) ||
    (da === "きよめのしお" && type === "ghost") ||
    (["すいほう", "たいねつ"].includes(da ?? "") && type === "fire")
  )
    attack = mod(attack, 0.5);
  if (aa === "とうそうしん" && a.gender !== "none" && d.gender !== "none")
    boostPower(a.gender === d.gender ? 1.25 : 0.75);
  const stab =
    at.includes(type) ||
    (o.attackerAbilityCondition &&
      ["へんげんじざい", "リベロ"].includes(aa ?? ""))
      ? aa === "てきおうりょく"
        ? 2
        : 1.5
      : 1;
  let finalModifier =
    aa === "ぶきよう" ? 4096 : Math.round((o.itemDamageModifier ?? 1) * 4096);
  const boostFinal = (factor: number) => {
    finalModifier = chain(finalModifier, factor);
  };
  if (aa !== "ぶきよう") {
    if (a.item.startsWith("boost:") && a.item === `boost:${type}`)
      boostPower(4915 / 4096);
    if (a.item === "light-ball" && o.attacker.id === "pikachu")
      attack = mod(attack, 2);
    if (a.item === "life-orb") boostFinal(5324 / 4096);
    if (a.item === "expert-belt" && multiplier > 1) boostFinal(4915 / 4096);
    if (
      (a.item === "muscle-band" && physical) ||
      (a.item === "wise-glasses" && !physical)
    )
      boostPower(4505 / 4096);
    if (a.item === "normal-gem" && type === "normal") boostPower(5325 / 4096);
  }
  if (da === "かんそうはだ" && type === "fire") boostFinal(1.25);
  if (["ハードロック", "フィルター"].includes(da ?? "") && multiplier > 1)
    boostFinal(0.75);
  if (
    (da === "はどうのぼうご" && contact) ||
    (da === "パンクロック" && o.move.tags.includes("sound")) ||
    (da === "もふもふ" && contact)
  )
    boostFinal(0.5);
  if (da === "もふもふ" && type === "fire") boostFinal(2);
  if (d.allyAbility === "フレンドガード") boostFinal(0.75);
  if (
    !critical &&
    !["280", "678", "873", "706"].includes(id) &&
    (d.auroraVeil || (physical && d.reflect) || (!physical && d.lightScreen))
  )
    boostFinal(f.doubles ? 2732 / 4096 : 0.5);
  if (d.protect) boostFinal(0.25);
  let weatherMod = 1;
  if (
    (sunny && type === "fire") ||
    (attackWeather === "rain" && type === "water")
  )
    weatherMod = 1.5;
  if (
    (sunny && type === "water") ||
    (attackWeather === "rain" && type === "fire")
  )
    weatherMod = 0.5;
  if (
    ag &&
    (
      { electric: "electric", grass: "grass", psychic: "psychic" } as Record<
        string,
        string
      >
    )[f.terrain] === type
  )
    boostPower(5325 / 4096);
  if (dg && f.terrain === "misty" && type === "dragon") boostPower(0.5);
  if (a.charged && type === "electric") boostPower(2);
  power = mod(power, powerModifier / 4096);
  const multi = MULTI[id];
  let minHits = multi?.[0] ?? 1,
    maxHits = multi?.[1] ?? 1;
  if (id === "751" && f.doubles && a.dragonDartsSplit) minHits = maxHits = 1;
  if (multi && a.hits)
    minHits = maxHits = Math.max(multi[0], Math.min(multi[1], a.hits));
  if (multi && aa === "スキルリンク") minHits = maxHits = multi[1];
  const parent =
    aa === "おやこあい" &&
    !multi &&
    !(f.doubles && f.targets > 1 && o.move.spread) &&
    !["251", "120", "153", "802", "515", "374"].includes(id);
  if (parent) minHits = maxHits = 2;
  const beat = a.beatUpAttacks
    .split(",")
    .map(Number)
    .filter((n) => n > 0);
  if (id === "251") minHits = maxHits = beat.length;
  if ((id === "251" && !beat.length) || power <= 0)
    return result(0, 0, "条件を設定");
  const run = (random: number, hits: number) => {
    let remaining = hp,
      total = 0,
      defStage = defenseStage,
      disguise = da === "ばけのかわ" && d.disguiseIntact,
      berry = d.item.startsWith("resist:") && da !== "ぶきよう";
    for (let hit = 0; hit < hits; hit++) {
      const hitPower =
        id === "813"
          ? power * (hit + 1)
          : id === "251"
            ? mod(Math.floor(beat[hit] / 10) + 5, powerModifier / 4096)
            : id === "282" && parent && hit > 0
              ? mod(effective.power, powerModifier / 4096)
              : power;
      const hitDefense =
        hit && ["じきゅうりょく", "くだけるよろい"].includes(da ?? "")
          ? Math.max(
              1,
              Math.floor(
                (defense /
                  (defenseStage >= 0
                    ? (2 + defenseStage) / 2
                    : 2 / (2 - defenseStage))) *
                  (defStage >= 0
                    ? (2 + Math.min(6, defStage)) / 2
                    : 2 / (2 - Math.max(-6, defStage))),
              ),
            )
          : defense;
      let n =
        Math.floor(Math.floor((22 * hitPower * attack) / hitDefense) / 50) + 2;
      if (
        f.doubles &&
        f.targets > 1 &&
        (o.move.spread || (id === "797" && ag && f.terrain === "psychic"))
      )
        n = mod(n, 0.75);
      if (parent && hit === 1) n = mod(n, 0.25);
      n = mod(n, weatherMod);
      if (critical) n = Math.floor(n * 1.5);
      n = Math.floor(n * random);
      n = mod(n, stab);
      n = Math.floor(n * multiplier);
      if (
        physical &&
        a.status === "burn" &&
        aa !== "こんじょう" &&
        aa !== "すいほう" &&
        id !== "263"
      )
        n = Math.floor(n / 2);
      let hitFinal = finalModifier;
      if (critical && aa === "スナイパー") hitFinal = chain(hitFinal, 1.5);
      if (remaining === fullHp && da === "マルチスケイル")
        hitFinal = chain(hitFinal, 0.5);
      if (
        berry &&
        (multiplier > 1 || type === "normal") &&
        d.item === `resist:${type}`
      ) {
        hitFinal = chain(hitFinal, 0.5);
        berry = false;
      }
      n = mod(n, hitFinal / 4096);
      if (disguise) {
        n = Math.floor(fullHp / 8);
        disguise = false;
      } else if (
        remaining === fullHp &&
        (da === "がんじょう" || (d.item === "focus-sash" && da !== "ぶきよう"))
      )
        n = Math.min(n, remaining - 1);
      total += n;
      remaining -= n;
      if (da === "じきゅうりょく") defStage++;
      if (da === "くだけるよろい" && physical) defStage--;
    }
    return total;
  };
  const lo = run(0.85, minHits),
    hi = run(1, maxHits);
  // 状態が変わる技・防御効果から単純な割り算で確定数を推定しない。
  const stateful =
    multi ||
    parent ||
    [
      "マルチスケイル",
      "がんじょう",
      "ばけのかわ",
      "じきゅうりょく",
      "くだけるよろい",
    ].includes(da ?? "") ||
    d.item !== "none" ||
    ["284", "323", "175", "179", "889", "854", "282", "251", "374"].includes(
      id,
    );
  return result(
    lo,
    hi,
    hi <= 0
      ? "無効"
      : lo >= hp
        ? "確1"
        : hi >= hp
          ? "乱1"
          : stateful
            ? "命中1回"
            : Math.ceil(hp / lo) === Math.ceil(hp / hi)
              ? `確${Math.ceil(hp / lo)}`
              : `乱${Math.ceil(hp / hi)}`,
  );
}
