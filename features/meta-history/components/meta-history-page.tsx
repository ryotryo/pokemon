import history from "@/data/meta-history/m4.json";
import { SiteLogo } from "@/components/site-logo";
import type { MetaHistoryDataset } from "@/lib/champions/meta-history";
import { MetaHistory } from "./meta-history";

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function MetaHistoryPage() {
  const data = history as MetaHistoryDataset;
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-4xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-6 px-1">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo compact />
            <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">環境推移</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-blue-700 px-2.5 py-1 text-xs font-black text-white">M4</span>
            <p className="text-sm font-bold text-slate-700">
              {formatDate(data.dates[0])}から記録されている順位推移
            </p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            ポケモン使用率の数値ではなく、日次データに記録された順位を表示しています。
          </p>
        </header>
        <MetaHistory dataset={data} />
        <footer className="mt-8 text-xs leading-5 text-slate-500">
          順位データ: Champions Battle Data<br />
          Pokémon、Nintendo等とは関係のない非公式ツールです。
        </footer>
      </div>
    </main>
  );
}
