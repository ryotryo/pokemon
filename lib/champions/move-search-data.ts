import { readFile } from "node:fs/promises";
import path from "node:path";
import type { MoveSearchDataset, MoveSearchPokemon } from "./move-search";
import type { UsageMoveDetail, UsagePokemonDetail, UsageRankingIndex } from "./usage-ranking";

const DATA_ROOT = path.join(process.cwd(), "data/usage-ranking");

export async function getMoveSearchDataset(): Promise<MoveSearchDataset> {
  const [indexRaw, movesRaw] = await Promise.all([
    readFile(path.join(DATA_ROOT, "index.json"), "utf8"),
    readFile(path.join(DATA_ROOT, "moves.json"), "utf8"),
  ]);
  const index = JSON.parse(indexRaw) as UsageRankingIndex;
  const movesById = JSON.parse(movesRaw) as Record<string, UsageMoveDetail>;
  const details = await Promise.all(index.pokemon.map(async (entry) => {
    const raw = await readFile(path.join(DATA_ROOT, "details", `${entry.id}.json`), "utf8");
    return JSON.parse(raw) as UsagePokemonDetail;
  }));
  const learnsets = new Map(details.map((detail) => [detail.id, detail.learnableMoveIds]));
  const learnableMoveIds = new Set(details.flatMap((detail) => detail.learnableMoveIds));
  const pokemon: MoveSearchPokemon[] = index.pokemon.map((entry) => ({
    ...entry,
    learnableMoveIds: learnsets.get(entry.id) ?? [],
  }));

  return {
    seasonLabel: index.seasonLabel.replace(/^M-?(\d+)$/i, "M-$1"),
    updatedAt: index.sourceUpdatedAt,
    moves: Object.values(movesById).filter((move) => learnableMoveIds.has(move.id)),
    pokemon,
  };
}
