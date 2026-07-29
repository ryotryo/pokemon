import type { Metadata } from "next";
import { MetaHistoryPage } from "@/features/meta-history/components/meta-history-page";

export const metadata: Metadata = {
  title: "M4環境推移｜ポケモンチャンピオンズ",
  description: "ポケモンチャンピオンズM4の日次使用率順位の変化を、シングル・ダブル別に確認できます。",
  alternates: { canonical: "https://poke-analytics.com/meta-history/m4/" },
};

export default function Page() {
  return <MetaHistoryPage />;
}
