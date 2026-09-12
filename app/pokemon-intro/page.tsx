import type { Metadata } from "next";
import usageIndex from "@/data/usage-ranking/index.json";
import { SiteLogo } from "@/components/site-logo";
import { PokemonIntroList } from "@/features/pokemon-intro/components/pokemon-intro-list";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";
export const metadata: Metadata={title:"このポケモンってどんなポケモン？｜Poké Analytics",description:"対戦での基本的な役割が短時間で分かる、初心者向けポケモン図鑑です。",alternates:{canonical:"https://poke-analytics.com/pokemon-intro/"}};
const index=usageIndex as UsageRankingIndex;
export default function Page(){return <main className="min-h-screen bg-slate-50 text-slate-950"><div className="mx-auto max-w-3xl px-3 py-7 sm:px-6 sm:py-12"><header className="mb-6"><SiteLogo compact/><p className="mt-5 text-xs font-bold text-blue-700">対戦初心者向け図鑑</p><h1 className="mt-1 text-3xl font-black tracking-tight">このポケモンって<br className="sm:hidden"/>どんなポケモン？</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">対戦では何をするポケモンなのか。基本の役割と特徴を、短時間で分かる言葉で紹介します。</p></header><PokemonIntroList pokemon={index.pokemon}/><footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">タイプ・画像・種族値・技・特性: Champions Battle Data / projectpokemon/champout</footer></div></main>}
