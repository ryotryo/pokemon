import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";
import { battleBasicsArticleBySlug, battleBasicsArticles } from "@/content/battle-basics";
import { BattleBasicsArticle } from "@/features/battle-basics/components/battle-basics-article";

export const dynamicParams = false;
export function generateStaticParams(){return battleBasicsArticles.map((article) => ({ slug: article.slug }));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const article=battleBasicsArticleBySlug.get(slug);if(!article)return{};return{title:`${article.title}｜ポケモン対戦の基礎`,description:article.description,alternates:{canonical:`https://poke-analytics.com/battle-basics/${slug}/`}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=battleBasicsArticleBySlug.get(slug);if(!article)notFound();return <main className="min-h-screen bg-slate-50 text-slate-950"><div className="mx-auto max-w-2xl px-3 py-7 sm:px-6 sm:py-12"><header className="mb-3"><SiteLogo compact/></header><BattleBasicsArticle article={article}/><footer className="mt-9 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式コンテンツです。</footer></div></main>}
