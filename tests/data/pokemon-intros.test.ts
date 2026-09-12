import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import indexJson from "../../data/usage-ranking/index.json";
import speedJson from "../../data/champions/speed-ranking.json";
import movesJson from "../../data/usage-ranking/moves.json";
import { pokemonIntros } from "../../content/pokemon-intros";
import { formatMoveAccuracy, formatMovePower, resolvePokemonIntroMoves } from "../../lib/champions/pokemon-intro-moves";
import type { UsageMoveDetail } from "../../lib/champions/usage-ranking";

describe("pokemon intros", () => {
  const ids = new Set(indexJson.pokemon.map((pokemon) => pokemon.id));
  const statIds = new Set(speedJson.pokemon.map((pokemon) => pokemon.id));
  const moves = movesJson as Record<string, UsageMoveDetail>;
  it("contains exactly ten unique articles including Mega Delphox", () => {
    expect(pokemonIntros).toHaveLength(10);
    expect(new Set(pokemonIntros.map((intro) => intro.pokemonId)).size).toBe(10);
    expect(pokemonIntros.some((intro) => intro.pokemonId === "mega-delphox")).toBe(true);
  });
  it("uses Pokemon and stats present in current Champions data", () => {
    for (const intro of pokemonIntros) { expect(ids.has(intro.pokemonId)).toBe(true); expect(statIds.has(intro.pokemonId)).toBe(true); }
  });
  it("resolves every featured move from current metadata with a Japanese description", () => {
    for (const intro of pokemonIntros) {
      const resolved = resolvePokemonIntroMoves(intro.featuredMoves, moves);
      expect(resolved, intro.pokemonId).toHaveLength(intro.featuredMoves.length);
      for (const { move, purpose } of resolved) {
        expect(move.type).toBeTruthy();
        expect(move.descriptionJa, `${intro.pokemonId}: ${move.nameJa}`).toBeTruthy();
        expect(purpose).toBeTruthy();
      }
    }
  });
  it("formats move values consistently, including moves without power or accuracy", () => {
    expect(formatMovePower(moves["53"])).toBe("90");
    expect(formatMoveAccuracy(moves["53"])).toBe("100");
    expect(formatMovePower(moves["417"])).toBe("—");
    expect(formatMoveAccuracy(moves["417"])).toBe("—");
  });
  it("references each base or Mega form's own Champions learnset", () => {
    for (const intro of pokemonIntros) {
      const detail = JSON.parse(readFileSync(`data/usage-ranking/details/${intro.pokemonId}.json`, "utf8")) as { learnableMoveIds: string[] };
      for (const featured of intro.featuredMoves) expect(detail.learnableMoveIds, `${intro.pokemonId}: ${featured.moveId}`).toContain(featured.moveId);
    }
  });
  it("has complete beginner-facing sections", () => {
    for (const intro of pokemonIntros) { expect(intro.overview.length).toBeGreaterThanOrEqual(2); expect(intro.strengths.length).toBeGreaterThanOrEqual(2); expect(intro.featuredMoves.length).toBeGreaterThanOrEqual(3); expect(intro.weaknesses.length).toBeGreaterThanOrEqual(2); }
  });
});
