import type { Metadata } from "next";
import { SiteLogo } from "@/components/site-logo";
import { BattleBasicsIndex } from "@/features/battle-basics/components/battle-basics-index";

export const metadata: Metadata = { title: "ポケモン対戦の基礎", description: "ポケモン対戦を始めたばかりの人向けに、ルールや用語をゼロからやさしく解説します。", alternates: { canonical: "https://poke-analytics.com/battle-basics/" } };
export default function Page(){return <main className="min-h-screen bg-slate-50 text-slate-950"><div className="mx-auto max-w-3xl px-3 py-7 sm:px-6 sm:py-12"><header className="mb-6"><SiteLogo compact/><p className="mt-5 text-xs font-bold text-blue-700">対戦をゼロから学ぶ</p><h1 className="mt-1 text-3xl font-black tracking-tight">ポケモン対戦の基礎</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">ポケモン対戦を始めたばかりの人向けに、ルールや用語をゼロから解説。順番に読んでも、分からないテーマだけ選んでも学べます。</p></header><BattleBasicsIndex/><footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式コンテンツです。</footer></div></main>}
