import { describe, expect, it } from "vitest";
import indexJson from "../../data/usage-ranking/index.json";
import planJson from "../../data/pokemon-intro-production-plan.json";
import { pokemonIntros } from "../../content/pokemon-intros";
import {
  getNextIncompletePokemonIntroBatch,
  getPokemonIntroBatchProgress,
  type PokemonIntroProductionPlan,
} from "../../lib/pokemon-intro-production-plan";

const plan = planJson as PokemonIntroProductionPlan;
const planned = plan.batches.flatMap((batch) => batch.pokemon);
const currentArticleIds = pokemonIntros.map((intro) => intro.pokemonId);

describe("Pokemon intro production plan", () => {
  it("contains every current unarticle Champions form exactly once", () => {
    const targetIds = new Set(indexJson.pokemon.map((pokemon) => pokemon.id));
    const articleIdsAtCreation = new Set(plan.existingArticleIdsAtCreation);
    const plannedIds = planned.map((pokemon) => pokemon.pokemonId);
    expect(new Set(plannedIds).size).toBe(plannedIds.length);
    expect(plannedIds.some((id) => articleIdsAtCreation.has(id))).toBe(false);
    expect(plannedIds.every((id) => targetIds.has(id))).toBe(true);
    expect(new Set([...articleIdsAtCreation, ...plannedIds])).toEqual(targetIds);
  });

  it("uses batches of ten except for the final batch", () => {
    plan.batches.slice(0, -1).forEach((batch) => expect(batch.pokemon).toHaveLength(10));
    expect(plan.batches.at(-1)!.pokemon.length).toBeGreaterThan(0);
    expect(plan.batches.at(-1)!.pokemon.length).toBeLessThanOrEqual(10);
  });

  it("copies real Singles ranks without inventing unranked values", () => {
    const sourceById = new Map(indexJson.pokemon.map((pokemon) => [pokemon.id, pokemon]));
    for (const pokemon of planned) {
      const source = sourceById.get(pokemon.pokemonId)!;
      expect(pokemon.singlesRank).toBe(source.ranks.Singles);
      expect(pokemon.rankingStatus).toBe(source.ranks.Singles === null ? "unranked" : "ranked");
    }
    const firstUnranked = planned.findIndex((pokemon) => pokemon.rankingStatus === "unranked");
    if (firstUnranked >= 0) expect(planned.slice(firstUnranked).every((pokemon) => pokemon.rankingStatus === "unranked")).toBe(true);
  });

  it("derives not-started, partial, complete, and next batch from article IDs", () => {
    const first = plan.batches[0];
    const articlesBeforeBatch01 = plan.existingArticleIdsAtCreation;
    expect(getNextIncompletePokemonIntroBatch(plan, articlesBeforeBatch01)?.id).toBe(first.id);
    expect(getPokemonIntroBatchProgress(plan, articlesBeforeBatch01)[0].status).toBe("not-started");
    expect(getPokemonIntroBatchProgress(plan, [...articlesBeforeBatch01, first.pokemon[0].pokemonId])[0].status).toBe("partial");
    expect(getPokemonIntroBatchProgress(plan, currentArticleIds)[0].status).toBe("complete");
    expect(getNextIncompletePokemonIntroBatch(plan, currentArticleIds)?.id).toBe("batch-02");
  });
});
