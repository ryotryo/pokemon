import { describe, expect, it } from "vitest";
import { evaluateMatchup, evaluatePartyMember, getCoverageDots, getResistances, getTypeMatchups, getTypeMultiplier, getWeaknesses } from "../../lib/champions/type-matchup";

describe("type matchup", () => {
  it("multiplies dual-type effectiveness", () => {
    expect(getTypeMultiplier("ice", ["Dragon", "Flying"])).toBe(4);
    expect(getTypeMultiplier("ground", ["Electric", "Flying"])).toBe(0);
  });
  it("treats neutralized dual-type attacks as below weakness", () => expect(getTypeMultiplier("fire", ["Grass", "Water"])).toBe(1));
  it("lists dual-type weaknesses by multiplier", () => {
    expect(getWeaknesses(["Bug", "Steel"])).toEqual([{ type: "fire", multiplier: 4 }]);
    expect(getWeaknesses(["Dragon", "Ground"])).toEqual([
      { type: "ice", multiplier: 4 },
      { type: "dragon", multiplier: 2 },
      { type: "fairy", multiplier: 2 },
    ]);
  });
  it("lists single-type resistances and type-based immunities", () => {
    expect(getResistances(["Fire"])).toEqual([
      { type: "fire", multiplier: 0.5 },
      { type: "grass", multiplier: 0.5 },
      { type: "ice", multiplier: 0.5 },
      { type: "bug", multiplier: 0.5 },
      { type: "steel", multiplier: 0.5 },
      { type: "fairy", multiplier: 0.5 },
    ]);
    expect(getResistances(["Flying"])).toContainEqual({ type: "ground", multiplier: 0 });
  });
  it("lists quarter resistances and excludes neutralized dual-type matchups", () => {
    const matchups = getTypeMatchups(["Bug", "Steel"]);
    expect(getWeaknesses(["Bug", "Steel"])).toContainEqual({ type: "fire", multiplier: 4 });
    expect(getResistances(["Bug", "Steel"])).toContainEqual({ type: "grass", multiplier: 0.25 });
    expect(getResistances(["Bug", "Steel"])).toContainEqual({ type: "poison", multiplier: 0 });
    expect(matchups.find(({ type }) => type === "fighting")?.multiplier).toBe(1);
    expect(getWeaknesses(["Bug", "Steel"]).some(({ type }) => type === "fighting")).toBe(false);
    expect(getResistances(["Bug", "Steel"]).some(({ type }) => type === "fighting")).toBe(false);
    expect([...getWeaknesses(["Bug", "Steel"]), ...getResistances(["Bug", "Steel"])]).not.toContainEqual(expect.objectContaining({ multiplier: 1 }));
  });
  it("uses only form types and does not add Levitate immunity", () => {
    expect(getTypeMultiplier("rock", ["Fire", "Flying"])).toBe(4);
    expect(getTypeMultiplier("rock", ["Fire", "Dragon"])).toBe(2);
    expect(getTypeMultiplier("ground", ["Electric", "Water"])).toBe(2);
    expect(getResistances(["Electric", "Water"]).some(({ type }) => type === "ground")).toBe(false);
  });
  it("deduplicates attack types and retains effective types and best multiplier", () => {
    expect(evaluatePartyMember({ id: "a", name: "A", moves: [
      { id: "ice-beam", displayNameJa: "れいとうビーム", type: "ice", damageClass: "special", isCoverageMove: true, usage: 32.5 },
      { id: "ice-beam", displayNameJa: "れいとうビーム", type: "ice", damageClass: "special", isCoverageMove: true, usage: 32.5 },
      { id: "rock-slide", displayNameJa: "いわなだれ", type: "rock", damageClass: "physical", isCoverageMove: true, usage: 18.7 },
    ] }, ["Dragon", "Flying"])).toEqual({
      id: "a", name: "A", canHitWeakness: true, effectiveTypes: ["ice", "rock"], bestMultiplier: 4,
      effectiveMoves: [
        { moveId: "ice-beam", displayNameJa: "れいとうビーム", type: "ice", multiplier: 4, usage: 32.5 },
        { moveId: "rock-slide", displayNameJa: "いわなだれ", type: "rock", multiplier: 2, usage: 18.7 },
      ],
    });
  });
  it("counts each party member once even with multiple effective types", () => {
    const result = evaluateMatchup([
      { id: "a", name: "A", moves: [{ id: "ice-beam", displayNameJa: "れいとうビーム", type: "ice", damageClass: "special", isCoverageMove: true }] },
      { id: "b", name: "B", moves: [{ id: "tackle", displayNameJa: "たいあたり", type: "normal", damageClass: "physical", isCoverageMove: true }] },
    ], ["Dragon", "Flying"]);
    expect(result.count).toBe(1);
  });
  it("always creates six coverage dots and leaves empty slots unfilled", () => {
    expect(getCoverageDots(2)).toEqual([true, true, false, false, false, false]);
    expect(getCoverageDots(8)).toEqual([true, true, true, true, true, true]);
  });
  it("never includes status or sub-2x moves in effective moves", () => {
    const result = evaluatePartyMember({ id: "a", name: "A", moves: [
      { id: "swords-dance", displayNameJa: "つるぎのまい", type: "normal", damageClass: "status", isCoverageMove: false },
      { id: "dragon-claw", displayNameJa: "ドラゴンクロー", type: "dragon", damageClass: "physical", isCoverageMove: true },
      { id: "rock-slide", displayNameJa: "いわなだれ", type: "rock", damageClass: "physical", isCoverageMove: true },
    ] }, ["Fire", "Flying"]);
    expect(result.effectiveMoves).toEqual([{ moveId: "rock-slide", displayNameJa: "いわなだれ", type: "rock", multiplier: 4 }]);
  });
});
