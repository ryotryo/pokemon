import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  initialMetaHistorySelection,
  indexDisplayPokemonByBattleId,
  assembleMetaHistoryDataset,
  latestRankBand,
  latestTopPokemon,
  rankSegments,
  topRankFallers,
  topRankRisers,
  topThirtyCandidates,
  type MetaHistoryDataset,
  type MetaHistoryFormatDataset,
  type MetaHistorySeasonMetadata,
} from "../../lib/champions/meta-history";

const dataDirectory = path.join(process.cwd(), "data/meta-history/M4");
const metadata = JSON.parse(readFileSync(path.join(dataDirectory, "metadata.json"), "utf8")) as MetaHistorySeasonMetadata;
const singles = JSON.parse(readFileSync(path.join(dataDirectory, "singles.json"), "utf8")) as MetaHistoryFormatDataset;
const doubles = JSON.parse(readFileSync(path.join(dataDirectory, "doubles.json"), "utf8")) as MetaHistoryFormatDataset;
const data = assembleMetaHistoryDataset(metadata, singles, doubles) as MetaHistoryDataset;
const m5Directory = path.join(process.cwd(), "data/meta-history/M5");
const m5Metadata = JSON.parse(readFileSync(path.join(m5Directory, "metadata.json"), "utf8")) as MetaHistorySeasonMetadata;
const m5Singles = JSON.parse(readFileSync(path.join(m5Directory, "singles.json"), "utf8")) as MetaHistoryFormatDataset;
const m5Doubles = JSON.parse(readFileSync(path.join(m5Directory, "doubles.json"), "utf8")) as MetaHistoryFormatDataset;
const m5Data = assembleMetaHistoryDataset(m5Metadata, m5Singles, m5Doubles) as MetaHistoryDataset;

describe("M4 meta history", () => {
  it("keeps base display data while retaining standalone Mega battle IDs", () => {
    const indexed = indexDisplayPokemonByBattleId([
      { id: "gallade", battleId: "gallade", formRelation: "base" },
      { id: "mega-gallade", battleId: "gallade", formRelation: "mega" },
      { id: "mega-gallade", battleId: "gallademega", formRelation: "mega" },
    ]);
    expect(indexed.get("gallade")?.id).toBe("gallade");
    expect(indexed.get("gallademega")?.id).toBe("mega-gallade");
  });

  it("stores the complete observed daily period and unique Champions IDs", () => {
    expect(data.season).toBe("M4");
    expect(data.dates).toEqual([
      "2026-07-16", "2026-07-17", "2026-07-18", "2026-07-19", "2026-07-20",
      "2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24", "2026-07-25",
      "2026-07-26", "2026-07-27", "2026-07-28", "2026-07-29", "2026-07-30",
      "2026-08-04", "2026-08-18",
    ]);
    expect(new Set(data.pokemon.map((pokemon) => pokemon.showdownId)).size).toBe(data.pokemon.length);
    expect(data.pokemon.find((pokemon) => pokemon.showdownId === "garchomp")?.displayNameJa).toBe("ガブリアス");
    expect(data.pokemon.find((pokemon) => pokemon.showdownId === "rotomfan")?.displayNameJa).toBe("スピンロトム");
    expect(metadata).toMatchObject({
      season: "M4",
      startDate: "2026-07-16",
      endDate: "2026-08-18",
      days: 17,
    });
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

describe("M5 meta history", () => {
  it("stores M5 separately while preserving M4 dates", () => {
    expect(m5Data.dates).toEqual(["2026-08-18", "2026-08-21", "2026-08-22", "2026-08-24"]);
    expect(m5Metadata).toMatchObject({ season: "M5", startDate: "2026-08-18", endDate: "2026-08-24", days: 4 });
    expect(data.season).toBe("M4");
    expect(data.dates).toContain("2026-07-16");
    expect(data.dates).toContain("2026-08-18");
  });

  it("keeps complete unique M5 rankings for Singles and Doubles", () => {
    for (const format of ["Singles", "Doubles"] as const) {
      m5Data.dates.forEach((_, dateIndex) => {
        const ranks = m5Data.pokemon.map((pokemon) => pokemon.ranks[format][dateIndex]).filter((rank): rank is number => rank !== null);
        expect(new Set(ranks).size).toBe(ranks.length);
        expect(ranks).toEqual(expect.arrayContaining(Array.from({ length: 30 }, (_, index) => index + 1)));
      });
    }
  });
});
