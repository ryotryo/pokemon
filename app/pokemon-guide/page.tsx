import type { Metadata } from "next";
import usageIndex from "@/data/usage-ranking/index.json";
import { SiteLogo } from "@/components/site-logo";
import { PokemonGuideList } from "@/features/pokemon-guide/components/pokemon-guide-list";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";

export const metadata: Metadata = {
  title: "ポケモン使い方解説｜Pokémon Champions",
  description: "ポケモンの基本的な使い方、得意・苦手な相手、相性のいい味方を初心者向けに解説します。",
  alternates: { canonical: "https://poke-analytics.com/pokemon-guide/" },
};

const index = usageIndex as UsageRankingIndex;

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-3xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-7">
          <SiteLogo compact />
          <p className="mt-5 text-xs font-bold text-blue-700">Pokémon Champions・シングル</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">ポケモン使い方解説</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">ポケモンの基本的な使い方、得意・苦手な相手、相性のいい味方を初心者向けに解説します。</p>
          <p className="mt-2 text-xs text-slate-500">最初の記事群：M5 シングル使用率Top10</p>
        </header>
        <PokemonGuideList pokemon={index.pokemon} />
        <footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">現在順位・タイプ・画像: Champions Battle Data<br />使い方: M3〜M5の日本語構築記事を調査して編集</footer>
      </div>
    </main>
  );
}
