import Link from "next/link";
import { TypeBadge } from "@/components/ui/type-badge";
import { pokemonGuides } from "@/content/pokemon-guides";
import type { UsageRankingPokemon } from "@/lib/champions/usage-ranking";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";

export function PokemonGuideList({ pokemon }: { pokemon: UsageRankingPokemon[] }) {
  const byId = new Map(pokemon.map((entry) => [entry.id, entry]));
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {pokemonGuides.map((guide) => {
        const entry = byId.get(guide.pokemonId);
        if (!entry) return null;
        return (
          <Link key={guide.slug} href={`/pokemon-guide/${guide.slug}/`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <PokemonImage src={entry.sprite} name={entry.displayNameJa} size={44} />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <strong className="truncate text-sm font-black">{entry.displayNameJa}</strong>
                <span className="shrink-0 text-[10px] font-bold text-blue-700">制作時 {guide.rankAtCreation}位</span>
              </span>
              <span className="mt-1 flex flex-wrap gap-1">{entry.types.map((type) => <TypeBadge key={type} type={type} />)}</span>
              <span className="mt-1.5 block text-xs leading-5 text-slate-500">{guide.summary}</span>
            </span>
            <span aria-hidden="true" className="text-lg font-bold text-blue-700 transition group-hover:translate-x-0.5">→</span>
          </Link>
        );
      })}
    </div>
  );
}
