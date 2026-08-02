import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetaHistoryPage } from "@/features/meta-history/components/meta-history-page";
import type { MetaHistoryDataset } from "@/lib/champions/meta-history";

const DATA_DIRECTORY = path.join(process.cwd(), "data", "meta-history");

async function availableSeasons() {
  const files = await readdir(DATA_DIRECTORY);
  return files
    .filter((file) => /^m\d+\.json$/i.test(file))
    .map((file) => file.replace(/\.json$/i, "").toUpperCase())
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
}

async function loadDataset(season: string) {
  if (!/^m\d+$/i.test(season)) return null;
  try {
    const value = await readFile(path.join(DATA_DIRECTORY, `${season.toLowerCase()}.json`), "utf8");
    const dataset = JSON.parse(value) as MetaHistoryDataset;
    return dataset.season.toLowerCase() === season.toLowerCase() ? dataset : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return (await availableSeasons()).map((season) => ({ season: season.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ season: string }> }): Promise<Metadata> {
  const { season } = await params;
  const dataset = await loadDataset(season);
  if (!dataset) return {};
  return {
    title: `${dataset.season}環境推移｜ポケモンチャンピオンズ`,
    description: `ポケモンチャンピオンズ${dataset.season}の日次使用率順位の変化を、シングル・ダブル別に確認できます。`,
    alternates: { canonical: `https://poke-analytics.com/meta-history/${season.toLowerCase()}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ season: string }> }) {
  const { season } = await params;
  const [data, seasons] = await Promise.all([loadDataset(season), availableSeasons()]);
  if (!data) notFound();
  return <MetaHistoryPage data={data} availableSeasons={seasons} />;
}
