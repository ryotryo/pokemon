import { SiteLogo } from "@/components/site-logo";
import { Suspense } from "react";
import type { UsagePokemonPageData } from "@/lib/champions/usage-ranking";
import { hasPokemonGuide } from "@/content/pokemon-guides";
import { UsageDetail } from "./usage-detail";

export function UsageDetailPage({ pokemon }: { pokemon: UsagePokemonPageData }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-2xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-3 flex items-center justify-between gap-3 px-1">
          <SiteLogo compact />
          <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
        </header>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-200" />}>
          <UsageDetail pokemon={pokemon} hasGuide={hasPokemonGuide(pokemon.id)} />
        </Suspense>
        <footer className="mt-8 text-xs leading-5 text-slate-500">対戦データ: Champions Battle Data<br />習得技・技情報: projectpokemon/champout</footer>
      </div>
    </main>
  );
}
