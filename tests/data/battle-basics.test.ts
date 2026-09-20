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

  it("publishes 15 unique beginner articles in order", () => {
    expect(battleBasicsArticles.length).toBeGreaterThanOrEqual(15);
    expect(new Set(battleBasicsArticles.map((article) => article.slug)).size).toBe(battleBasicsArticles.length);
    expect(beginnerCourseArticles.map((article) => article.beginnerCourseOrder)).toEqual(Array.from({length:15},(_,index)=>index+1));
    expect(battleBasicsArticles.every((article) => article.sections.length >= 3 && article.sections.length <= 6)).toBe(true);
    expect(battleBasicsArticles.every((article) => article.sections.every((section) => section.paragraphs.length > 0))).toBe(true);
  });

  it("keeps the original beginner course separate from later category articles", () => {
    expect(beginnerCourseArticles).toHaveLength(15);
    expect(battleBasicsArticles).toHaveLength(45);
    expect(battleBasicsArticles.filter((article) => article.beginnerCourseOrder === undefined)).toHaveLength(30);
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
    expect(beginnerCourseArticles.at(-1)?.beginnerCourseOrder).toBe(15);
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
