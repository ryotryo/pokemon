import { describe, expect, it, vi } from "vitest";
import moves from "../../data/usage-ranking/moves.json";
import { getDamageChartDataset } from "../../lib/champions/damage-chart-data";

// A valid usage snapshot can omit Reversal entirely, while the move catalog retains it.
vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(async (filename: string) => {
    const entry = {
      id: "abomasnow", displayNameJa: "ユキノオー", formRelation: "base",
      types: ["grass", "ice"], sprite: "", ranks: { Singles: 1, Doubles: 1 },
    };
    const format = { moves: [{ moveId: "1", rank: 1, percentageValue: 100 }], abilities: [] };
    const fixtures: Record<string, unknown> = {
      "usage-ranking/index.json": { season: "Current", seasonLabel: "M7", pokemon: [entry] },
      "usage-ranking/moves.json": moves,
      "usage-ranking/contact-moves.json": ["1", "179"],
      "champions/speed-ranking.json": { pokemon: [{ id: entry.id, baseStats: {
        hp: 90, attack: 92, defense: 75, specialAttack: 92, specialDefense: 85, speed: 60,
      } }] },
      "metadata.json": { updatedAt: "2026-10-31T00:00:00.000Z" },
      "usage-ranking/details/abomasnow.json": { ...entry, formats: { Singles: format, Doubles: format } },
    };
    const key = String(filename).split("/data/")[1];
    if (!(key in fixtures)) throw new Error(`Unexpected fixture request: ${filename}`);
    return JSON.stringify(fixtures[key]);
  }),
}));

describe("damage chart usage snapshots", () => {
  it("accepts falling move counts and Reversal leaving all usage TOP10 lists", async () => {
    const dataset = await getDamageChartDataset();
    expect(moves["179"].nameJa).toBe("きしかいせい");
    expect(dataset.pokemon).toHaveLength(1);
    for (const format of ["Singles", "Doubles"] as const) {
      expect(dataset.pokemon[0].moves[format].map((move) => move.id)).toEqual(["1"]);
    }
  });
});
