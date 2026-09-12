import type { Metadata } from "next";
import Link from "next/link";
import usageIndex from "@/data/usage-ranking/index.json";
import { SiteLogo } from "@/components/site-logo";
import { PokemonRolesList } from "@/features/pokemon-roles/components/pokemon-roles-list";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";

export const metadata: Metadata = { title: "対戦ポケモンの役割一覧｜Poké Analytics", description: "アタッカー、受け、サポートなど、ポケモン対戦の主な役割を初心者向けに紹介します。", alternates: { canonical: "https://poke-analytics.com/pokemon-roles/" } };
const index = usageIndex as UsageRankingIndex;
export default function Page(){return <main className="min-h-screen bg-slate-50 text-slate-950"><div className="mx-auto max-w-3xl px-3 py-7 sm:px-6 sm:py-12"><header className="mb-8"><SiteLogo compact/><p className="mt-5 text-xs font-bold text-blue-700">対戦初心者向け</p><h1 className="mt-1 text-3xl font-black tracking-tight">対戦ポケモンの役割</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">対戦では、ポケモンごとに得意な役割があります。攻撃するだけでなく、相手の攻撃を受けたり、味方を助けたり、天候を変えたりするポケモンもいます。</p><LinkToIntro/></header><PokemonRolesList pokemon={index.pokemon}/></div></main>}
function LinkToIntro(){return <Link href="/pokemon-intro/" className="mt-3 inline-flex min-h-10 items-center text-sm font-bold text-blue-700">記事の一覧を見る →</Link>}
