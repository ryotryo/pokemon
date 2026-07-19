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
      sourceGeneratedAt: "2026-07-18T20:24:17.168Z",
      dailyDataPeriod: { start: "2026-07-16", end: "2026-07-18" },
    });
  });

  it("keeps working when period fields are unavailable", () => {
    expect(getSeasonDisplayMetadata({ defaultSeason: "M3" })).toEqual({ seasonLabel: "M3" });
  });
});
