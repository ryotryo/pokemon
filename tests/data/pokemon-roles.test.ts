import { describe, expect, it } from "vitest";
import { pokemonIntros } from "../../content/pokemon-intros";
import { pokemonRoleById, pokemonRoleDefinitions, roleGroups } from "../../content/pokemon-roles";

import usageIndex from "../../data/usage-ranking/index.json";
import { getPokemonForRole } from "../../lib/champions/pokemon-role-list";
import type { UsageRankingPokemon } from "../../lib/champions/usage-ranking";

describe("pokemon roles", () => {
  it("defines unique role and group IDs", () => {
    expect(new Set(pokemonRoleDefinitions.map((role) => role.id)).size).toBe(pokemonRoleDefinitions.length);
    expect(new Set(roleGroups.map((group) => group.id)).size).toBe(roleGroups.length);
  });
  it("keeps every role in a known group", () => {
    const groupIds = new Set(roleGroups.map((group) => group.id));
    for (const role of pokemonRoleDefinitions) expect(groupIds.has(role.group)).toBe(true);
  });
  it("resolves every role on all 341 current-form articles", () => {
    expect(pokemonIntros).toHaveLength(341);
    for (const intro of pokemonIntros) {
      expect(intro.roles.length).toBeGreaterThan(0);
      for (const roleId of intro.roles) expect(pokemonRoleById.has(roleId), `${intro.pokemonId}: ${roleId}`).toBe(true);
    }
  });
  it("derives matching articles from role IDs", () => {
    for (const role of pokemonRoleDefinitions) {
      const articles = pokemonIntros.filter((intro) => intro.roles.includes(role.id));
      for (const article of articles) expect(article.roles).toContain(role.id);
    }
    expect(pokemonIntros.filter((intro) => intro.roles.includes("setup-sweeper")).length).toBeGreaterThan(5);
  });
  it("provides stable article tag anchors", () => {
    for (const intro of pokemonIntros) for (const roleId of intro.roles) expect(`/pokemon-roles/#role-${roleId}`).toMatch(/^\/pokemon-roles\/#role-[a-z-]+$/);
  });
});


const rankingPokemon = usageIndex.pokemon as UsageRankingPokemon[];

describe("role usage lists", () => {
  it("caps every current role at ten matching forms in both formats", () => {
    for (const format of ["Singles", "Doubles"] as const) for (const role of pokemonRoleDefinitions) {
      const result = getPokemonForRole(role.id, pokemonIntros, rankingPokemon, format);
      const matchingIds = new Set(pokemonIntros.filter((intro) => intro.roles.includes(role.id)).map((intro) => intro.pokemonId));
      const all = rankingPokemon.filter((entry) => matchingIds.has(entry.id));
      expect(result.total).toBe(all.length);
      expect(result.entries).toHaveLength(Math.min(10, all.length));
      expect(new Set(result.entries.map((entry) => entry.id)).size).toBe(result.entries.length);
      const cutoff = result.entries.at(-1)?.ranks[format] ?? Infinity;
      const shown = new Set(result.entries.map((entry) => entry.id));
      for (const entry of all.filter((entry) => !shown.has(entry.id))) expect(entry.ranks[format] ?? Infinity).toBeGreaterThanOrEqual(cutoff);
      for (let i = 0; i < result.entries.length; i++) {
        expect(matchingIds.has(result.entries[i].id)).toBe(true);
        if (i) expect(result.entries[i].ranks[format] ?? Infinity).toBeGreaterThanOrEqual(result.entries[i - 1].ranks[format] ?? Infinity);
      }
    }
  });
  it("uses the selected format and keeps unranked entries last", () => {
    const pokemon = rankingPokemon.slice(0, 3).map((entry, i) => ({ ...entry, ranks: { Singles: [20, 1, null][i], Doubles: [1, null, 2][i] } }));
    const intros = pokemon.map((entry) => ({ pokemonId: entry.id, roles: ["physical-attacker"] as const }));
    expect(getPokemonForRole("physical-attacker", intros, pokemon, "Singles").entries.map((entry) => entry.id)).toEqual([pokemon[1].id, pokemon[0].id, pokemon[2].id]);
    expect(getPokemonForRole("physical-attacker", intros, pokemon, "Doubles").entries.map((entry) => entry.id)).toEqual([pokemon[0].id, pokemon[2].id, pokemon[1].id]);
  });
  it("keeps equal-ranked forms stable without merging their roles", () => {
    const pokemon = rankingPokemon.slice(0, 2).map((entry) => ({ ...entry, ranks: { Singles: 1, Doubles: 1 } }));
    const intros = pokemon.map((entry) => ({ pokemonId: entry.id, roles: ["physical-attacker"] as const }));
    expect(getPokemonForRole("physical-attacker", intros, [...pokemon].reverse(), "Singles").entries.map((entry) => entry.id)).toEqual(pokemon.map((entry) => entry.id));
    expect(getPokemonForRole("physical-attacker", intros.slice(1), pokemon, "Singles").entries.map((entry) => entry.id)).toEqual([pokemon[1].id]);
  });
  it("does not count articles outside the current dataset", () => {
    const intros = [{ pokemonId: "retired-form", roles: ["physical-attacker"] as const }];
    expect(getPokemonForRole("physical-attacker", intros, rankingPokemon, "Singles")).toEqual({ entries: [], total: 0 });
  });
});
