import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import index from "../../data/usage-ranking/index.json";
import { CHAMPIONS_TYPES, getItemAssetUrl, getPokemonAssetUrl, getPokemonMiniAssetUrl, getTypeAssetUrl } from "../../lib/champions/assets";
import { getItemAssetName } from "../../lib/champions/item-assets";
import { TypeBadge } from "../../components/ui/type-badge";

describe("Champions game assets", () => {
  it("resolves all 18 type assets", () => {
    expect(CHAMPIONS_TYPES).toHaveLength(18);
    for (const type of CHAMPIONS_TYPES) expect(getTypeAssetUrl(type)).toMatch(new RegExp(`/types/${type[0].toUpperCase()}${type.slice(1)}\\.png$`));
  });

  it("normalizes internal, English canonical and Japanese type names", () => {
    const fire = "https://championsbattledata.com/pokemon_champions_assets/types/Fire.png";
    expect(getTypeAssetUrl("fire")).toBe(fire);
    expect(getTypeAssetUrl("Fire")).toBe(fire);
    expect(getTypeAssetUrl("ほのお")).toBe(fire);
  });

  it("renders shared type images and keeps text for fallback and accessibility", () => {
    const dualType = renderToStaticMarkup(createElement("div", null,
      createElement(TypeBadge, { type: "water" }), createElement(TypeBadge, { type: "fairy" }),
    ));
    expect(dualType).toContain("/types/Water.png");
    expect(dualType).toContain("/types/Fairy.png");
    expect(dualType).toContain("みず");
    expect(dualType).toContain("フェアリー");
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

  it("routes public type UI through the shared TypeBadge", () => {
    const typeUiFiles = [
      "features/usage-ranking/components/usage-ranking.tsx",
      "features/usage-ranking/components/usage-detail.tsx",
      "features/usage-ranking/components/move-detail-sheet.tsx",
      "features/party-check/components/party-checker.tsx",
      "features/damage-chart/components/damage-chart.tsx",
      "features/move-search/components/move-search.tsx",
      "features/pokemon-intro/components/pokemon-intro-list.tsx",
      "features/pokemon-intro/components/pokemon-intro-article.tsx",
      "features/battle-basics/components/battle-basics-asset-examples.tsx",
      "features/type-chart/components/type-chart-table.tsx",
      "features/type-chart/components/dual-type-checker.tsx",
    ];
    for (const file of typeUiFiles) expect(readFileSync(file, "utf8"), file).toContain("TypeBadge");
  });
});
