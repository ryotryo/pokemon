import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "../../app/sitemap";
import { battleBasicsArticleBySlug, battleBasicsArticles, battleBasicsCategories, battleBasicsTools, beginnerCourseArticles } from "../../content/battle-basics";

describe("battle basics", () => {
  it("defines eight ordered categories and resolves every article category", () => {
    expect(battleBasicsCategories).toHaveLength(8);
    expect(battleBasicsCategories.map((category) => category.order)).toEqual([1,2,3,4,5,6,7,8]);
    const categoryIds = new Set(battleBasicsCategories.map((category) => category.id));
    expect(battleBasicsArticles.every((article) => categoryIds.has(article.categoryId))).toBe(true);
  });

  it("publishes 45 unique beginner articles in order", () => {
    expect(battleBasicsArticles.length).toBeGreaterThanOrEqual(15);
    expect(new Set(battleBasicsArticles.map((article) => article.slug)).size).toBe(battleBasicsArticles.length);
    expect(beginnerCourseArticles.map((article) => article.beginnerCourseOrder)).toEqual(Array.from({length:45},(_,index)=>index+1));
    expect(battleBasicsArticles.every((article) => article.sections.length >= 3 && article.sections.length <= 6)).toBe(true);
    expect(battleBasicsArticles.every((article) => article.sections.every((section) => section.paragraphs.length > 0))).toBe(true);
  });

  it("adds the second-wave articles to the numbered course", () => {
    expect(beginnerCourseArticles).toHaveLength(45);
    expect(battleBasicsArticles).toHaveLength(45);
    expect(battleBasicsArticles.filter((article) => article.beginnerCourseOrder === undefined)).toHaveLength(0);
    expect(battleBasicsArticleBySlug.get("damage-basics")?.beginnerCourseOrder).toBe(16);
    expect(battleBasicsArticleBySlug.get("move-consistency")?.beginnerCourseOrder).toBe(45);
  });

  it("contains all 30 second-wave slugs and expected category totals", () => {
    const secondWave = ["damage-basics","type-effectiveness-damage","four-times-weakness","critical-hits","damage-randomness","ko-terms","move-power","speed-ties","move-priority","priority-moves","speed-changes","trick-room","burn","paralysis","poison-and-bad-poison","sleep","setup-moves","weather","sun","rain","sandstorm","snow","terrain","stealth-rock","hp-odd-even","substitute-hp","leftovers-recovery","cycle","setup-fodder","move-consistency"];
    expect(secondWave).toHaveLength(30);
    expect(secondWave.every((slug) => battleBasicsArticleBySlug.has(slug))).toBe(true);
    expect(Object.fromEntries(battleBasicsCategories.map((category) => [category.id, battleBasicsArticles.filter((article) => article.categoryId === category.id).length]))).toEqual({
      "getting-started": 5, damage: 8, speed: 6, status: 7, field: 7, numbers: 3, strategy: 6, terms: 3,
    });
  });

  it("uses Pokémon Champions status-condition rules", () => {
    const paralysis = JSON.stringify(battleBasicsArticleBySlug.get("paralysis"));
    const sleep = JSON.stringify(battleBasicsArticleBySlug.get("sleep"));
    const overview = JSON.stringify(battleBasicsArticleBySlug.get("status-conditions"));
    expect(paralysis).toContain("12.5%");
    expect(paralysis).toContain("1/2");
    expect(paralysis).not.toContain("25%で技を出せない");
    expect(sleep).toContain("2回目は1/3");
    expect(sleep).toContain("3回目は必ず起きる");
    expect(overview).toContain("技を使う時に25%で回復");
    expect(overview).toContain("3回目は必ず回復");
  });

  it("resolves related articles and tool routes", () => {
    const validRoutes = new Set(["/party-check/","/speed-ranking/","/usage-ranking/","/damage-chart/","/move-search/","/pokemon-intro/","/pokemon-roles/"]);
    for (const article of battleBasicsArticles) {
      expect(article.relatedArticleSlugs.every((slug) => battleBasicsArticleBySlug.has(slug))).toBe(true);
      expect(article.relatedTools.every((toolId) => validRoutes.has(battleBasicsTools[toolId].href))).toBe(true);
    }
  });

  it("has shared list and detail routes with metadata generation", () => {
    expect(existsSync("app/battle-basics/page.tsx")).toBe(true);
    expect(existsSync("app/battle-basics/[slug]/page.tsx")).toBe(true);
    const routeSource = readFileSync("app/battle-basics/[slug]/page.tsx","utf8");
    expect(routeSource).toContain("generateStaticParams");
    expect(routeSource).toContain("generateMetadata");
    expect(routeSource).toContain("https://poke-analytics.com/battle-basics/${slug}/");
  });

  it("renders previous and next course navigation from shared data", () => {
    const articleSource = readFileSync("features/battle-basics/components/battle-basics-article.tsx","utf8");
    expect(articleSource).toContain("← 前の記事");
    expect(articleSource).toContain("次の記事 →");
    expect(beginnerCourseArticles[0].beginnerCourseOrder).toBe(1);
    expect(beginnerCourseArticles.at(-1)?.beginnerCourseOrder).toBe(45);
  });

  it("adds all articles to the sitemap and keeps existing main routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const article of battleBasicsArticles) expect(urls).toContain(`https://poke-analytics.com/battle-basics/${article.slug}/`);
    for (const route of ["party-check","speed-ranking","usage-ranking","damage-chart","move-search","pokemon-intro","pokemon-roles"]) expect(urls).toContain(`https://poke-analytics.com/${route}/`);
  });

  it("links the new content from the home page", () => {
    const home = readFileSync("app/page.tsx","utf8");
    expect(home).toContain("ポケモン対戦の基礎");
    expect(home).toContain("/battle-basics/");
  });
});
