import singles from "@/data/champions/singles.json";
import doubles from "@/data/champions/doubles.json";
import metadata from "@/data/metadata.json";
import { PartyChecker } from "@/features/party-check/components/party-checker";
import { SiteLogo } from "@/components/site-logo";

export function PartyCheckPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <header className="mb-7">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo compact />
            <p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモンチャンピオンズ</p>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">パーティー相性チェッカー</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">初心者向けのパーティー相性チェック。現在は対戦データ基盤と攻撃範囲の確認に対応しています。</p>
        </header>
        <PartyChecker
          singles={singles.pokemon}
          doubles={doubles.pokemon}
          singlesAvailable={singles.pokemon}
          doublesAvailable={doubles.pokemon}
          season={metadata.season}
          seasonLabel={metadata.seasonLabel}
          dailyDataPeriod={metadata.dailyDataPeriod}
          updatedAt={metadata.updatedAt}
        />
        <footer className="mt-8 text-xs leading-5 text-slate-500">
          対戦環境: Champions Battle Data / 技タイプ・分類: PokéAPI<br />Pokémon、Nintendo等とは関係のない非公式ツールです。
        </footer>
      </div>
    </main>
  );
}
