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
  it("contains every current unarticle Champions form while preserving historical snapshot entries", () => {
    const targetIds = new Set(indexJson.pokemon.map((pokemon) => pokemon.id));
    const articleIdsAtCreation = new Set(plan.existingArticleIdsAtCreation);
    const currentArticleIdSet = new Set(currentArticleIds);
    const plannedIds = planned.map((pokemon) => pokemon.pokemonId);
    expect(new Set(plannedIds).size).toBe(plannedIds.length);
    expect(plannedIds.some((id) => articleIdsAtCreation.has(id))).toBe(false);
    for (const id of targetIds) expect(currentArticleIdSet.has(id) || plannedIds.includes(id), id).toBe(true);
  });

  it("keeps the original snapshot boundary while appending batches of at most ten", () => {
    const initialPlannedCount = plan.targetCountAtCreation - plan.existingArticleIdsAtCreation.length;
    let cumulative = 0;
    for (const batch of plan.batches) {
      expect(batch.pokemon.length).toBeGreaterThan(0);
      expect(batch.pokemon.length).toBeLessThanOrEqual(10);
      cumulative += batch.pokemon.length;
      if (batch.pokemon.length < 10 && cumulative !== initialPlannedCount) expect(batch).toBe(plan.batches.at(-1));
    }
  });

  it("copies real Singles ranks for newly appended forms without rewriting the original snapshot", () => {
    const sourceById = new Map(indexJson.pokemon.map((pokemon) => [pokemon.id, pokemon]));
    const latestUpdateIds = new Set(plan.updates?.at(-1)?.addedPokemonIds ?? []);
    const appended = planned.filter((pokemon) => latestUpdateIds.has(pokemon.pokemonId));
    expect(appended).toHaveLength(latestUpdateIds.size);
    for (const pokemon of appended) {
      const source = sourceById.get(pokemon.pokemonId)!;
      expect(pokemon.singlesRank).toBe(source.ranks.Singles);
      expect(pokemon.rankingStatus).toBe(source.ranks.Singles === null ? "unranked" : "ranked");
    }
    const firstUnranked = appended.findIndex((pokemon) => pokemon.rankingStatus === "unranked");
    if (firstUnranked >= 0) expect(appended.slice(firstUnranked).every((pokemon) => pokemon.rankingStatus === "unranked")).toBe(true);
  });

  it("derives not-started, partial, complete, and next batch from article IDs", () => {
    const first = plan.batches[0];
    const articlesBeforeBatch01 = plan.existingArticleIdsAtCreation;
    expect(getNextIncompletePokemonIntroBatch(plan, articlesBeforeBatch01)?.id).toBe(first.id);
    expect(getPokemonIntroBatchProgress(plan, articlesBeforeBatch01)[0].status).toBe("not-started");
    expect(getPokemonIntroBatchProgress(plan, [...articlesBeforeBatch01, first.pokemon[0].pokemonId])[0].status).toBe("partial");
    expect(getPokemonIntroBatchProgress(plan, currentArticleIds)[0].status).toBe("complete");
    expect(getPokemonIntroBatchProgress(plan, currentArticleIds).find((batch) => batch.id === "batch-02")?.status).toBe("complete");
    expect(getNextIncompletePokemonIntroBatch(plan, currentArticleIds)?.id).toBe("batch-03");
  });
});
