import { readFile } from "node:fs/promises";
import path from "node:path";
import type { UsageMoveDetail, UsagePokemonDetail, UsagePokemonPageData } from "./usage-ranking";
import type { SpeedRankingDataset } from "./speed-ranking";
import type { UsageRankingIndex } from "./usage-ranking";

const DATA_ROOT = path.join(process.cwd(), "data/usage-ranking");

export async function getUsagePokemonPageData(id: string): Promise<UsagePokemonPageData | null> {
  try {
    const [detailRaw, movesRaw, indexRaw, speedRaw] = await Promise.all([
      readFile(path.join(DATA_ROOT, "details", `${id}.json`), "utf8"),
      readFile(path.join(DATA_ROOT, "moves.json"), "utf8"),
      readFile(path.join(DATA_ROOT, "index.json"), "utf8"),
      readFile(path.join(process.cwd(), "data/champions/speed-ranking.json"), "utf8"),
    ]);
    const detail = JSON.parse(detailRaw) as UsagePokemonDetail;
    const moves = JSON.parse(movesRaw) as Record<string, UsageMoveDetail>;
    const index = JSON.parse(indexRaw) as UsageRankingIndex;
    const speed = JSON.parse(speedRaw) as SpeedRankingDataset;
    const indexEntry = index.pokemon.find((pokemon) => pokemon.id === id);
    if (!indexEntry || indexEntry.formRelation === "mega") return null;
    const speedById = new Map(speed.pokemon.map((pokemon) => [pokemon.id, pokemon]));
    const baseStats = speedById.get(id)?.baseStats;
    if (!baseStats) return null;
    const megaForms = index.pokemon
      .filter((pokemon) => pokemon.formRelation === "mega" && pokemon.battleId === detail.battleId)
      .flatMap((pokemon) => {
        const stats = speedById.get(pokemon.id)?.baseStats;
        return stats ? [{ id: pokemon.id, displayNameJa: pokemon.displayNameJa, sprite: pokemon.sprite, types: pokemon.types, baseStats: stats }] : [];
      });
    return {
      ...detail,
      learnableMoves: detail.learnableMoveIds.flatMap((moveId) => moves[moveId] ? [moves[moveId]] : []),
      baseStats,
      megaForms,
    };
  } catch {
    return null;
  }
}
