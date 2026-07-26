import type { Metadata } from "next";
import { notFound } from "next/navigation";
import usageIndex from "@/data/usage-ranking/index.json";
import { UsageDetailPage } from "@/features/usage-ranking/components/usage-detail-page";
import { getUsagePokemonPageData } from "@/lib/champions/usage-ranking-data";
import type { UsageRankingIndex } from "@/lib/champions/usage-ranking";

const index = usageIndex as UsageRankingIndex;

export const dynamicParams = false;

export function generateStaticParams() {
  return index.pokemon.filter((pokemon) => pokemon.formRelation !== "mega").map((pokemon) => ({ pokemon: pokemon.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ pokemon: string }> }): Promise<Metadata> {
  const { pokemon: id } = await params;
  const pokemon = index.pokemon.find((entry) => entry.id === id && entry.formRelation !== "mega");
  if (!pokemon) return {};
  return {
    title: `${pokemon.displayNameJa}の使用率・技・持ち物｜ポケモンチャンピオンズ`,
    description: `${pokemon.displayNameJa}の使用技、持ち物、努力値、性格、同時採用ポケモン、ポケモンチャンピオンズで覚える技を確認できます。`,
    alternates: { canonical: `https://poke-analytics.com/usage-ranking/${pokemon.id}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ pokemon: string }> }) {
  const { pokemon: id } = await params;
  const pokemon = await getUsagePokemonPageData(id);
  if (!pokemon) notFound();
  return <UsageDetailPage pokemon={pokemon} />;
}
