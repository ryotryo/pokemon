import { SiteLogo } from "@/components/site-logo";
import { getDamageChartDataset } from "@/lib/champions/damage-chart-data";
import { DamageChart } from "./damage-chart";

export async function DamageChartPage() {
  const dataset = await getDamageChartDataset();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-3xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-5 px-1">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo compact />
            <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">ダメージ早見表</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">2匹を選ぶだけで、よく使われる技のおおよそのダメージを双方向で比較できます。</p>
          <p className="mt-2 text-xs font-bold text-slate-600">対象シーズン：{dataset.seasonLabel}</p>
          <p className="mt-1 text-[11px] text-slate-500">データ更新：{new Date(dataset.updatedAt).toLocaleDateString("ja-JP")}</p>
        </header>
        <DamageChart dataset={dataset} />
        <footer className="mt-8 text-xs leading-5 text-slate-500">
          使用率・使用技・種族値・技情報: Champions Battle Data<br />Pokémon、Nintendo等とは関係のない非公式ツールです。
        </footer>
      </div>
    </main>
  );
}
