import { describe, expect, it } from "vitest";
import { latestNumberedSeason } from "../../lib/champions/seasons";

describe("numbered Champions seasons", () => {
  it("selects M5 without replacing or discarding M4", () => {
    const seasons = ["M4", "M5"];
    expect(latestNumberedSeason(seasons)).toBe("M5");
    expect(seasons).toContain("M4");
  });

  it("sorts numerically and ignores Current or unrelated folders", () => {
    expect(latestNumberedSeason(["Current", "M9", "M10", "archive"])).toBe("M10");
  });
});
