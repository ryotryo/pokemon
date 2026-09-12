import Link from "next/link";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";
import { pokemonIntros } from "@/content/pokemon-intros";
import { pokemonRoleDefinitions, roleGroups } from "@/content/pokemon-roles";
import type { UsageRankingPokemon } from "@/lib/champions/usage-ranking";

export function PokemonRolesList({ pokemon }: { pokemon: UsageRankingPokemon[] }) {
  const byId = new Map(pokemon.map((entry) => [entry.id, entry]));
  return <div className="space-y-10">{roleGroups.map((group) => <section key={group.id} aria-labelledby={`group-${group.id}`}>
    <div className="border-b border-slate-200 pb-2"><h2 id={`group-${group.id}`} className="text-2xl font-black">{group.label}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{group.description}</p></div>
    <div className="divide-y divide-slate-200">{pokemonRoleDefinitions.filter((role) => role.group === group.id).map((role) => {
      const intros = pokemonIntros.filter((intro) => intro.roles.includes(role.id));
      return <article key={role.id} id={`role-${role.id}`} className="scroll-mt-4 py-4"><h3 className="text-base font-black">{role.label}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{role.description}</p>{intros.length > 0 && <div className="mt-2"><p className="text-[10px] font-bold text-slate-400">この役割の記事があるポケモン</p><div className="mt-1.5 flex flex-wrap gap-2">{intros.map((intro) => { const entry=byId.get(intro.pokemonId); return entry ? <Link key={entry.id} href={`/pokemon-intro/${entry.id}/`} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-blue-100 bg-white py-1 pl-1 pr-2.5 text-xs font-bold text-slate-800 hover:border-blue-300"><PokemonImage src={entry.sprite} name={entry.displayNameJa} size={24}/>{entry.displayNameJa}</Link> : null; })}</div></div>}</article>;
    })}</div>
  </section>)}</div>;
}
