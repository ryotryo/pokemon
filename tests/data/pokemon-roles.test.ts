import { describe, expect, it } from "vitest";
import { pokemonIntros } from "../../content/pokemon-intros";
import { pokemonRoleById, pokemonRoleDefinitions, roleGroups } from "../../content/pokemon-roles";

describe("pokemon roles", () => {
  it("defines unique role and group IDs", () => {
    expect(new Set(pokemonRoleDefinitions.map((role) => role.id)).size).toBe(pokemonRoleDefinitions.length);
    expect(new Set(roleGroups.map((group) => group.id)).size).toBe(roleGroups.length);
  });
  it("keeps every role in a known group", () => {
    const groupIds = new Set(roleGroups.map((group) => group.id));
    for (const role of pokemonRoleDefinitions) expect(groupIds.has(role.group)).toBe(true);
  });
  it("resolves every role on all thirty articles", () => {
    expect(pokemonIntros).toHaveLength(30);
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
