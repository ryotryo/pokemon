import { SiteLogo } from "@/components/site-logo";
import { getMoveSearchDataset } from "@/lib/champions/move-search-data";
import { Suspense } from "react";
import { MoveSearch } from "./move-search";

export async function MoveSearchPage() {
  const dataset = await getMoveSearchDataset();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-2xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-5 px-1">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo compact />
            <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">技からポケモン検索</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">技を選ぶと、その技を覚えるポケモンを使用率順位で確認できます。</p>
          <p className="mt-2 text-xs font-bold text-slate-600">対象シーズン：{dataset.seasonLabel}</p>
          <p className="mt-1 text-[11px] text-slate-500">データ更新：{new Date(dataset.updatedAt).toLocaleDateString("ja-JP")}</p>
        </header>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-200" />}>
          <MoveSearch dataset={dataset} />
        </Suspense>
        <footer className="mt-8 text-xs leading-5 text-slate-500">
          順位・対戦データ: Champions Battle Data<br />習得技・技情報: projectpokemon/champout<br />Pokémon、Nintendo等とは関係のない非公式ツールです。
        </footer>
      </div>
    </main>
  );
}
