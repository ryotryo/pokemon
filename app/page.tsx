import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { ToolIcon } from "@/components/tool-icon";
import { SiteIcon } from "@/components/ui/site-icon";
import type { ToolId } from "@/lib/tool-icons";

const tools = [
  {
    title: "ポケモン タイプ相性表",
    description: "18タイプの攻撃・防御相性と、複合タイプの弱点や耐性をまとめて確認できます。",
    href: "/type-chart/",
    siteIcon: "type-matchup" as const,
  },
  {
    title: "パーティー相性チェッカー",
    description: "自分の6匹のパーティが、使用率上位ポケモンへどの程度弱点を突けるか確認できます。",
    href: "/party-check/",
    id: "party-check" satisfies ToolId,
  },
  {
    title: "すばやさランキング",
    description: "ポケモンごとの実数値や抜きラインを、一覧で比較できるツールです。",
    href: "https://poke-analytics.com/speed-ranking/",
    id: "speed-ranking" satisfies ToolId,
  },
  {
    title: "使用率ランキング",
    description: "ポケモンチャンピオンズの使用率、技、持ち物、努力値、性格、同時採用ポケモンを確認できます。",
    href: "/usage-ranking/",
    id: "usage-ranking" satisfies ToolId,
  },
  {
    title: "ダメージ早見表",
    description: "2匹を選ぶだけで、よく使われる技のおおよそのダメージを双方向に比較できます。",
    href: "/damage-chart/",
    iconText: "％",
  },
  {
    title: "技からポケモン検索",
    description: "技を選ぶと、その技を覚えるポケモンを使用率順位で逆引きできます。",
    href: "/move-search/",
    iconText: "技",
  },
  {
    title: "このポケモンってどんなポケモン？",
    description: "対戦で何をするポケモンなのかを、初心者向けに短く分かりやすく紹介します。",
    href: "/pokemon-intro/",
    iconText: "？",
  },
  {
    title: "ポケモン対戦の基礎",
    description: "対戦を始めたばかりの人向けに、勝ち方、タイプ、技、交代などをゼロから解説します。",
    href: "/battle-basics/",
    iconText: "基",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <header className="mb-10">
          <SiteLogo />
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Poké Analytics</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">ポケモンチャンピオンズの対戦に役立つツールと、初心者に向けたコンテンツを公開中</p>
        </header>

        <section aria-labelledby="available-tools">
          <div className="mb-4 flex items-center gap-3">
            <h2 id="available-tools" className="text-lg font-black">現在利用可能</h2>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group flex h-full flex-col rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      {"id" in tool
                        ? <ToolIcon tool={tool.id} />
                        : "siteIcon" in tool
                          ? <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><SiteIcon name={tool.siteIcon} className="size-5" /></span>
                        : <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-black text-blue-700">{tool.iconText}</span>}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-blue-700">ポケモンチャンピオンズ</p>
                        <h3 className="mt-1 text-xl font-black">{tool.title}</h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
                  </div>
                  <span aria-hidden="true" className="mt-1 text-2xl text-blue-700 transition group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-5 text-sm font-bold text-blue-700">ツールを開く</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500">
          Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式ツールサイトです。
        </footer>
      </div>
    </main>
  );
}
