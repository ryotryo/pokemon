export type PokemonIntroPlanFormRelation = "base" | "mega" | "independent";
export type PokemonIntroPlanRankingStatus = "ranked" | "unranked";
export type PokemonIntroBatchStatus = "not-started" | "partial" | "complete";

export interface PokemonIntroPlanItem {
  pokemonId: string;
  displayNameJa: string;
  formRelation: PokemonIntroPlanFormRelation;
  singlesRank: number | null;
  rankingStatus: PokemonIntroPlanRankingStatus;
}

export interface PokemonIntroPlanBatch {
  id: string;
  pokemon: PokemonIntroPlanItem[];
}

export interface PokemonIntroProductionPlan {
  schemaVersion: 1;
  createdAt: string;
  source: {
    kind: "Poké Analytics Champions usage ranking index";
    path: "data/usage-ranking/index.json";
    season: string;
    seasonLabel: string;
    sourceUpdatedAt: string;
    publishedAt: string;
    sourceUrl: string;
    ordering: "Singles rank ascending; unranked last";
  };
  targetCountAtCreation: number;
  existingArticleIdsAtCreation: string[];
  updates?: Array<{
    sourceUpdatedAt: string;
    season: string;
    seasonLabel: string;
    currentTargetCount: number;
    addedPokemonIds: string[];
  }>;
  batches: PokemonIntroPlanBatch[];
}

export interface PokemonIntroBatchProgress {
  id: string;
  status: PokemonIntroBatchStatus;
  completed: number;
  total: number;
  remainingPokemonIds: string[];
}

export function getPokemonIntroBatchProgress(
  plan: PokemonIntroProductionPlan,
  currentArticleIds: Iterable<string>,
): PokemonIntroBatchProgress[] {
  const completedIds = new Set(currentArticleIds);
  return plan.batches.map((batch) => {
    const remainingPokemonIds = batch.pokemon
      .filter((pokemon) => !completedIds.has(pokemon.pokemonId))
      .map((pokemon) => pokemon.pokemonId);
    const completed = batch.pokemon.length - remainingPokemonIds.length;
    const status: PokemonIntroBatchStatus = completed === batch.pokemon.length
      ? "complete"
      : completed === 0 ? "not-started" : "partial";
    return { id: batch.id, status, completed, total: batch.pokemon.length, remainingPokemonIds };
  });
}

export function getNextIncompletePokemonIntroBatch(
  plan: PokemonIntroProductionPlan,
  currentArticleIds: Iterable<string>,
): PokemonIntroBatchProgress | null {
  return getPokemonIntroBatchProgress(plan, currentArticleIds).find((batch) => batch.status !== "complete") ?? null;
}
