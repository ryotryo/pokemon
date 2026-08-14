import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SpeedRankingDataset } from "./speed-ranking";
import type { UsageMoveDetail, UsagePokemonDetail, UsageRankingIndex } from "./usage-ranking";
import {
  isSupportedDamageMove,
  type DamageChartDataset,
  type DamageChartMove,
} from "./damage-chart";

function moveSlug(name: string) {
  return name.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function getDamageChartDataset(): Promise<DamageChartDataset> {
  const root = process.cwd();
  const [indexRaw, movesRaw, coverageRaw, speedRaw, metadataRaw] = await Promise.all([
    readFile(path.join(root, "data/usage-ranking/index.json"), "utf8"),
    readFile(path.join(root, "data/usage-ranking/moves.json"), "utf8"),
    readFile(path.join(root, "data/moves/move-master.json"), "utf8"),
    readFile(path.join(root, "data/champions/speed-ranking.json"), "utf8"),
    readFile(path.join(root, "data/metadata.json"), "utf8"),
  ]);
  const index = JSON.parse(indexRaw) as UsageRankingIndex;
  const moves = JSON.parse(movesRaw) as Record<string, UsageMoveDetail>;
  const coverage = JSON.parse(coverageRaw) as Record<string, { isCoverageMove?: boolean }>;
  const speed = JSON.parse(speedRaw) as SpeedRankingDataset;
  const metadata = JSON.parse(metadataRaw) as { updatedAt: string };
  const statsById = new Map(speed.pokemon.map((pokemon) => [pokemon.id, pokemon.baseStats]));

  const pokemon = (await Promise.all(index.pokemon.map(async (entry) => {
    const baseStats = statsById.get(entry.id);
    if (!baseStats) return null;
    let detail: UsagePokemonDetail;
    try {
      detail = JSON.parse(await readFile(path.join(root, "data/usage-ranking/details", `${entry.id}.json`), "utf8")) as UsagePokemonDetail;
    } catch {
      return null;
    }
    const formatMoves = (format: "Singles" | "Doubles"): DamageChartMove[] => detail.formats[format].moves
      .slice(0, 10)
      .flatMap((row) => {
        const move = moves[row.moveId];
        if (!move) return [];
        const isCoverageMove = coverage[moveSlug(move.nameEn)]?.isCoverageMove === true;
        if (!isSupportedDamageMove(move, isCoverageMove)) return [];
        return [{
          id: move.id,
          nameJa: move.nameJa,
          type: move.type,
          damageClass: move.damageClass,
          power: move.power,
          usage: row.percentageValue,
          rank: row.rank,
        }];
      });
    const formatAbilities = (format: "Singles" | "Doubles") => detail.formats[format].abilities.map((ability) => ({
      nameJa: ability.nameJa,
      descriptionJa: ability.descriptionJa,
    }));
    return {
      id: entry.id,
      displayNameJa: entry.displayNameJa,
      types: entry.types,
      sprite: entry.sprite,
      baseStats,
      ranks: entry.ranks,
      moves: { Singles: formatMoves("Singles"), Doubles: formatMoves("Doubles") },
      abilities: { Singles: formatAbilities("Singles"), Doubles: formatAbilities("Doubles") },
    };
  }))).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return {
    season: index.season,
    seasonLabel: index.seasonLabel,
    updatedAt: metadata.updatedAt,
    pokemon,
  };
}
