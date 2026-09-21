import { describe, expect, it } from "vitest";
import index from "../../data/usage-ranking/index.json";
import { CHAMPIONS_TYPES, getItemAssetUrl, getPokemonAssetUrl, getPokemonMiniAssetUrl, getTypeAssetUrl } from "../../lib/champions/assets";
import { getItemAssetName } from "../../lib/champions/item-assets";

describe("Champions game assets", () => {
  it("resolves all 18 type assets", () => {
    expect(CHAMPIONS_TYPES).toHaveLength(18);
    for (const type of CHAMPIONS_TYPES) expect(getTypeAssetUrl(type)).toMatch(new RegExp(`/types/${type[0].toUpperCase()}${type.slice(1)}\\.png$`));
  });

  it("uses metadata sprite filenames for normal, Mega, regional, gender and other forms", () => {
    const ids = ["garchomp", "mega-gallade", "alolan-raichu", "basculegion-female", "aegislash-shield-forme", "alcremie"];
    for (const id of ids) {
      const pokemon = index.pokemon.find((entry) => entry.id === id);
      expect(pokemon, id).toBeDefined();
      expect(getPokemonAssetUrl(pokemon?.sprite), id).toBe(pokemon?.sprite);
      expect(getPokemonMiniAssetUrl(pokemon?.sprite), id).toContain("/pokemon_mini/");
    }
    expect(getPokemonMiniAssetUrl(index.pokemon.find((entry) => entry.id === "mega-gallade")?.sprite)).not.toContain("Mega%20Mega");
  });

  it("resolves canonical item names with URL encoding", () => {
    expect(getItemAssetName("こだわりスカーフ")).toBe("Choice Scarf");
    expect(getItemAssetUrl(getItemAssetName("こだわりスカーフ"))).toBe("https://championsbattledata.com/pokemon_champions_assets/items/Choice%20Scarf.png");
    expect(getItemAssetUrl("King's Rock")).toContain("King's%20Rock.png");
  });

  it("returns null for unknown or unsafe assets", () => {
    expect(getTypeAssetUrl("unknown")).toBeNull();
    expect(getPokemonAssetUrl(null)).toBeNull();
    expect(getPokemonMiniAssetUrl(undefined)).toBeNull();
    expect(getItemAssetUrl(null)).toBeNull();
    expect(getItemAssetUrl("../secret")).toBeNull();
    expect(getItemAssetName("存在しない持ち物")).toBeNull();
  });
});
