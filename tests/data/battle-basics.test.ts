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

  it("explains practical odd and even HP breakpoints", () => {
    const hpArticle = JSON.stringify(battleBasicsArticleBySlug.get("hp-odd-even"));
    for (const phrase of ["みがわりを4回", "ステルスロック", "通常のどく", "やけど", "砂嵐", "いのちのたま", "はらだいこ", "オボンのみ", "ゴーストタイプが使うのろい", "たべのこし"]) {
      expect(hpArticle).toContain(phrase);
    }
    expect(hpArticle).toContain("HP200");
    expect(hpArticle).toContain("HP201");
    expect(hpArticle).toContain("4の倍数を避ける");
  });

  it("keeps diagram topics understandable in article text alone", () => {
    const requiredText: Record<string, string[]> = {
      "type-matchups": ["2倍", "1/2倍", "0倍"],
      "same-type-attack-bonus": ["1.5倍", "弱点とは別のしくみ"],
      "move-categories": ["攻撃 ↔ 防御", "特攻 ↔ 特防", "補助や妨害"],
      stats: ["AとBは物理", "CとDは特殊", "素早さ"],
      "speed-and-turn-order": ["同じ優先度", "素早さが高い"],
      "stat-stages": ["0段階", "1倍", "3/2倍", "2/3倍"],
      matchups: ["タイプ相性、素早さ、残りHP"],
      "damage-basics": ["使う技の威力と分類", "タイプ一致とタイプ相性", "最後に幅を作る乱数"],
      "ko-terms": ["残りHPが100", "確1", "確2", "乱1"],
      "speed-ties": ["同じ優先度・同じ素早さ", "ランダム"],
      "move-priority": ["最初に技の優先度", "同じ優先度の中で素早さ"],
      "trick-room": ["同じ優先度", "素早さが低い"],
      weather: ["晴れ・雨・砂嵐・雪", "上書き"],
      sun: ["炎は1.5倍、水は半分", "ほのおタイプの技のダメージが1.5倍"],
      rain: ["水は1.5倍、炎は半分", "みずタイプの技のダメージが1.5倍"],
      sandstorm: ["最大HPの1/16", "岩タイプの特防が1.5倍"],
      snow: ["こおりタイプのポケモンの防御が1.5倍", "毎ターンダメージは与えません"],
      "stealth-rock": ["最大HPの1/8", "いわ弱点なら1/4", "4倍弱点なら1/2"],
      "hp-odd-even": ["みがわりを4回", "はらだいこ", "ゴーストタイプが使うのろい"],
      "substitute-hp": ["最大HPの1/4", "4回目"],
      "leftovers-recovery": ["最大HPの1/16", "最大HP160なら10"],
      cycle: ["不利な相手から交代", "攻撃を受けやすい味方"],
      "setup-fodder": ["相手の隙", "積み技や場作り"],
      "move-consistency": ["相手の残っているポケモン全体", "無効や大きな半減"],
    };

    for (const [slug, phrases] of Object.entries(requiredText)) {
      const articleText = JSON.stringify(battleBasicsArticleBySlug.get(slug));
      for (const phrase of phrases) expect(articleText, `${slug}: ${phrase}`).toContain(phrase);
    }
  });

  it("does not ship the retired concept-diagram UI", () => {
    expect(existsSync("features/battle-basics/components/concept-diagram.tsx")).toBe(false);
    const articleSource = readFileSync("features/battle-basics/components/battle-basics-article.tsx", "utf8");
    expect(articleSource).not.toContain("ConceptDiagram");
    expect(articleSource).not.toContain("図で見る");
    expect(battleBasicsArticles.every((article) => !("diagram" in article))).toBe(true);
  });

  it("resolves related articles and tool routes", () => {
    const validRoutes = new Set(["/party-check/","/speed-ranking/","/usage-ranking/","/damage-chart/","/move-search/","/pokemon-intro/","/pokemon-roles/","/type-chart/"]);
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
    for (const route of ["party-check","speed-ranking","usage-ranking","damage-chart","move-search","pokemon-intro","pokemon-roles","type-chart"]) expect(urls).toContain(`https://poke-analytics.com/${route}/`);
  });

  it("links the new content from the home page", () => {
    const home = readFileSync("app/page.tsx","utf8");
    expect(home).toContain("ポケモン対戦の基礎");
    expect(home).toContain("/battle-basics/");
  });
});
