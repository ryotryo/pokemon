import { describe, expect, it } from "vitest";
import usageIndex from "../../data/usage-ranking/index.json";
import { guideByPokemonId, guideBySlug, guideSources, pokemonGuides, sourceById } from "../../content/pokemon-guides";
import type { UsageRankingIndex } from "../../lib/champions/usage-ranking";

const index = usageIndex as UsageRankingIndex;
const pokemonIds = new Set(index.pokemon.map((pokemon) => pokemon.id));
const currentTop10 = index.pokemon
  .filter((pokemon) => pokemon.formRelation !== "mega" && pokemon.ranks.Singles !== null)
  .sort((a, b) => a.ranks.Singles! - b.ranks.Singles!)
  .slice(0, 10);

describe("pokemon guides", () => {
  it("freezes the M5 Singles top ten as the first article set", () => {
    expect(index.seasonLabel).toBe("M5");
    expect(pokemonGuides).toHaveLength(10);
    expect(pokemonGuides.map((guide) => guide.pokemonId)).toEqual(currentTop10.map((pokemon) => pokemon.id));
    expect(pokemonGuides.map((guide) => guide.rankAtCreation)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("has unique routes and only exposes existing guide links", () => {
    expect(new Set(pokemonGuides.map((guide) => guide.slug)).size).toBe(10);
    expect(guideBySlug.size).toBe(10);
    expect(guideByPokemonId.size).toBe(10);
    expect(guideByPokemonId.has("garchomp")).toBe(true);
    expect(guideByPokemonId.has("charizard")).toBe(false);
  });

  it("keeps Mega forms attached to the same ranking unit", () => {
    for (const guide of pokemonGuides) {
      const base = index.pokemon.find((pokemon) => pokemon.id === guide.pokemonId)!;
      const megas = index.pokemon.filter((pokemon) => pokemon.formRelation === "mega" && pokemon.battleId === base.battleId);
      for (const mega of megas) {
        expect(mega.ranks.Singles).toBe(base.ranks.Singles);
        expect(guideByPokemonId.has(mega.id)).toBe(false);
      }
    }
    expect(index.pokemon.find((pokemon) => pokemon.id === "mega-gyarados")?.types).toEqual(["water", "dark"]);
    expect(index.pokemon.find((pokemon) => pokemon.id === "mega-delphox")?.types).toEqual(["fire", "psychic"]);
  });

  it("keeps every guide complete, traceable, and limited to M3-M5 strategy sources", () => {
    for (const guide of pokemonGuides) {
      expect(pokemonIds.has(guide.pokemonId)).toBe(true);
      expect(guide.rule).toBe("Singles");
      expect(guide.seasonScope).toEqual(["M3", "M4", "M5"]);
      expect(guide.basicUsage.length).toBeGreaterThanOrEqual(2);
      expect(guide.favorableMatchups.length).toBeGreaterThanOrEqual(4);
      expect(guide.unfavorableMatchups.length).toBeGreaterThanOrEqual(4);
      expect(guide.countermeasures.length).toBeGreaterThanOrEqual(2);
      expect(guide.beginnerSummary.length).toBeGreaterThanOrEqual(2);
      for (const matchup of [...guide.favorableMatchups, ...guide.unfavorableMatchups]) {
        expect(pokemonIds.has(matchup.pokemonId)).toBe(true);
        expect(matchup.explanation.length).toBeGreaterThan(30);
        matchup.sourceIds.forEach((id) => expect(sourceById.has(id)).toBe(true));
      }
      for (const measure of guide.countermeasures) {
        measure.targetPokemonIds.forEach((id) => expect(pokemonIds.has(id)).toBe(true));
        measure.teammatePokemonIds?.forEach((id) => expect(pokemonIds.has(id)).toBe(true));
        measure.sourceIds.forEach((id) => expect(sourceById.has(id)).toBe(true));
      }
      guide.sourceIds.forEach((id) => expect(sourceById.has(id)).toBe(true));
    }
  });

  it("stores valid Japanese article metadata and no M1/M2 strategic sources", () => {
    expect(guideSources.length).toBeGreaterThanOrEqual(8);
    for (const source of guideSources) {
      expect(["M3", "M4", "M5"]).toContain(source.season);
      expect(source.url).toMatch(/^https:\/\/(pokesol\.app|note\.com)\//);
      expect(source.title.length).toBeGreaterThan(5);
      expect(source.author.length).toBeGreaterThan(1);
      expect(source.usedFor.length).toBeGreaterThan(10);
    }
  });
});
