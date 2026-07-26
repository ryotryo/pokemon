import type { Metadata } from "next";
import { SpeedRankingPage } from "@/features/speed-ranking/components/speed-ranking-page";

export const metadata: Metadata = {
  title: "Pokémon Champions すばやさランキング",
  description: "Pokémon Championsの実戦すばやさ帯を共通スケールで比較できるツール",
};

export default function Page() {
  return <SpeedRankingPage />;
}
