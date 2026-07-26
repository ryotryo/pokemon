import type { Metadata } from "next";
import { PartyCheckPage } from "@/features/party-check/components/party-check-page";

export const metadata: Metadata = {
  title: "ポケモンチャンピオンズ パーティ相性チェッカー",
  description: "ポケモンチャンピオンズ初心者向けパーティ相性チェッカー",
};

export default function Page() {
  return <PartyCheckPage />;
}
