import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import indexJson from "../../data/usage-ranking/index.json";
import speedJson from "../../data/champions/speed-ranking.json";
import movesJson from "../../data/usage-ranking/moves.json";
import { pokemonIntroById, pokemonIntros } from "../../content/pokemon-intros";
import { formatMoveAccuracy, formatMovePower, resolvePokemonIntroMoves } from "../../lib/champions/pokemon-intro-moves";
import type { UsageMoveDetail } from "../../lib/champions/usage-ranking";

describe("pokemon intros", () => {
  const batch01Ids = [
    "mega-garchomp", "meowscarada", "archaludon", "mimikyu", "gyarados",
    "mega-gyarados", "delphox", "mega-dragonite", "metagross", "mega-metagross",
  ];
  const batch02Ids = [
    "charizard", "mega-charizard-x", "mega-charizard-y", "basculegion-male", "scizor",
    "mega-scizor", "raichu", "mega-raichu-x", "mega-raichu-y", "hydreigon",
  ];
  const batch03Ids = [
    "gengar", "mega-gengar", "glimmora", "mega-glimmora", "greninja",
    "mega-greninja", "kingambit", "blaziken", "mega-blaziken", "aegislash-shield-forme",
  ];
  const ids = new Set(indexJson.pokemon.map((pokemon) => pokemon.id));
  const statIds = new Set(speedJson.pokemon.map((pokemon) => pokemon.id));
  const moves = movesJson as Record<string, UsageMoveDetail>;
  it("contains forty unique articles including every completed batch-01 through batch-03 form", () => {
    expect(pokemonIntros).toHaveLength(40);
    expect(new Set(pokemonIntros.map((intro) => intro.pokemonId)).size).toBe(40);
    expect(pokemonIntros.some((intro) => intro.pokemonId === "mega-delphox")).toBe(true);
    for (const id of batch01Ids) {
      expect(pokemonIntroById.get(id)?.pokemonId).toBe(id);
      expect(`/pokemon-intro/${id}/`).toMatch(/^\/pokemon-intro\/[a-z0-9-]+\/$/);
    }
    for (const id of batch02Ids) {
      expect(pokemonIntroById.get(id)?.pokemonId).toBe(id);
      expect(`/pokemon-intro/${id}/`).toMatch(/^\/pokemon-intro\/[a-z0-9-]+\/$/);
    }
    for (const id of batch03Ids) {
      expect(pokemonIntroById.get(id)?.pokemonId).toBe(id);
      expect(`/pokemon-intro/${id}/`).toMatch(/^\/pokemon-intro\/[a-z0-9-]+\/$/);
    }
  });
  it("uses the exact current Champions forms, types, stats, and abilities for batch-02", () => {
    const expected = {
      charizard: { types: ["fire", "flying"], stats: [78, 84, 78, 109, 85, 100], abilities: ["もうか", "サンパワー"] },
      "mega-charizard-x": { types: ["fire", "dragon"], stats: [78, 130, 111, 130, 85, 100], abilities: ["かたいツメ"] },
      "mega-charizard-y": { types: ["fire", "flying"], stats: [78, 104, 78, 159, 115, 100], abilities: ["ひでり"] },
      "basculegion-male": { types: ["water", "ghost"], stats: [120, 112, 65, 80, 75, 78], abilities: ["てきおうりょく", "すいすい", "かたやぶり"] },
      scizor: { types: ["bug", "steel"], stats: [70, 130, 100, 55, 80, 65], abilities: ["テクニシャン", "ライトメタル", "むしのしらせ"] },
      "mega-scizor": { types: ["bug", "steel"], stats: [70, 150, 140, 65, 100, 75], abilities: ["テクニシャン"] },
      raichu: { types: ["electric"], stats: [60, 90, 55, 90, 80, 110], abilities: ["ひらいしん", "せいでんき"] },
      "mega-raichu-x": { types: ["electric"], stats: [60, 135, 95, 90, 95, 110], abilities: ["エレキメイカー"] },
      "mega-raichu-y": { types: ["electric"], stats: [60, 100, 55, 160, 80, 130], abilities: ["ノーガード"] },
      hydreigon: { types: ["dark", "dragon"], stats: [92, 105, 90, 125, 90, 98], abilities: ["ふゆう"] },
    } as const;
    for (const [id, facts] of Object.entries(expected)) {
      const indexEntry = indexJson.pokemon.find((pokemon) => pokemon.id === id)!;
      const statEntry = speedJson.pokemon.find((pokemon) => pokemon.id === id)!;
      const detail = JSON.parse(readFileSync(`data/usage-ranking/details/${id}.json`, "utf8")) as { formats: { Singles: { abilities: { nameJa: string }[] } } };
      expect(indexEntry.types, id).toEqual(facts.types);
      expect(Object.values(statEntry.baseStats), id).toEqual(facts.stats);
      expect(detail.formats.Singles.abilities.map((ability) => ability.nameJa), id).toEqual(facts.abilities);
    }
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
  it("keeps completed batch articles free of season-specific production data", () => {
    const forbidden = /M\d+|採用率|使用率|現在\d+位|現在の環境|努力値|性格テンプレ|持ち物ランキング/;
    for (const id of [...batch01Ids, ...batch02Ids, ...batch03Ids]) expect(JSON.stringify(pokemonIntroById.get(id)), id).not.toMatch(forbidden);
  });
});
