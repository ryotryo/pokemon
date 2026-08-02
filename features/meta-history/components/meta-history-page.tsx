import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import type { MetaHistoryDataset } from "@/lib/champions/meta-history";
import { MetaHistory } from "./meta-history";

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function MetaHistoryPage({ data, availableSeasons }: { data: MetaHistoryDataset; availableSeasons: string[] }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-4xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-6 px-1">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo compact />
            <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">環境推移（{data.season}）</h1>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-sm font-bold text-slate-700">
              記録期間：{formatDate(data.dates[0])}〜{formatDate(data.dates.at(-1)!)}
            </p>
          </div>
          <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="環境推移のシーズン">
            {availableSeasons.map((season) => {
              const current = season === data.season;
              return (
                <Link
                  key={season}
                  href={`/meta-history/${season.toLowerCase()}/`}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-lg border px-3 py-1 text-xs font-black ${current ? "border-blue-700 bg-blue-700 text-white" : "border-blue-200 bg-white text-blue-700"}`}
                >
                  {season}
                </Link>
              );
            })}
          </nav>
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
