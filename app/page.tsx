import Link from "next/link";
import Image from "next/image";
import { SiteLogo } from "@/components/site-logo";

const tools = [
  {
    title: "ポケモン タイプ相性表",
    description: "18タイプの攻撃・防御相性と、複合タイプの弱点や耐性をまとめて確認できます。",
    href: "/type-chart/",
    icon: "weakness-policy",
  },
  {
    title: "パーティー相性チェッカー",
    description: "自分の6匹のパーティが、使用率上位ポケモンへどの程度弱点を突けるか確認できます。",
    href: "/party-check/",
    icon: "ability-shield",
  },
  {
    title: "すばやさランキング",
    description: "ポケモンごとの実数値や抜きラインを、一覧で比較できるツールです。",
    href: "https://poke-analytics.com/speed-ranking/",
    icon: "choice-scarf",
  },
  {
    title: "使用率ランキング",
    description: "ポケモンチャンピオンズの使用率、技、持ち物、努力値、性格、同時採用ポケモンを確認できます。",
    href: "/usage-ranking/",
    icon: "master-ball",
  },
  {
    title: "ダメージ早見表",
    description: "2匹を選ぶだけで、よく使われる技のおおよそのダメージを双方向に比較できます。",
    href: "/damage-chart/",
    icon: "punching-glove",
  },
  {
    title: "技からポケモン検索",
    description: "技を選ぶと、その技を覚えるポケモンを使用率順位で逆引きできます。",
    href: "/move-search/",
    icon: "ether",
  },
  {
    title: "このポケモンってどんなポケモン？",
    description: "対戦で何をするポケモンなのかを、初心者向けに短く分かりやすく紹介します。",
    href: "/pokemon-intro/",
    icon: "wise-glasses",
  },
  {
    title: "対戦ポケモンの役割",
    description: "物理アタッカーや受け、サポートなどの役割と、それぞれの使用率上位ポケモンを紹介します。",
    href: "/pokemon-roles/",
    icon: "poke-doll",
  },
  {
    title: "ポケモン対戦の基礎",
    description: "対戦を始めたばかりの人向けに、勝ち方、タイプ、技、交代などをゼロから解説します。",
    href: "/battle-basics/",
    icon: "quick-claw",
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

        <section aria-label="ツール一覧">
          <div className="grid grid-cols-1 gap-4">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group flex h-full flex-col rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Image src={`/images/home-items/${tool.icon}.png`} alt="" width={28} height={28} unoptimized className="size-7 shrink-0 object-contain" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-blue-700">ポケモンチャンピオンズ</p>
                        <h3 className="mt-1 text-xl font-black">{tool.title}</h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
                  </div>
                  <span aria-hidden="true" className="mt-1 text-2xl text-blue-700 transition group-hover:translate-x-1">→</span>
                </div>
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
