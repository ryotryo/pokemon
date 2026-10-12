import { readFileSync } from "node:fs";
import type { UsagePokemonDetail } from "../../lib/champions/usage-ranking";
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
      const candidates = rankingPokemon.filter((entry) => matchingIds.has(entry.id));
      const megaIds = new Set(candidates.filter((entry) => entry.formRelation === "mega").map((entry) => entry.battleId));
      const all = candidates.filter((entry) => entry.formRelation !== "base" || !megaIds.has(entry.battleId));
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
    const pokemon = rankingPokemon.filter((entry) => entry.formRelation === "base").slice(0, 3).map((entry, i) => ({ ...entry, ranks: { Singles: [20, 1, null][i], Doubles: [1, null, 2][i] } }));
    const intros = pokemon.map((entry) => ({ pokemonId: entry.id, roles: ["physical-attacker"] as const }));
    expect(getPokemonForRole("physical-attacker", intros, pokemon, "Singles").entries.map((entry) => entry.id)).toEqual([pokemon[1].id, pokemon[0].id, pokemon[2].id]);
    expect(getPokemonForRole("physical-attacker", intros, pokemon, "Doubles").entries.map((entry) => entry.id)).toEqual([pokemon[0].id, pokemon[2].id, pokemon[1].id]);
  });
  it("prefers Mega within the role while retaining base-only roles", () => {
    const pokemon = rankingPokemon.slice(0, 2).map((entry) => ({ ...entry, ranks: { Singles: 1, Doubles: 1 } }));
    const intros = pokemon.map((entry) => ({ pokemonId: entry.id, roles: ["physical-attacker"] as const }));
    expect(getPokemonForRole("physical-attacker", intros, [...pokemon].reverse(), "Singles").entries.map((entry) => entry.id)).toEqual([pokemon[1].id]);
    expect(getPokemonForRole("physical-attacker", intros.slice(1), pokemon, "Singles").entries.map((entry) => entry.id)).toEqual([pokemon[1].id]);
    expect(getPokemonForRole("physical-attacker", intros.slice(0, 1), pokemon, "Singles").entries.map((entry) => entry.id)).toEqual([pokemon[0].id]);
  });
  it("does not count articles outside the current dataset", () => {
    const intros = [{ pokemonId: "retired-form", roles: ["physical-attacker"] as const }];
    expect(getPokemonForRole("physical-attacker", intros, rankingPokemon, "Singles")).toEqual({ entries: [], total: 0 });
  });
});


describe("Mega role slots", () => {
  it("refills the ten slots after removing base forms", () => {
    const pokemon = rankingPokemon.filter((entry) => entry.formRelation === "base").slice(0, 11).map((entry, i) => ({ ...entry, ranks: { Singles: i + 1, Doubles: 11 - i } }));
    const mega = { ...pokemon[0], id: "fixture-mega", formRelation: "mega" as const, formOrder: 1 };
    const all = [...pokemon, mega];
    const intros = all.map((entry) => ({ pokemonId: entry.id, roles: ["physical-attacker"] as const }));
    const result = getPokemonForRole("physical-attacker", intros, all, "Singles");
    expect(result.total).toBe(11);
    expect(result.entries.map((entry) => entry.id)).toEqual([mega.id, ...pokemon.slice(1, 10).map((entry) => entry.id)]);
  });
  it("keeps distinct Mega variants and independent forms", () => {
    const charizard = rankingPokemon.filter((entry) => entry.battleId === "charizard");
    const independent = { ...charizard[0], id: "fixture-independent", formRelation: "independent" as const };
    const all = [...charizard, independent];
    const intros = all.map((entry) => ({ pokemonId: entry.id, roles: ["special-attacker"] as const }));
    expect(getPokemonForRole("special-attacker", intros, all, "Singles").entries.map((entry) => entry.id)).toEqual([independent.id, "mega-charizard-x", "mega-charizard-y"]);
  });
  it("excludes normal Charizard from the current special attacker list", () => {
    for (const format of ["Singles", "Doubles"] as const) {
      const result = getPokemonForRole("special-attacker", pokemonIntros, rankingPokemon, format);
      expect(result.entries.map((entry) => entry.id)).not.toContain("charizard");
      expect(result.entries).toHaveLength(10);
    }
  });
});


