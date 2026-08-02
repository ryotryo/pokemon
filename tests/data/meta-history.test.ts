import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  initialMetaHistorySelection,
  latestRankBand,
  latestTopPokemon,
  rankSegments,
  topRankFallers,
  topRankRisers,
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

  it("builds latest-day groups and start-to-latest risers per format", () => {
    for (const format of ["Singles", "Doubles"] as const) {
      for (const startRank of [1, 11, 21] as const) {
        const band = latestRankBand(data, format, startRank);
        expect(band).toHaveLength(10);
        expect(band.map((pokemon) => pokemon.ranks[format].at(-1))).toEqual(Array.from({ length: 10 }, (_, index) => startRank + index));
      }
      for (const limit of [10, 20, 30] as const) {
        const latest = latestTopPokemon(data, format, limit);
        expect(latest).toHaveLength(limit);
        expect(latest.map((pokemon) => pokemon.ranks[format].at(-1))).toEqual(Array.from({ length: limit }, (_, index) => index + 1));
      }
      const risers = topRankRisers(data, format);
      expect(risers).toHaveLength(5);
      expect(risers.every((entry) => entry.startRank - entry.latestRank === entry.change && entry.change > 0)).toBe(true);
      expect(risers.every((entry) => entry.latestRank <= 30)).toBe(true);
      expect(risers).toEqual([...risers].sort((a, b) => b.change - a.change || a.latestRank - b.latestRank));

      const fallers = topRankFallers(data, format);
      expect(fallers).toHaveLength(5);
      expect(fallers.every((entry) => entry.latestRank - entry.startRank === entry.change && entry.change > 0)).toBe(true);
      expect(fallers.every((entry) => entry.latestRank <= 30)).toBe(true);
      expect(fallers).toEqual([...fallers].sort((a, b) => b.change - a.change || a.latestRank - b.latestRank));
    }
  });
});
