import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteIcon, siteIconDrawings, siteIconNames } from "../../components/ui/site-icon";
import { battleBasicsArticles, battleBasicsCategories } from "../../content/battle-basics";

describe("site icon system", () => {
  it("keeps icon IDs unique and backed by one drawing registry", () => {
    expect(new Set(siteIconNames).size).toBe(siteIconNames.length);
    expect(siteIconNames).toEqual(Object.keys(siteIconDrawings));
  });

  it("renders lightweight decorative SVG with shared geometry rules", () => {
    const markup = renderToStaticMarkup(createElement(SiteIcon, { name: "weather-rain", className: "size-6" }));
    expect(markup).toContain('viewBox="0 0 24 24"');
    expect(markup).toContain('stroke="currentColor"');
    expect(markup).toContain('stroke-width="1.8"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain("<text");
  });

  it("assigns a valid icon to every battle basics category", () => {
    expect(battleBasicsCategories).toHaveLength(8);
    expect(battleBasicsCategories.every((category) => siteIconNames.includes(category.icon))).toBe(true);
  });

  it("assigns a valid icon to every published battle basics article", () => {
    expect(battleBasicsArticles).toHaveLength(45);
    expect(battleBasicsArticles.every((article) => siteIconNames.includes(article.icon))).toBe(true);
    expect(new Set(battleBasicsArticles.map((article) => article.icon)).size).toBeGreaterThanOrEqual(35);
  });
});
