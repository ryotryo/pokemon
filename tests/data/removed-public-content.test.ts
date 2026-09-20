import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { pokemonIntros } from "../../content/pokemon-intros";

function sourceFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root).flatMap((name) => {
    const file = path.join(root, name);
    return statSync(file).isDirectory() ? sourceFiles(file) : /\.(ts|tsx)$/.test(file) ? [file] : [];
  });
}

describe("removed public content", () => {
  it("does not ship the retired pokemon-guide routes or internal links", () => {
    expect(existsSync("app/pokemon-guide")).toBe(false);
    expect(existsSync("content/pokemon-guides.ts")).toBe(false);
    expect(existsSync("content/pokemon-guide-research.ts")).toBe(false);
    const publicSources = ["app", "components", "features", "content", "lib"]
      .flatMap(sourceFiles)
      .map((file) => readFileSync(file, "utf8"));
    expect(publicSources.some((source) => source.includes("/pokemon-guide"))).toBe(false);
  });

  it("does not render the retired guide or public roadmap on the home page", () => {
    const home = readFileSync("app/page.tsx", "utf8");
    expect(home).not.toContain("ポケモン使い方解説");
    expect(home).not.toContain("今後追加予定");
    expect(home).not.toContain("準備中");
    expect(home).not.toContain("技分析");
  });

  it("keeps the current pokemon-intro catalog", () => {
    expect(existsSync("app/pokemon-intro/page.tsx")).toBe(true);
    expect(existsSync("app/pokemon-intro/[pokemon]/page.tsx")).toBe(true);
    expect(pokemonIntros).toHaveLength(341);
  });
});
