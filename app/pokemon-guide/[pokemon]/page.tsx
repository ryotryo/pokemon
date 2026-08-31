import type { Metadata } from "next";
import { notFound } from "next/navigation";
import usageIndex from "@/data/usage-ranking/index.json";
import { SiteLogo } from "@/components/site-logo";
import { guideBySlug, pokemonGuides } from "@/content/pokemon-guides";
import { guideResearchBySlug } from "@/content/pokemon-guide-research";
import { PokemonGuideArticle } from "@/features/pokemon-guide/components/pokemon-guide-article";
import { resolveGuideDamageExamples } from "@/lib/champions/pokemon-guide-damage";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";

const index = usageIndex as UsageRankingIndex;
export const dynamicParams = false;

export function generateStaticParams() {
  return pokemonGuides.map((guide) => ({ pokemon: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pokemon: string }> }): Promise<Metadata> {
  const { pokemon: slug } = await params;
  const guide = guideBySlug.get(slug);
  const entry = guide && index.pokemon.find((pokemon) => pokemon.id === guide.pokemonId);
  if (!guide || !entry) return {};
  return {
    title: `${entry.displayNameJa}の使い方｜得意・苦手な相手とおすすめの組み合わせ`,
    description: `${entry.displayNameJa}の基本的な使い方、得意・苦手な相手、苦手への対策と味方の組み合わせをPokémon Championsシングル向けに解説します。`,
    alternates: { canonical: `https://poke-analytics.com/pokemon-guide/${guide.slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ pokemon: string }> }) {
  const { pokemon: slug } = await params;
  const guide = guideBySlug.get(slug);
  const research = guideResearchBySlug[slug];
  if (!guide || !research) notFound();
  const damageExamples = await resolveGuideDamageExamples(Object.values(research.matchupDamage).flat());
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-2xl px-3 py-7 sm:px-6 sm:py-12">
        <header className="mb-3 flex items-center justify-between gap-3 px-1"><SiteLogo compact /><p className="text-[10px] font-bold tracking-[0.12em] text-blue-700">ポケモン使い方解説</p></header>
        <PokemonGuideArticle guide={guide} pokemon={index.pokemon} research={research} damageExamples={damageExamples} />
        <footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式攻略コンテンツです。</footer>
      </div>
    </main>
  );
}
