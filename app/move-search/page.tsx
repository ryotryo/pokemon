import type { Metadata } from "next";
import { MoveSearchPage } from "@/features/move-search/components/move-search-page";

export const metadata: Metadata = {
  title: "技からポケモン検索｜ポケモンチャンピオンズ",
  description: "ポケモンチャンピオンズで選んだ技を覚えるポケモンを、シングル・ダブルの使用率順位で確認できます。",
  alternates: { canonical: "/move-search/" },
};

export default function Page() {
  return <MoveSearchPage />;
}
