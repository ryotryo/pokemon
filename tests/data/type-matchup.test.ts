import { describe, expect, it } from "vitest";
import { evaluateMatchup, evaluatePartyMember, getCoverageDots, getTypeMultiplier } from "../../lib/champions/type-matchup";

describe("type matchup", () => {
  it("multiplies dual-type effectiveness", () => {
    expect(getTypeMultiplier("ice", ["Dragon", "Flying"])).toBe(4);
    expect(getTypeMultiplier("ground", ["Electric", "Flying"])).toBe(0);
  });
  it("treats neutralized dual-type attacks as below weakness", () => expect(getTypeMultiplier("fire", ["Grass", "Water"])).toBe(1));
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
