import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetaHistoryPage } from "@/features/meta-history/components/meta-history-page";
import {
  assembleMetaHistoryDataset,
  type MetaHistoryFormatDataset,
  type MetaHistorySeasonMetadata,
} from "@/lib/champions/meta-history";

const DATA_DIRECTORY = path.join(process.cwd(), "data", "meta-history");

async function availableSeasons() {
  const entries = await readdir(DATA_DIRECTORY, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && /^m\d+$/i.test(entry.name))
    .map((entry) => entry.name.toUpperCase())
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
}

async function loadDataset(season: string) {
  if (!/^m\d+$/i.test(season)) return null;
  try {
    const directory = path.join(DATA_DIRECTORY, season.toUpperCase());
    const [metadata, singles, doubles] = await Promise.all([
      readFile(path.join(directory, "metadata.json"), "utf8").then((value) => JSON.parse(value) as MetaHistorySeasonMetadata),
      readFile(path.join(directory, "singles.json"), "utf8").then((value) => JSON.parse(value) as MetaHistoryFormatDataset),
      readFile(path.join(directory, "doubles.json"), "utf8").then((value) => JSON.parse(value) as MetaHistoryFormatDataset),
    ]);
    return assembleMetaHistoryDataset(metadata, singles, doubles);
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
