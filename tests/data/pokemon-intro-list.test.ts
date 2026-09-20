import { describe, expect, it } from "vitest";
import { pokemonIntros } from "../../content/pokemon-intros";
import speedRanking from "../../data/champions/speed-ranking.json";
import usageIndex from "../../data/usage-ranking/index.json";
import {
  buildPokemonIntroListItems,
  filterAndSortPokemonIntros,
  parsePokemonIntroSort,
  parsePokemonIntroType,
} from "../../lib/champions/pokemon-intro-list";
import type { UsageRankingIndex } from "../../lib/champions/usage-ranking";

const index = usageIndex as UsageRankingIndex;
const items = buildPokemonIntroListItems(pokemonIntros, index.pokemon, speedRanking.pokemon);

describe("pokemon intro list", () => {
  it("resolves list metadata for every published article", () => {
    expect(items).toHaveLength(pokemonIntros.length);
    expect(items.every((item) => item.dexNumber > 0 && item.formOrder >= 0)).toBe(true);
    expect(items.every((item) => item.baseSpeed >= 0 && item.baseStatTotal > 0)).toBe(true);
  });

  it("uses national dex order with metadata form order by default", () => {
    const sorted = filterAndSortPokemonIntros(items, {});
    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      expect(previous.dexNumber < current.dexNumber ||
        (previous.dexNumber === current.dexNumber && previous.formOrder <= current.formOrder)).toBe(true);
    }
    expect(sorted.filter((item) => item.dexNumber === 6).map((item) => item.id)).toEqual([
      "charizard", "mega-charizard-x", "mega-charizard-y",
    ]);
  });

  it("sorts names using Japanese collation", () => {
    const sorted = filterAndSortPokemonIntros(items, { sort: "name" });
    const collator = new Intl.Collator("ja", { sensitivity: "base", numeric: true });
    expect(sorted.every((item, index) => !index || collator.compare(sorted[index - 1].displayNameJa, item.displayNameJa) <= 0)).toBe(true);
  });

  it.each(["singles", "doubles"] as const)("sorts %s ranks with unranked entries last", (sort) => {
    const format = sort === "singles" ? "Singles" : "Doubles";
    const sorted = filterAndSortPokemonIntros(items, { sort });
    const ranks = sorted.map((item) => item.ranks[format] ?? Number.POSITIVE_INFINITY);
    expect(ranks.every((rank, index) => !index || ranks[index - 1] <= rank)).toBe(true);
    const charizardForms = sorted.filter((item) => item.dexNumber === 6);
    expect(charizardForms.map((item) => item.id)).toEqual(["charizard", "mega-charizard-x", "mega-charizard-y"]);
    expect(new Set(charizardForms.map((item) => item.ranks[format])).size).toBe(1);
    const ranked = { ...items[0], id: "ranked", dexNumber: 10, formOrder: 0, ranks: { ...items[0].ranks, [format]: 1 } };
    const unrankedLater = { ...items[0], id: "unranked-later", dexNumber: 20, formOrder: 1, ranks: { ...items[0].ranks, [format]: null } };
    const unrankedFirst = { ...items[0], id: "unranked-first", dexNumber: 20, formOrder: 0, ranks: { ...items[0].ranks, [format]: null } };
    expect(filterAndSortPokemonIntros([unrankedLater, ranked, unrankedFirst], { sort }).map((item) => item.id)).toEqual([
      "ranked", "unranked-first", "unranked-later",
    ]);
  });

  it.each([["speed", "baseSpeed"], ["bst", "baseStatTotal"]] as const)("sorts %s descending", (sort, field) => {
    const sorted = filterAndSortPokemonIntros(items, { sort });
    expect(sorted.every((item, index) => !index || sorted[index - 1][field] >= item[field])).toBe(true);
  });

  it("searches hiragana, katakana, and form names", () => {
    expect(filterAndSortPokemonIntros(items, { query: "りざーどん" }).map((item) => item.id)).toContain("charizard");
    expect(filterAndSortPokemonIntros(items, { query: "リザードン" }).map((item) => item.id)).toContain("charizard");
    expect(filterAndSortPokemonIntros(items, { query: "めがりざーどんX" }).map((item) => item.id)).toEqual(["mega-charizard-x"]);
  });

  it("filters either slot of a dual type and combines all conditions", () => {
    expect(filterAndSortPokemonIntros(items, { type: "flying" }).map((item) => item.id)).toContain("charizard");
    const result = filterAndSortPokemonIntros(items, { query: "リザードン", type: "fire", sort: "speed" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.displayNameJa.includes("リザードン") && item.types.includes("fire"))).toBe(true);
    expect(result.every((item, index) => !index || result[index - 1].baseSpeed >= item.baseSpeed)).toBe(true);
  });

  it("falls back safely for invalid queries and supports an empty result", () => {
    expect(parsePokemonIntroSort("unknown")).toBe("dex");
    expect(parsePokemonIntroType("cosmic")).toBe("all");
    expect(filterAndSortPokemonIntros(items, { query: "存在しないポケモン名" })).toEqual([]);
  });

  it("keeps canonical form ids unique and unchanged", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    expect(items.map((item) => item.id)).toEqual(pokemonIntros.map((intro) => intro.pokemonId));
  });
});
