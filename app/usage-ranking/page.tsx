import type { Metadata } from "next";
import { UsageRankingPage } from "@/features/usage-ranking/components/usage-ranking-page";

export const metadata: Metadata = {
  title: "使用率ランキング｜ポケモンチャンピオンズ",
  description: "ポケモンチャンピオンズのシングル・ダブル使用率ランキングを確認できます。技、持ち物、努力値、性格、同時採用ポケモン、覚える技も掲載しています。",
  alternates: { canonical: "https://poke-analytics.com/usage-ranking/" },
};

export default function Page() {
  return <UsageRankingPage />;
}

