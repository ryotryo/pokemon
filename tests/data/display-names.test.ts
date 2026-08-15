import { describe, expect, it } from "vitest";
import singles from "../../data/champions/singles.json";
import doubles from "../../data/champions/doubles.json";
import names from "../../data/i18n/pokemon-names-ja.json";
import { getPokemonDisplayNameJa, normalizePokemonSearchText, TYPE_NAMES_JA } from "../../lib/champions/display-names";

describe("Japanese display names", () => {
  it("covers every current TOP30 form", () => {
    const missing = [...singles.pokemon, ...doubles.pokemon].flatMap((pokemon) => pokemon.forms).filter((form) => !(form.id in names)).map((form) => form.id);
    expect(missing).toEqual([]);
  });
  it("keeps internal ids separate from display names", () => expect(getPokemonDisplayNameJa("mega-charizard-x", "Mega Charizard X")).toBe("メガリザードンX"));
  it.each([
    ["がぶりあす", "ガブリアス"],
    ["めたぐろす", "メタグロス"],
    ["りざーどん", "リザードン"],
    ["Mega-Charizard-X", "mega-charizard-x"],
  ])("normalizes search text %s", (input, expected) => expect(normalizePokemonSearchText(input)).toBe(expected));
  it("covers all 18 battle types", () => expect(Object.keys(TYPE_NAMES_JA)).toHaveLength(18));
  it("contains every current Champions record in ranking order", () => {
    for (const dataset of [singles, doubles]) {
      expect(dataset.pokemon.length).toBeGreaterThan(30);
      expect(dataset.pokemon.map((pokemon) => pokemon.rank)).toEqual([...dataset.pokemon.map((pokemon) => pokemon.rank)].sort((a, b) => a - b));
    }
  });
});
