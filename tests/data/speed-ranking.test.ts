import { describe, expect, it } from "vitest";
import { calculateEffectiveBaseSpeed, calculateModifiedSpeed, calculateSpeedStats, getScalePosition, normalizeSpeedRanking } from "../../lib/champions/speed-ranking";

describe("speed ranking", () => {
  it("calculates the four level-50 Champions speed points", () => {
    expect(calculateSpeedStats(122)).toEqual({ decreasingMin: 109, neutral: 122, neutralMax: 154, increasingMax: 169 });
  });

  it("uses one shared scale", () => {
    expect(getScalePosition(100, { min: 0, max: 200 })).toBe(50);
    expect(getScalePosition(300, { min: 0, max: 200 })).toBe(100);
  });

  it("calculates modified speed and its equivalent base Speed", () => {
    expect(calculateModifiedSpeed(183, 1.5)).toBe(274);
    expect(calculateEffectiveBaseSpeed(115, 1.5)).toBe(183);
    expect(calculateModifiedSpeed(183, 2)).toBe(366);
    expect(calculateEffectiveBaseSpeed(115, 2)).toBe(250);
  });

  it("includes only current-season ranked records and expands mega forms", () => {
    const ranked = { slug: "garchomp", summary: { battleSummary: { Current: { Singles: { position: 1 }, Doubles: { position: 2 } } }, forms: [
      { slug: "garchomp", saved_name: "Garchomp", form_kind: "Base", speed: 122, image_path: "Garchomp.png" },
      { slug: "mega-garchomp", saved_name: "Mega Garchomp", form_kind: "Mega", speed: 112, image_path: "Mega Garchomp.png" },
    ], primary: { form_kind: "Base" } } };
    const unranked = { slug: "missing", summary: { battleSummary: { Current: { Singles: {}, Doubles: {} } }, forms: [{ slug: "missing", saved_name: "Missing", form_kind: "Base", speed: 100, image_path: "Missing.png" }], primary: { form_kind: "Base" } } };
    const result = normalizeSpeedRanking([ranked, unranked], "Current", { garchomp: "ガブリアス", "mega-garchomp": "メガガブリアス" }, "2026-07-26T00:00:00.000Z", "https://championsbattledata.com/api");
    expect(result.pokemon.map(({ id }) => id)).toEqual(["garchomp", "mega-garchomp"]);
    expect(result.pokemon[0]).toMatchObject({ baseSpeed: 102, usageRanks: { Singles: 1, Doubles: 2 }, stats: { neutral: 122 } });
  });
});
