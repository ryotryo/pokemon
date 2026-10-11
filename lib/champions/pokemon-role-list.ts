import type { PokemonRoleId } from "../../content/pokemon-roles";
import type { BattleFormat } from "./types";
import type { UsageRankingPokemon } from "./usage-ranking";

export const ROLE_POKEMON_LIMIT = 10;

export function getPokemonForRole(
  roleId: PokemonRoleId,
  intros: readonly { pokemonId: string; roles: readonly PokemonRoleId[] }[],
  pokemon: readonly UsageRankingPokemon[],
  format: BattleFormat,
) {
  const ids = new Set(intros.filter((intro) => intro.roles.includes(roleId)).map((intro) => intro.pokemonId));
  const matches = pokemon.filter((entry) => ids.has(entry.id));
  const entries = [...matches].sort((a, b) =>
    (a.ranks[format] ?? Infinity) - (b.ranks[format] ?? Infinity)
    || a.dexNumber - b.dexNumber
    || a.formOrder - b.formOrder
    || a.id.localeCompare(b.id),
  ).slice(0, ROLE_POKEMON_LIMIT);
  return { entries, total: matches.length };
}

export type PokemonRoleLists = Record<PokemonRoleId, Record<BattleFormat, ReturnType<typeof getPokemonForRole>>>;
