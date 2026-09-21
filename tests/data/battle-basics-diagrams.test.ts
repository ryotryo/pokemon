import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { battleBasicsArticles } from "../../content/battle-basics";
import { battleBasicsDiagramNames, ConceptDiagram, HpBar } from "../../features/battle-basics/components/concept-diagram";

describe("battle basics concept diagrams", () => {
  it("uses only valid diagram IDs and covers the priority visual topics", () => {
    const illustrated = battleBasicsArticles.filter((article) => article.diagram);
    expect(illustrated).toHaveLength(24);
    expect(illustrated.every((article) => battleBasicsDiagramNames.includes(article.diagram!))).toBe(true);
    for (const slug of ["type-matchups","stat-stages","speed-and-turn-order","weather","stealth-rock","hp-odd-even","cycle"]) {
      expect(battleBasicsArticles.find((article) => article.slug === slug)?.diagram).toBeTruthy();
    }
  });

  it("renders accurate HP bar widths without exceeding the range", () => {
    const half = renderToStaticMarkup(createElement(HpBar, { current: 100, max: 200 }));
    const over = renderToStaticMarkup(createElement(HpBar, { current: 250, max: 200 }));
    expect(half).toContain("width:50%");
    expect(over).toContain("width:100%");
  });

  it("renders captions and textual labels instead of color-only meaning", () => {
    const weather = renderToStaticMarkup(createElement(ConceptDiagram, { name: "weather" }));
    expect(weather).toContain("晴れ");
    expect(weather).toContain("雨");
    expect(weather).toContain("砂嵐");
    expect(weather).toContain("雪");
    expect(weather).toContain("figcaption");
  });
});
