import { describe, expect, it } from "vitest";
import { getSeasonDisplayMetadata } from "../../lib/champions/season-metadata";

describe("season display metadata", () => {
  it("resolves Current to its Champions season and daily snapshot range", () => {
    expect(getSeasonDisplayMetadata({
      defaultSeason: "Current",
      battleDataFolders: ["M4"],
      dailyDataFolders: ["M4/18_07_2026", "M4/16_07_2026", "M4/17_07_2026"],
      generatedAt: "2026-07-18T20:24:17.168Z",
    })).toEqual({
      seasonLabel: "M4",
      seasonPeriod: { start: "2026-07-08", end: "2026-08-05" },
      sourceGeneratedAt: "2026-07-18T20:24:17.168Z",
      dailyDataPeriod: { start: "2026-07-16", end: "2026-07-18" },
    });
  });

  it("keeps working when period fields are unavailable", () => {
    expect(getSeasonDisplayMetadata({ defaultSeason: "M3" })).toEqual({ seasonLabel: "M3" });
  });

  it("recognizes M5 without inventing an official season period", () => {
    expect(getSeasonDisplayMetadata({
      defaultSeason: "Current",
      battleDataFolders: ["M5", "M4"],
      dailyDataFolders: ["M5/24_08_2026", "M5/18_08_2026", "M4/18_08_2026"],
    })).toEqual({
      seasonLabel: "M5",
      dailyDataPeriod: { start: "2026-08-18", end: "2026-08-24" },
    });
  });
});
