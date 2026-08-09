import type { Metadata } from "next";
import { DamageChartPage } from "@/features/damage-chart/components/damage-chart-page";

export const metadata: Metadata = {
  title: "ダメージ早見表｜ポケモンチャンピオンズ｜Poké Analytics",
  description: "ポケモンチャンピオンズでよく使われる技のダメージを、2匹選ぶだけで双方向に比較できる早見表です。",
  alternates: { canonical: "/damage-chart/" },
};

export default function Page() {
  return <DamageChartPage />;
}
