import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { guideResearchBySlug, guideResearchSources } from "../../content/pokemon-guide-research";
import { pokemonGuides } from "../../content/pokemon-guides";
import { resolveGuideDamageExamples, statPointsToEv } from "../../lib/champions/pokemon-guide-damage";

describe("pokemon guide research and damage examples", () => {
  it("records saturated research logs for all ten frozen articles", () => {
    expect(Object.keys(guideResearchBySlug).sort()).toEqual(pokemonGuides.map((guide) => guide.slug).sort());
    for (const research of Object.values(guideResearchBySlug)) {
      expect(research.articlesReviewed).toBeGreaterThanOrEqual(9);
      expect(research.saturationNote.length).toBeGreaterThan(20);
      expect(research.omittedClaims.length).toBeGreaterThan(0);
    }
    for (const source of guideResearchSources) {
      expect(source.checkedAt).toBe("2026-08-30");
      expect(["M3", "M4", "M5"]).toContain(source.season);
      expect(source.claimIds.length).toBeGreaterThan(0);
    }
  });

  it("only labels repeated cores when multiple independent sources are recorded", () => {
    const namedPairs = Object.values(guideResearchBySlug).flatMap((research) => research.synergyPairs).filter((pair) => pair.nickname);
    expect(namedPairs.map((pair) => pair.nickname)).toEqual(expect.arrayContaining(["サザングロス", "カイリューガルド", "ガブニンフギャラドス"]));
    for (const pair of namedPairs) expect(new Set(pair.sourceIds).size).toBeGreaterThanOrEqual(2);
  });

  it("converts Champions stat points to equivalent level-50 EV inputs", () => {
    expect(statPointsToEv(0)).toBe(0);
    expect(statPointsToEv(1)).toBe(4);
    expect(statPointsToEv(2)).toBe(12);
    expect(statPointsToEv(32)).toBe(252);
  });

  it("resolves every published example through the shared damage-chart calculator", async () => {
    const specs = Object.values(guideResearchBySlug).flatMap((research) => Object.values(research.matchupDamage).flat());
    const examples = await resolveGuideDamageExamples(specs);
    expect(examples).toHaveLength(specs.length);
    expect(examples.length).toBeGreaterThanOrEqual(12);
    for (const example of examples) {
      expect(example.result.minDamage).toBeGreaterThan(0);
      expect(example.result.maxDamage).toBeGreaterThanOrEqual(example.result.minDamage);
      expect(example.result.maxPercent).toBeGreaterThan(0);
      expect(example.attackerCondition).toContain("HP ");
      expect(example.defenderCondition).toContain("HP ");
    }
  });

  it("keeps source metadata internal and ends the public article with the beginner section", async () => {
    const source = await readFile("features/pokemon-guide/components/pokemon-guide-article.tsx", "utf8");
    expect(source).not.toContain("参考にした構築記事");
    expect(source).not.toContain("sourceById");
    expect(source.lastIndexOf("初めて使うなら")).toBeGreaterThan(source.lastIndexOf("相性のいい組み合わせ"));
  });
});
