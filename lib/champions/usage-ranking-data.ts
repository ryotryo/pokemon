import { readFile } from "node:fs/promises";
import path from "node:path";
import type { UsageMoveDetail, UsagePokemonDetail, UsagePokemonPageData } from "./usage-ranking";

const DATA_ROOT = path.join(process.cwd(), "data/usage-ranking");

export async function getUsagePokemonPageData(id: string): Promise<UsagePokemonPageData | null> {
  try {
    const [detailRaw, movesRaw] = await Promise.all([
      readFile(path.join(DATA_ROOT, "details", `${id}.json`), "utf8"),
      readFile(path.join(DATA_ROOT, "moves.json"), "utf8"),
    ]);
    const detail = JSON.parse(detailRaw) as UsagePokemonDetail;
    const moves = JSON.parse(movesRaw) as Record<string, UsageMoveDetail>;
    return {
      ...detail,
      learnableMoves: detail.learnableMoveIds.flatMap((moveId) => moves[moveId] ? [moves[moveId]] : []),
    };
  } catch {
    return null;
  }
}

