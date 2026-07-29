import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  initialMetaHistorySelection,
  rankSegments,
  topThirtyCandidates,
  type MetaHistoryDataset,
} from "../../lib/champions/meta-history";

const data = JSON.parse(
  readFileSync(path.join(process.cwd(), "data/meta-history/m4.json"), "utf8"),
) as MetaHistoryDataset;

describe("M4 meta history", () => {
  it("stores the complete observed daily period and unique Champions IDs", () => {
    expect(data.season).toBe("M4");
    expect(data.dates).toEqual([
      "2026-07-16", "2026-07-17", "2026-07-18", "2026-07-19", "2026-07-20",
      "2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24", "2026-07-25",
      "2026-07-26", "2026-07-27", "2026-07-28",
    ]);
    expect(new Set(data.pokemon.map((pokemon) => pokemon.showdownId)).size).toBe(data.pokemon.length);
    expect(data.pokemon.find((pokemon) => pokemon.showdownId === "garchomp")?.displayNameJa).toBe("ガブリアス");
    expect(data.pokemon.find((pokemon) => pokemon.showdownId === "rotomfan")?.displayNameJa).toBe("スピンロトム");
  });

  it("keeps complete unique rankings for Singles and Doubles", () => {
    for (const format of ["Singles", "Doubles"] as const) {
      data.dates.forEach((_, dateIndex) => {
        const ranks = data.pokemon.map((pokemon) => pokemon.ranks[format][dateIndex]).filter((rank): rank is number => rank !== null);
        expect(new Set(ranks).size).toBe(ranks.length);
        expect(ranks).toEqual(expect.arrayContaining(Array.from({ length: 30 }, (_, index) => index + 1)));
      });
    }
  });

  it("selects latest leaders initially and distinguishes gaps from out-of-range ranks", () => {
    for (const format of ["Singles", "Doubles"] as const) {
      const candidates = topThirtyCandidates(data, format);
      const initial = initialMetaHistorySelection(data, format);
      expect(initial).toHaveLength(10);
      expect(initial).toEqual(candidates.slice(0, 10).map((pokemon) => pokemon.showdownId));
      expect(candidates.every((pokemon) => pokemon.ranks[format].some((rank) => rank !== null && rank <= 30))).toBe(true);
    }
    expect(data.pokemon.some((pokemon) => pokemon.ranks.Singles.includes(null))).toBe(true);
    expect(data.pokemon.some((pokemon) => pokemon.ranks.Singles.some((rank) => rank !== null && rank > 30))).toBe(true);
    expect(rankSegments([1, 2, null, 32, 28])).toEqual([
      [{ index: 0, rank: 1 }, { index: 1, rank: 2 }],
      [{ index: 3, rank: 32 }, { index: 4, rank: 28 }],
    ]);
  });
});
