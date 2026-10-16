import { describe, expect, it } from "vitest";
import { normalizePokemon } from "../../lib/champions/normalize";
import { normalizeSpeedRanking } from "../../lib/champions/speed-ranking";
import { canonicalPokemonId } from "../../lib/champions/pokemon-id";

describe("upstream form slug migration", () => {
  it("preserves article IDs across battle and speed datasets without merging Mega X/Y", () => {
    const forms = ["charizard", "charizard-mega-x", "charizard-mega-y"].map((slug, index) => ({
      slug, saved_name: slug, form_kind: ["Base", "Mega X", "Mega Y"][index],
      types: ["Fire"], image_path: `${slug}.png`, hp: 153, attack: 104,
      defense: 98, sp_attack: 129, sp_defense: 105, speed: 120,
    }));
    const entry = { slug: "charizard", summary: { primary: forms[0], forms } };
    const expected = ["charizard", "mega-charizard-x", "mega-charizard-y"];
    expect(normalizePokemon(entry, 1, { rows: [] }, {}, {}).forms.map((form) => form.id)).toEqual(expected);
    expect(normalizeSpeedRanking([entry], "Current", {}, "2026-10-15", "test").pokemon.map((pokemon) => pokemon.id).sort()).toEqual(expected.sort());
  });
  it("preserves independent forms and exceptional Floette and Meowstic learnset keys", () => {
    expect(canonicalPokemonId("raichu-alola")).toBe("alolan-raichu");
    expect(canonicalPokemonId("floette-eternal")).toBe("floette");
    expect(canonicalPokemonId("floette-mega")).toBe("mega-floette");
    expect(canonicalPokemonId("meowstic-m-mega")).toBe("mega-meowstic");
    expect(canonicalPokemonId("meowstic-f")).toBe("meowstic-female");
    expect(canonicalPokemonId("unknown-mega-x")).toBe("unknown-mega-x");
  });
});
