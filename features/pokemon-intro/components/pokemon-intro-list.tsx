import Link from "next/link";
import { TypeBadge } from "@/components/ui/type-badge";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";
import { pokemonIntros } from "@/content/pokemon-intros";
import type { UsageRankingPokemon } from "@/lib/champions/usage-ranking";

export function PokemonIntroList({ pokemon }: { pokemon: UsageRankingPokemon[] }) {
  const byId = new Map(pokemon.map((entry) => [entry.id, entry]));
  return <div className="grid gap-2 sm:grid-cols-2">{pokemonIntros.map((intro) => {
    const entry = byId.get(intro.pokemonId); if (!entry) return null;
    return <Link key={entry.id} href={`/pokemon-intro/${entry.id}/`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm transition hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600">
      <PokemonImage src={entry.sprite} name={entry.displayNameJa} size={44} />
      <span className="min-w-0 flex-1"><strong className="block truncate text-sm font-black">{entry.displayNameJa}</strong><span className="mt-1 flex flex-wrap gap-1">{entry.types.map((type) => <TypeBadge key={type} type={type} />)}</span><span className="mt-1.5 block text-xs leading-5 text-slate-600">{intro.summary}</span></span><span aria-hidden="true" className="font-bold text-blue-700">→</span>
    </Link>;
  })}</div>;
}
