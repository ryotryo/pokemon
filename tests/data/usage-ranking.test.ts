import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  filterAndSortUsageMoves,
  formatPercentage,
  parseFormat,
  parsePoint,
  sortRankingPokemon,
  type UsageMoveDetail,
  type UsagePokemonDetail,
  type UsageRankingIndex,
} from "../../lib/champions/usage-ranking";
import { getUsagePokemonPageData } from "../../lib/champions/usage-ranking-data";

const root = process.cwd();
const index = JSON.parse(readFileSync(path.join(root, "data/usage-ranking/index.json"), "utf8")) as UsageRankingIndex;
const moves = JSON.parse(readFileSync(path.join(root, "data/usage-ranking/moves.json"), "utf8")) as Record<string, UsageMoveDetail>;
const detail = (id: string) => JSON.parse(readFileSync(path.join(root, `data/usage-ranking/details/${id}.json`), "utf8")) as UsagePokemonDetail;

describe("usage ranking data", () => {
  it("keeps query format and missing percentages safe", () => {
    expect(parseFormat("doubles")).toBe("Doubles");
    expect(parseFormat(undefined)).toBe("Singles");
    expect(formatPercentage(null)).toBe("—");
    expect(parsePoint("32")).toBe(32);
    expect(parsePoint("")).toBeNull();
  });

  it("contains unique Champions forms and sorts by API rank", () => {
    expect(index.pokemon).toHaveLength(310);
    expect(new Set(index.pokemon.map((pokemon) => pokemon.id)).size).toBe(310);
    expect(index.pokemon.find((pokemon) => pokemon.id === "alolan-raichu")?.battleId).toBe("raichualola");
    expect(index.pokemon.find((pokemon) => pokemon.id === "mega-charizard-x")?.formRelation).toBe("mega");
    expect(index.pokemon.find((pokemon) => pokemon.id === "rotom-wash")?.displayNameJa).toBe("ウォッシュロトム");
    const sorted = sortRankingPokemon(index.pokemon, "Singles");
    expect(sorted[0].ranks.Singles).toBeLessThanOrEqual(sorted[1].ranks.Singles!);
  });

  it("keeps only non-mega forms in the public usage ranking", () => {
    const publicPokemon = index.pokemon.filter((pokemon) => pokemon.formRelation !== "mega");
    expect(publicPokemon.some((pokemon) => pokemon.formRelation === "mega")).toBe(false);
    expect(publicPokemon.some((pokemon) => pokemon.id === "alolan-raichu")).toBe(true);
    expect(publicPokemon.some((pokemon) => pokemon.id === "rotom-wash")).toBe(true);
  });

  it("moves mega base stats to the base-form detail and rejects mega detail pages", async () => {
    const garchomp = await getUsagePokemonPageData("garchomp");
    const charizard = await getUsagePokemonPageData("charizard");
    expect(garchomp?.megaForms.map((form) => form.displayNameJa)).toEqual(["メガガブリアス"]);
    expect(garchomp?.baseStats.speed).toBe(102);
    expect(garchomp?.megaForms[0].baseStats.attack).toBe(170);
    expect(garchomp?.megaForms[0].types).toEqual(["dragon", "ground"]);
    expect(garchomp?.megaForms[0].sprite).toContain("Mega%20Garchomp.png");
    expect(charizard?.megaForms.map((form) => form.displayNameJa)).toEqual(["メガリザードンX", "メガリザードンY"]);
    expect(await getUsagePokemonPageData("mega-garchomp")).toBeNull();
  });

  it("uses format-specific top tens and complete ranking categories", () => {
    const garchomp = detail("garchomp");
    expect(garchomp.formats.Singles.moves).toHaveLength(10);
    expect(garchomp.formats.Singles.items).toHaveLength(10);
    expect(garchomp.formats.Singles.spreads.length).toBeGreaterThan(0);
    expect(garchomp.formats.Singles.natures).toHaveLength(10);
    expect(garchomp.formats.Singles.abilities.map((ability) => ({ rank: ability.rank, nameJa: ability.nameJa, percentageValue: ability.percentageValue }))).toEqual([
      { rank: 1, nameJa: "さめはだ", percentageValue: 99 },
      { rank: 2, nameJa: "すながくれ", percentageValue: 1 },
    ]);
    expect(garchomp.formats.Singles.abilities[0].descriptionJa).toContain("接触技");
    expect(detail("alakazam").formats.Singles.abilities[0].nameJa).toBe("マジックガード");
    expect(detail("alakazam").formats.Doubles.abilities[0].nameJa).toBe("せいしんりょく");
    expect(garchomp.formats.Singles.teammates).toHaveLength(10);
    expect(moves[garchomp.formats.Singles.moves[0].moveId].nameJa).toBe("じしん");
    expect(moves[garchomp.formats.Doubles.moves[0].moveId].nameJa).toBe("ドラゴンクロー");
  });

  it("uses champout form learnsets without adding unrelated moves", () => {
    const garchomp = detail("garchomp");
    const earthquake = Object.values(moves).find((move) => move.nameJa === "じしん")!;
    const tackle = Object.values(moves).find((move) => move.nameJa === "たいあたり")!;
    expect(garchomp.learnableMoveIds).toContain(earthquake.id);
    expect(garchomp.learnableMoveIds).not.toContain(tackle.id);
    expect(detail("alolan-raichu").learnableMoveIds.length).toBeGreaterThan(50);
    expect(detail("mega-charizard-x").learnableMoveIds.length).toBeGreaterThan(50);
    expect(detail("rotom-wash").learnableMoveIds.length).toBeGreaterThan(30);
  });

  it("stores Japanese move descriptions with Champions data taking priority", () => {
    const airSlash = Object.values(moves).find((move) => move.nameJa === "エアスラッシュ")!;
    const magicalLeaf = Object.values(moves).find((move) => move.nameJa === "マジカルリーフ")!;
    expect(airSlash.descriptionJa).toContain("ひるませる");
    expect(airSlash.descriptionSource).toBe("champout");
    expect(magicalLeaf.descriptionJa).toBeTruthy();
    expect(magicalLeaf.descriptionSource).toBe("pokeapi");
  });

  it("filters and sorts learnable moves by Japanese name, type, class, power, and PP", () => {
    const sample = Object.values(moves).filter((move) => ["じしん", "まもる", "れいとうビーム"].includes(move.nameJa));
    expect(filterAndSortUsageMoves(sample, { query: "れいとう", type: "all", damageClass: "all", sort: "name" }).map((move) => move.nameJa)).toEqual(["れいとうビーム"]);
    expect(filterAndSortUsageMoves(sample, { query: "", type: "ground", damageClass: "physical", sort: "name" }).map((move) => move.nameJa)).toEqual(["じしん"]);
    expect(filterAndSortUsageMoves(sample, { query: "", type: "all", damageClass: "status", sort: "pp" }).map((move) => move.nameJa)).toEqual(["まもる"]);
    expect(filterAndSortUsageMoves(sample, { query: "", type: "all", damageClass: "all", sort: "power" })[0].power).toBe(100);
    expect(filterAndSortUsageMoves(sample, { query: "", type: "all", damageClass: "all", sort: "type" }).map((move) => move.nameJa)).toEqual(["まもる", "れいとうビーム", "じしん"]);
  });

  it("keeps teammate links resolvable and images present", () => {
    const ids = new Set(index.pokemon.map((pokemon) => pokemon.id));
    for (const id of ["garchomp", "alolan-raichu", "mega-charizard-x", "rotom-wash"]) {
      const pokemon = detail(id);
      expect(pokemon.sprite).toMatch(/^https:\/\/championsbattledata\.com\//);
      for (const format of ["Singles", "Doubles"] as const) {
        pokemon.formats[format].teammates.forEach((teammate) => expect(ids.has(teammate.pokemonId)).toBe(true));
      }
    }
  });
});
