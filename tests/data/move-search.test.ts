import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { filterAndSortMoveSearch, getMoveLearners } from "../../lib/champions/move-search";
import { getMoveSearchDataset } from "../../lib/champions/move-search-data";
import type { UsageMoveDetail } from "../../lib/champions/usage-ranking";

const moves = Object.values(JSON.parse(readFileSync(path.join(process.cwd(), "data/usage-ranking/moves.json"), "utf8")) as Record<string, UsageMoveDetail>);

describe("move search", () => {
  it("searches Japanese move names with hiragana and katakana input", () => {
    expect(filterAndSortMoveSearch(moves, "じしん", "name").map((move) => move.nameJa)).toContain("じしん");
    expect(filterAndSortMoveSearch(moves, "リュウセイグン", "name").map((move) => move.nameJa)).toContain("りゅうせいぐん");
  });

  it("uses standard type order and Japanese name order inside each type", () => {
    const sample = moves.filter((move) => ["かえんほうしゃ", "オーバーヒート", "じしん", "まもる"].includes(move.nameJa));
    const sorted = filterAndSortMoveSearch(sample, "", "type");
    expect(sorted.map((move) => move.type)).toEqual(["normal", "fire", "fire", "ground"]);
    expect(sorted.filter((move) => move.type === "fire").map((move) => move.nameJa)).toEqual(
      [...sorted.filter((move) => move.type === "fire").map((move) => move.nameJa)].sort((a, b) => a.localeCompare(b, "ja")),
    );
  });

  it("builds a Champions learnset reverse lookup without merging forms", async () => {
    const dataset = await getMoveSearchDataset();
    const earthquake = dataset.moves.find((move) => move.nameJa === "じしん")!;
    const learners = getMoveLearners(dataset.pokemon, earthquake.id, "Singles");
    expect(dataset.pokemon).toHaveLength(310);
    expect(dataset.moves).toHaveLength(561);
    expect(new Set(dataset.pokemon.map((pokemon) => pokemon.id)).size).toBe(310);
    expect(dataset.moves.every((move) => dataset.pokemon.some((pokemon) => pokemon.learnableMoveIds.includes(move.id)))).toBe(true);
    expect(learners.some((pokemon) => pokemon.id === "garchomp")).toBe(true);
    expect(learners.some((pokemon) => pokemon.id === "mega-garchomp")).toBe(true);
    expect(learners[0].ranks.Singles).toBeLessThanOrEqual(learners[1].ranks.Singles!);
  });

  it("puts unranked learners after ranked learners without inventing a rank", () => {
    const sample = [
      { id: "unranked", displayNameJa: "ア", ranks: { Singles: null, Doubles: null } },
      { id: "second", displayNameJa: "イ", ranks: { Singles: 2, Doubles: 3 } },
      { id: "first", displayNameJa: "ウ", ranks: { Singles: 1, Doubles: 4 } },
    ].map((entry) => ({ ...entry, battleId: entry.id, formRelation: "base" as const, types: ["normal"], sprite: "", usagePercentages: { Singles: null, Doubles: null }, learnableMoveIds: ["1"] }));
    expect(getMoveLearners(sample, "1", "Singles").map((pokemon) => pokemon.ranks.Singles)).toEqual([1, 2, null]);
  });
});
