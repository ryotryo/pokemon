import type { Metadata } from "next";
import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { SiteIcon } from "@/components/ui/site-icon";
import { TypeChartTable } from "@/features/type-chart/components/type-chart-table";

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
      <p className="mt-8 text-sm"><Link href="/" className="font-bold text-blue-700">← Poké Analyticsトップへ</Link></p>
      <footer className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">タイプ画像: <a href="https://championsbattledata.com/" className="underline">Champions Battle Data</a><br />Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式コンテンツです。</footer>
    </div>
  </main>;
}