const roleMechanics = {
  "offensive-pivot": { moves: ["369", "521", "812", "857"] },
  "relay-support": { moves: ["226", "880"] },
  "trick-room": { moves: ["433"] },
  tailwind: { moves: ["366"] },
  screens: { moves: ["115", "113", "694"] },
  "entry-hazard": { moves: ["191", "390", "446", "564", "830", "845", "887"], abilities: ["どくげしょう"] },
  "hazard-removal": { moves: ["229", "432", "866", "882", "756"] },
  "team-healing": { moves: ["273", "361", "505", "791", "906", "392"], abilities: ["おもてなし"] },
  "rain-setter": { abilities: ["あめふらし"] },
  "sun-setter": { abilities: ["ひでり"] },
  "sand-setter": { abilities: ["すなおこし", "すなはき"] },
  "rain-attacker": { abilities: ["すいすい"] },
  "sun-attacker": { abilities: ["ようりょくそ", "サンパワー", "メガソーラー"] },
  "sand-attacker": { abilities: ["すなかき", "すなのちから"] },
  "setup-counter": { moves: ["114", "144"], abilities: ["てんねん", "かわりもの"] },
} satisfies Record<string, { moves?: string[]; abilities?: string[] }>;

describe("role mechanics audit", () => {
  it("requires the assigned support or weather mechanism on each exact form", () => {
    for (const intro of pokemonIntros) {
      const detail = JSON.parse(readFileSync(`data/usage-ranking/details/${intro.pokemonId}.json`, "utf8")) as UsagePokemonDetail;
      const abilities = Object.values(detail.formats).flatMap((format) => format.abilities.map((ability) => ability.nameJa));
      for (const [role, rule] of Object.entries(roleMechanics) as [string, { moves?: string[]; abilities?: string[] }][]) {
        if (!intro.roles.includes(role as typeof intro.roles[number])) continue;
        expect(rule.moves?.some((id) => detail.learnableMoveIds.includes(id)) || rule.abilities?.some((ability) => abilities.includes(ability)), `${intro.pokemonId}: ${role}`).toBe(true);
      }
    }
  });
  it("shows only Pelipper and Politoed as rain starters in both formats", () => {
    for (const format of ["Singles", "Doubles"] as const) {
      expect(getPokemonForRole("rain-setter", pokemonIntros, rankingPokemon, format).entries.map((entry) => entry.id).sort()).toEqual(["pelipper", "politoed"]);
      expect(getPokemonForRole("rain-attacker", pokemonIntros, rankingPokemon, format).entries.map((entry) => entry.id)).toContain("mega-swampert");
    }
  });
  it("keeps weather users, room users, and non-damaging relays out of starter or attacking-pivot lists", () => {
    for (const [id, excluded] of [
      ["mega-meganium", "sun-setter"], ["mega-houndoom", "sun-setter"],
      ["excadrill", "sand-setter"], ["houndstone", "sand-setter"],
      ["camerupt", "trick-room"], ["mega-camerupt", "trick-room"],
      ["scolipede", "offensive-pivot"], ["malamar", "offensive-pivot"], ["sceptile", "offensive-pivot"],
      ["galarian-slowbro", "priority-attacker"], ["ditto", "team-cushion"],
      ["klefki", "mixed-attacker"], ["slurpuff", "mixed-attacker"], ["skarmory", "hazard-removal"],
    ]) expect(pokemonIntros.find((intro) => intro.pokemonId === id)?.roles).not.toContain(excluded);
  });
});
