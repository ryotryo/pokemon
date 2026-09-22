import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "../../app/sitemap";

describe("type chart page", () => {
  it("publishes the chart route with metadata and sitemap entry", () => {
    expect(existsSync("app/type-chart/page.tsx")).toBe(true);
    const page = readFileSync("app/type-chart/page.tsx", "utf8");
    expect(page).toContain("https://poke-analytics.com/type-chart/");
    expect(page).toContain("TypeChartTable");
    expect(page).toContain("DualTypeChecker");
    expect(sitemap().map((entry) => entry.url)).toContain("https://poke-analytics.com/type-chart/");
  });

  it("is linked from home and related content", () => {
    for (const file of ["app/page.tsx", "app/pokemon-intro/page.tsx", "features/party-check/components/party-check-page.tsx", "content/battle-basics.ts"]) {
      expect(readFileSync(file, "utf8"), file).toContain("/type-chart/");
    }
  });

  it("keeps horizontal scrolling on the table wrapper", () => {
    const table = readFileSync("features/type-chart/components/type-chart-table.tsx", "utf8");
    expect(table).toContain('data-testid="type-chart-scroll"');
    expect(table).toContain("overflow-x-auto");
    expect(table).toContain("sticky left-0");
    expect(table).toContain("sticky top-0");
  });
});
