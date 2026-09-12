import { describe, expect, it } from "vitest";
import indexJson from "../../data/usage-ranking/index.json";
import speedJson from "../../data/champions/speed-ranking.json";
import movesJson from "../../data/usage-ranking/moves.json";
import { pokemonIntros } from "../../content/pokemon-intros";

describe("pokemon intros", () => {
  const ids = new Set(indexJson.pokemon.map((pokemon) => pokemon.id));
  const statIds = new Set(speedJson.pokemon.map((pokemon) => pokemon.id));
  const moveNames = new Set(Object.values(movesJson).map((move) => move.nameJa));
  it("contains exactly ten unique articles including Mega Delphox", () => {
    expect(pokemonIntros).toHaveLength(10);
    expect(new Set(pokemonIntros.map((intro) => intro.pokemonId)).size).toBe(10);
    expect(pokemonIntros.some((intro) => intro.pokemonId === "mega-delphox")).toBe(true);
  });
  it("uses Pokemon and stats present in current Champions data", () => {
    for (const intro of pokemonIntros) { expect(ids.has(intro.pokemonId)).toBe(true); expect(statIds.has(intro.pokemonId)).toBe(true); }
  });
  it("only features moves present in the current move data", () => {
    for (const intro of pokemonIntros) for (const move of intro.featuredMoves) expect(moveNames.has(move.name), `${intro.pokemonId}: ${move.name}`).toBe(true);
  });
  it("has complete beginner-facing sections", () => {
    for (const intro of pokemonIntros) { expect(intro.overview.length).toBeGreaterThanOrEqual(2); expect(intro.strengths.length).toBeGreaterThanOrEqual(2); expect(intro.featuredMoves.length).toBeGreaterThanOrEqual(3); expect(intro.weaknesses.length).toBeGreaterThanOrEqual(2); }
  });
});
