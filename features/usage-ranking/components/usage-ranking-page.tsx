import usageIndex from "@/data/usage-ranking/index.json";
import { Suspense } from "react";
import { SiteLogo } from "@/components/site-logo";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";
import { UsageRanking } from "./usage-ranking";

function seasonLabel(value: string) {
  return value.replace(/^M-?(\d+)$/i, "M-$1");
}

export function UsageRankingPage() {
  const data = usageIndex as UsageRankingIndex;
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-2xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-6 px-1">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo compact />
            <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">使用率ランキング</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">ランクバトルで使われているポケモンを順位順に確認できます。</p>
          <p className="mt-2 text-xs font-bold text-slate-600">現在のシーズン：{seasonLabel(data.seasonLabel)}</p>
          <p className="mt-1 text-[11px] text-slate-500">最終更新：{new Date(data.sourceUpdatedAt).toLocaleDateString("ja-JP")}</p>
        </header>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-slate-200" />}>
          <UsageRanking pokemon={data.pokemon.filter((pokemon) => pokemon.formRelation !== "mega")} />
        </Suspense>
        <footer className="mt-8 text-xs leading-5 text-slate-500">順位・対戦データ: Champions Battle Data<br />習得技・技情報: projectpokemon/champout<br />Pokémon、Nintendo等とは関係のない非公式ツールです。</footer>
      </div>
    </main>
  );
}
