import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pokemonIntros } from "../content/pokemon-intros";
import type { UsageRankingIndex, UsageRankingPokemon } from "../lib/champions/usage-ranking";
import type {
  PokemonIntroPlanBatch,
  PokemonIntroPlanItem,
  PokemonIntroProductionPlan,
} from "../lib/pokemon-intro-production-plan";

const root = process.cwd();
const planPath = path.join(root, "data/pokemon-intro-production-plan.json");
const documentPath = path.join(root, "docs/pokemon-intro-production-plan.md");
const createdAt = "2026-09-13";

function compareCandidates(a: UsageRankingPokemon, b: UsageRankingPokemon): number {
  const rankDifference = (a.ranks.Singles ?? Number.MAX_SAFE_INTEGER) - (b.ranks.Singles ?? Number.MAX_SAFE_INTEGER);
  if (rankDifference !== 0) return rankDifference;
  const relationOrder = { base: 0, independent: 1, mega: 2 } as const;
  return relationOrder[a.formRelation] - relationOrder[b.formRelation]
    || a.displayNameJa.localeCompare(b.displayNameJa, "ja")
    || a.id.localeCompare(b.id);
}

function toPlanItem(pokemon: UsageRankingPokemon): PokemonIntroPlanItem {
  const singlesRank = pokemon.ranks.Singles;
  return {
    pokemonId: pokemon.id,
    displayNameJa: pokemon.displayNameJa,
    formRelation: pokemon.formRelation,
    singlesRank,
    rankingStatus: singlesRank === null ? "unranked" : "ranked",
  };
}

async function readExistingPlan(): Promise<PokemonIntroProductionPlan | null> {
  try {
    return JSON.parse(await readFile(planPath, "utf8")) as PokemonIntroProductionPlan;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

function appendInStableBatches(
  batches: PokemonIntroPlanBatch[],
  additions: PokemonIntroPlanItem[],
): PokemonIntroPlanBatch[] {
  const result = batches.map((batch) => ({ ...batch, pokemon: [...batch.pokemon] }));
  const queue = [...additions];
  while (queue.length) {
    const number = result.length + 1;
    result.push({ id: `batch-${String(number).padStart(2, "0")}`, pokemon: queue.splice(0, 10) });
  }
  return result;
}

function markdown(plan: PokemonIntroProductionPlan, currentArticleCount: number): string {
  const plannedCount = plan.batches.reduce((sum, batch) => sum + batch.pokemon.length, 0);
  const latestUpdate = plan.updates?.at(-1);
  const lines = [
    "# 「このポケモンってどんなポケモン？」制作計画",
    "",
    `- 計画作成日: ${plan.createdAt}`,
    `- 元データ: \`${plan.source.path}\`（${plan.source.seasonLabel} / ${plan.source.season}）`,
    `- 元データ更新日時: ${plan.source.sourceUpdatedAt}`,
    `- 記事対象総数（作成時点）: ${plan.targetCountAtCreation}`,
    `- 既存記事数（作成時点）: ${plan.existingArticleIdsAtCreation.length}`,
    `- 計画登録数（完成済みbatchを含む）: ${plannedCount}`,
    `- 現在の記事数: ${currentArticleCount}`,
    ...(latestUpdate ? [
      `- 最新追記元: ${latestUpdate.seasonLabel} / ${latestUpdate.season}（${latestUpdate.sourceUpdatedAt}）`,
      `- 最新Champions対象数: ${latestUpdate.currentTargetCount}`,
      `- 最新追記数: ${latestUpdate.addedPokemonIds.length}`,
    ] : []),
    `- batch数: ${plan.batches.length}`,
    "- 順序: Singles順位の昇順。順位なしはranked対象の後ろ。フォームID単位で扱う。",
    "- 進捗: `content/pokemon-intros.ts` に同じ `pokemonId` の記事があるかで判定する。",
    "",
  ];
  for (const batch of plan.batches) {
    lines.push(`## ${batch.id}`, "", "| ID | 日本語名 | フォーム区分 | Singles順位 | 区分 |", "|---|---|---|---:|---|");
    for (const pokemon of batch.pokemon) {
      lines.push(`| ${pokemon.pokemonId} | ${pokemon.displayNameJa} | ${pokemon.formRelation} | ${pokemon.singlesRank ?? "—"} | ${pokemon.rankingStatus} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  const index = JSON.parse(await readFile(path.join(root, "data/usage-ranking/index.json"), "utf8")) as UsageRankingIndex;
  const existingPlan = await readExistingPlan();
  const articleIds = new Set(pokemonIntros.map((intro) => intro.pokemonId));
  const alreadyPlannedIds = new Set(existingPlan?.batches.flatMap((batch) => batch.pokemon.map((pokemon) => pokemon.pokemonId)) ?? []);
  const additions = index.pokemon
    .filter((pokemon) => !articleIds.has(pokemon.id) && !alreadyPlannedIds.has(pokemon.id))
    .sort(compareCandidates)
    .map(toPlanItem);
  const batches = appendInStableBatches(existingPlan?.batches ?? [], additions);
  const initialPlannedCount = existingPlan
    ? existingPlan.targetCountAtCreation - existingPlan.existingArticleIdsAtCreation.length
    : 0;
  const alreadyRecordedUpdateIds = new Set(existingPlan?.updates?.flatMap((update) => update.addedPokemonIds) ?? []);
  const unrecordedExtensionIds = batches.flatMap((batch) => batch.pokemon).slice(initialPlannedCount)
    .map((pokemon) => pokemon.pokemonId).filter((id) => !alreadyRecordedUpdateIds.has(id));
  const sourceAlreadyRecorded = existingPlan?.source.sourceUpdatedAt === index.sourceUpdatedAt
    || existingPlan?.updates?.some((update) => update.sourceUpdatedAt === index.sourceUpdatedAt);
  const updates = existingPlan && !sourceAlreadyRecorded
    ? [...(existingPlan.updates ?? []), {
        sourceUpdatedAt: index.sourceUpdatedAt,
        season: index.season,
        seasonLabel: index.seasonLabel,
        currentTargetCount: index.pokemon.length,
        addedPokemonIds: unrecordedExtensionIds,
      }]
    : existingPlan?.updates;
  const plan: PokemonIntroProductionPlan = existingPlan
    ? { ...existingPlan, ...(updates ? { updates } : {}), batches }
    : {
        schemaVersion: 1,
        createdAt,
        source: {
          kind: "Poké Analytics Champions usage ranking index",
          path: "data/usage-ranking/index.json",
          season: index.season,
          seasonLabel: index.seasonLabel,
          sourceUpdatedAt: index.sourceUpdatedAt,
          publishedAt: index.publishedAt,
          sourceUrl: index.source,
          ordering: "Singles rank ascending; unranked last",
        },
        targetCountAtCreation: index.pokemon.length,
        existingArticleIdsAtCreation: [...articleIds],
        batches,
      };
  await mkdir(path.dirname(documentPath), { recursive: true });
  await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`);
  await writeFile(documentPath, markdown(plan, articleIds.size));
  console.log(`[pokemon-intro-plan] targets=${plan.targetCountAtCreation} existing=${plan.existingArticleIdsAtCreation.length} planned=${plan.batches.flatMap((batch) => batch.pokemon).length} batches=${plan.batches.length} additions=${additions.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
