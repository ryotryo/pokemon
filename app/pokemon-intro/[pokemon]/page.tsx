import type { Metadata } from "next";
import { notFound } from "next/navigation";
import usageIndex from "@/data/usage-ranking/index.json";
import speedData from "@/data/champions/speed-ranking.json";
import moveData from "@/data/usage-ranking/moves.json";
import { SiteLogo } from "@/components/site-logo";
import { pokemonIntroById, pokemonIntros } from "@/content/pokemon-intros";
import { PokemonIntroArticle } from "@/features/pokemon-intro/components/pokemon-intro-article";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";
import type { UsageMoveDetail } from "@/lib/champions/usage-ranking";
import type { SpeedRankingDataset } from "@/lib/champions/speed-ranking";
import { resolvePokemonIntroMoves } from "@/lib/champions/pokemon-intro-moves";
const index=usageIndex as UsageRankingIndex; const speed=speedData as SpeedRankingDataset;
const moves=moveData as Record<string, UsageMoveDetail>;
export const dynamicParams=false;
export function generateStaticParams(){return pokemonIntros.map(intro=>({pokemon:intro.pokemonId}))}
export async function generateMetadata({params}:{params:Promise<{pokemon:string}>}):Promise<Metadata>{const {pokemon:id}=await params;const intro=pokemonIntroById.get(id);const entry=index.pokemon.find(p=>p.id===id);if(!intro||!entry)return{};return{title:`${entry.displayNameJa}ってどんなポケモン？｜対戦初心者向け`,description:intro.summary,alternates:{canonical:`https://poke-analytics.com/pokemon-intro/${id}/`}}}
export default async function Page({params}:{params:Promise<{pokemon:string}>}){const {pokemon:id}=await params;const intro=pokemonIntroById.get(id);const entry=index.pokemon.find(p=>p.id===id);const stats=speed.pokemon.find(p=>p.id===id)?.baseStats;if(!intro||!entry||!stats)notFound();const featuredMoves=resolvePokemonIntroMoves(intro.featuredMoves,moves);return <main className="min-h-screen bg-slate-50 text-slate-950"><div className="mx-auto max-w-2xl px-3 py-7 sm:px-6 sm:py-12"><header className="mb-3"><SiteLogo compact/></header><PokemonIntroArticle intro={intro} pokemon={entry} stats={stats} featuredMoves={featuredMoves}/><footer className="mt-9 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式コンテンツです。</footer></div></main>}
