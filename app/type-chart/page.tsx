import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SiteLogo } from "@/components/site-logo";
import { SiteIcon } from "@/components/ui/site-icon";
import { TypeChartTable } from "@/features/type-chart/components/type-chart-table";
import { DualTypeChecker } from "@/features/type-chart/components/dual-type-checker";

export const metadata: Metadata = {
  title: "ポケモン タイプ相性表｜Poké Analytics",
  description: "ポケモンの18タイプの弱点・耐性・無効を、攻撃側と防御側の一覧表で確認できます。",
  alternates: { canonical: "https://poke-analytics.com/type-chart/" },
};

export default function Page() {
  return <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-950">
    <div className="mx-auto max-w-7xl px-3 py-7 sm:px-6 sm:py-12">
      <header className="mb-7">
        <SiteLogo compact />
        <div className="mt-5 flex items-start gap-3">
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><SiteIcon name="type-matchup" className="size-6" /></span>
          <div><p className="text-xs font-bold text-blue-700">攻撃と防御を一覧で確認</p><h1 className="mt-1 text-3xl font-black tracking-tight">ポケモン タイプ相性表</h1></div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">技のタイプと、攻撃を受けるポケモンのタイプを照らし合わせて、ダメージ倍率を確認できます。複合タイプは表の下にある判定ツールで調べられます。</p>
      </header>
      <TypeChartTable />
      <Suspense fallback={<p className="mt-10 py-8 text-center text-sm text-slate-500">複合タイプ判定を読み込んでいます…</p>}><DualTypeChecker /></Suspense>
      <section className="mt-10" aria-labelledby="related-links"><h2 id="related-links" className="text-lg font-black">関連コンテンツ</h2><div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Link href="/party-check/" className="rounded-2xl border border-blue-100 bg-white p-4 text-sm font-black hover:border-blue-300">パーティー相性チェッカー<span className="mt-1 block text-xs font-medium text-slate-500">6匹の攻撃範囲を確認 →</span></Link>
        <Link href="/battle-basics/type-matchups/" className="rounded-2xl border border-blue-100 bg-white p-4 text-sm font-black hover:border-blue-300">タイプ相性の基礎<span className="mt-1 block text-xs font-medium text-slate-500">相性の考え方を学ぶ →</span></Link>
        <Link href="/pokemon-intro/" className="rounded-2xl border border-blue-100 bg-white p-4 text-sm font-black hover:border-blue-300">初心者向けポケモン図鑑<span className="mt-1 block text-xs font-medium text-slate-500">各ポケモンのタイプを見る →</span></Link>
      </div></section>
      <p className="mt-8 text-sm"><Link href="/" className="font-bold text-blue-700">← Poké Analyticsトップへ</Link></p>
      <footer className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">タイプ画像: <a href="https://championsbattledata.com/" className="underline">Champions Battle Data</a><br />Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式コンテンツです。</footer>
    </div>
  </main>;
}
