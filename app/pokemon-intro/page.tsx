import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import usageIndex from "@/data/usage-ranking/index.json";
import speedRanking from "@/data/champions/speed-ranking.json";
import { SiteLogo } from "@/components/site-logo";
import { PokemonIntroList } from "@/features/pokemon-intro/components/pokemon-intro-list";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";
import { buildPokemonIntroListItems } from "@/lib/champions/pokemon-intro-list";
import { pokemonIntros } from "@/content/pokemon-intros";
export const metadata: Metadata={title:"このポケモンってどんなポケモン？｜Poké Analytics",description:"対戦での基本的な役割が短時間で分かる、初心者向けポケモン図鑑です。",alternates:{canonical:"https://poke-analytics.com/pokemon-intro/"}};
const index=usageIndex as UsageRankingIndex;
const items=buildPokemonIntroListItems(pokemonIntros,index.pokemon,speedRanking.pokemon);
export default function Page(){return <main className="min-h-screen bg-slate-50 text-slate-950"><div className="mx-auto max-w-3xl px-3 py-7 sm:px-6 sm:py-12"><header className="mb-6"><SiteLogo compact/><p className="mt-5 text-xs font-bold text-blue-700">対戦初心者向け図鑑</p><h1 className="mt-1 text-3xl font-black tracking-tight">このポケモンって<br className="sm:hidden"/>どんなポケモン？</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">対戦では何をするポケモンなのか。基本の役割と特徴を、短時間で分かる言葉で紹介します。</p><div className="mt-3 flex flex-wrap gap-x-5"><Link href="/pokemon-roles/" className="inline-flex min-h-10 items-center text-sm font-bold text-blue-700">ポケモンの役割一覧を見る →</Link><Link href="/type-chart/" className="inline-flex min-h-10 items-center text-sm font-bold text-blue-700">タイプ相性表を見る →</Link></div></header><Suspense fallback={<p className="py-8 text-center text-sm text-slate-500">図鑑を読み込んでいます…</p>}><PokemonIntroList items={items}/></Suspense><footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">タイプ・画像・種族値: <a href="https://championsbattledata.com/" className="underline">Champions Battle Data</a><br/>技・特性: projectpokemon/champout</footer></div></main>}
