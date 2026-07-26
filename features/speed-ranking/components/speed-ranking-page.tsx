import speedRanking from "@/data/champions/speed-ranking.json";
import metadata from "@/data/metadata.json";
import type { SpeedRankingDataset } from "@/lib/champions/speed-ranking";
import { SiteLogo } from "@/components/site-logo";
import { SpeedRanking } from "./speed-ranking";

function formatSeasonLabel(label: string) {
  return label.replace(/^M-?(\d+)$/i, "M-$1");
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${year}/${month}/${day}`;
}

export function SpeedRankingPage() {
  const seasonPeriod = metadata.seasonPeriod;
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-2xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-6 px-1">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo compact />
            <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">すばやさランキング</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">共通スケールのバーで、実戦のすばやさ帯と周辺ポケモンとの重なりを確認できます。</p>
          <p className="mt-2 text-xs font-bold text-slate-600">
            最新シーズン：{formatSeasonLabel(metadata.seasonLabel)}
            {seasonPeriod && `（${formatDate(seasonPeriod.start)}〜${formatDate(seasonPeriod.end)}）`}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">データ更新：{new Date(speedRanking.updatedAt).toLocaleDateString("ja-JP")}</p>
        </header>
        <SpeedRanking dataset={speedRanking as SpeedRankingDataset} />
        <footer className="mt-8 text-xs leading-5 text-slate-500">登場ポケモン・使用率: Champions Battle Data<br />Pokémon、Nintendo等とは関係のない非公式ツールです。</footer>
      </div>
    </main>
  );
}
