"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getTypeDisplayNameJa, TYPE_NAMES_JA } from "@/lib/champions/display-names";
import type { BattleFormat, DamageClass } from "@/lib/champions/types";
import {
  formatPercentage,
  formatQuery,
  filterAndSortUsageMoves,
  parseFormat,
  type UsageFormatDetail,
  type UsageMoveDetail,
  type UsagePokemonPageData,
  type UsageMoveSort,
} from "@/lib/champions/usage-ranking";
import { FormatToggle } from "./format-toggle";
import { PercentageBar } from "./percentage-bar";
import { PokemonImage } from "./pokemon-image";

const DAMAGE_CLASS_LABELS: Record<DamageClass, string> = { physical: "物理", special: "特殊", status: "変化" };

function RankingSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyRanking() {
  return <p className="py-3 text-sm text-slate-500">表示できるデータがありません。</p>;
}

function UsageValue({ value, fallback }: { value: number | null; fallback?: string | null }) {
  return <span className="text-xs font-bold text-slate-600">{formatPercentage(value, fallback)}</span>;
}

function MoveRankings({ detail, moves }: { detail: UsageFormatDetail; moves: Map<string, UsageMoveDetail> }) {
  if (!detail.moves.length) return <EmptyRanking />;
  return (
    <ol className="divide-y divide-slate-100">
      {detail.moves.map((row) => {
        const move = moves.get(row.moveId);
        if (!move) return null;
        return (
          <li key={`${row.rank}-${row.moveId}`} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.5rem] gap-2 py-3">
            <span className="text-center text-xs font-black text-slate-400">{row.rank}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{move.nameJa}</p>
              <p className="mt-1 text-[11px] text-slate-500">{getTypeDisplayNameJa(move.type)}・{DAMAGE_CLASS_LABELS[move.damageClass]}</p>
              <PercentageBar value={row.percentageValue} />
            </div>
            <UsageValue value={row.percentageValue} fallback={row.percentage} />
          </li>
        );
      })}
    </ol>
  );
}

function ItemRankings({ detail }: { detail: UsageFormatDetail }) {
  if (!detail.items.length) return <EmptyRanking />;
  return (
    <ol className="divide-y divide-slate-100">
      {detail.items.map((row) => (
        <li key={`${row.rank}-${row.nameJa}`} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.5rem] gap-2 py-3">
          <span className="text-center text-xs font-black text-slate-400">{row.rank}</span>
          <div className="min-w-0"><p className="truncate text-sm font-bold">{row.nameJa}</p><PercentageBar value={row.percentageValue} /></div>
          <UsageValue value={row.percentageValue} fallback={row.percentage} />
        </li>
      ))}
    </ol>
  );
}

function SpreadRankings({ detail }: { detail: UsageFormatDetail }) {
  if (!detail.spreads.length) return <EmptyRanking />;
  return (
    <ol className="divide-y divide-slate-100">
      {detail.spreads.map((row) => (
        <li key={`${row.rank}-${row.raw}`} className="py-3">
          <div className="flex items-start gap-2">
            <span className="w-6 shrink-0 text-center text-xs font-black text-slate-400">{row.rank}</span>
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-bold">
                {row.hp ?? "—"}-{row.attack ?? "—"}-{row.defense ?? "—"}-{row.specialAttack ?? "—"}-{row.specialDefense ?? "—"}-{row.speed ?? "—"}
              </p>
              <div className="mt-1 grid grid-cols-3 gap-x-2 gap-y-1 text-[10px] text-slate-500">
                <span>HP {row.hp ?? "—"}</span><span>こうげき {row.attack ?? "—"}</span><span>ぼうぎょ {row.defense ?? "—"}</span>
                <span>とくこう {row.specialAttack ?? "—"}</span><span>とくぼう {row.specialDefense ?? "—"}</span><span>すばやさ {row.speed ?? "—"}</span>
              </div>
              <PercentageBar value={row.percentageValue} />
            </div>
            <UsageValue value={row.percentageValue} fallback={row.percentage} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function NatureRankings({ detail }: { detail: UsageFormatDetail }) {
  if (!detail.natures.length) return <EmptyRanking />;
  return (
    <ol className="divide-y divide-slate-100">
      {detail.natures.map((row) => (
        <li key={`${row.rank}-${row.nameJa}`} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.5rem] gap-2 py-3">
          <span className="text-center text-xs font-black text-slate-400">{row.rank}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold">{row.nameJa}</p>
            <p className="mt-1 text-[11px] text-slate-500">{row.statUp && row.statDown ? `${row.statUp}↑ / ${row.statDown}↓` : "能力補正なし"}</p>
            <PercentageBar value={row.percentageValue} />
          </div>
          <UsageValue value={row.percentageValue} fallback={row.percentage} />
        </li>
      ))}
    </ol>
  );
}

function TeammateRankings({ detail, format }: { detail: UsageFormatDetail; format: BattleFormat }) {
  if (!detail.teammates.length) return <EmptyRanking />;
  return (
    <ol className="divide-y divide-slate-100">
      {detail.teammates.map((row) => (
        <li key={`${row.rank}-${row.pokemonId}`}>
          <Link href={`/usage-ranking/${row.pokemonId}/?format=${formatQuery(format)}`} className="grid min-h-16 grid-cols-[1.5rem_2.75rem_minmax(0,1fr)_3.5rem] items-center gap-2 py-2 focus-visible:outline-2 focus-visible:outline-blue-600">
            <span className="text-center text-xs font-black text-slate-400">{row.rank}</span>
            <PokemonImage src={row.sprite} name={row.displayNameJa} size={44} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{row.displayNameJa}</span>
              <span className="mt-1 block truncate text-[10px] text-slate-500">{row.types.map(getTypeDisplayNameJa).join(" / ")}</span>
            </span>
            <UsageValue value={row.percentageValue} fallback={row.percentage} />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function LearnableMoves({ moves, topMoveIds }: { moves: UsageMoveDetail[]; topMoveIds: Set<string> }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [damageClass, setDamageClass] = useState<DamageClass | "all">("all");
  const [sort, setSort] = useState<UsageMoveSort>("name");

  const filtered = useMemo(
    () => filterAndSortUsageMoves(moves, { query, type, damageClass, sort }),
    [damageClass, moves, query, sort, type],
  );

  return (
    <>
      <p className="text-xs leading-5 text-slate-500">「使用率上位」は、このポケモンが覚えられる技のうち、現在の対戦データで採用率が高い技です。</p>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="技名で検索" className="mt-3 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
      <div className="mt-2 grid grid-cols-1 gap-2 min-[360px]:grid-cols-3">
        <select aria-label="技タイプで絞り込み" value={type} onChange={(event) => setType(event.target.value)} className="h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs">
          <option value="all">全タイプ</option>
          {Object.entries(TYPE_NAMES_JA).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
        <select aria-label="技分類で絞り込み" value={damageClass} onChange={(event) => setDamageClass(event.target.value as DamageClass | "all")} className="h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs">
          <option value="all">全分類</option><option value="physical">物理</option><option value="special">特殊</option><option value="status">変化</option>
        </select>
        <select aria-label="技の並び順" value={sort} onChange={(event) => setSort(event.target.value as UsageMoveSort)} className="h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs">
          <option value="name">技名順</option><option value="type">タイプ順</option><option value="power">威力が高い順</option><option value="pp">PPが多い順</option>
        </select>
      </div>
      <p className="mt-3 text-xs text-slate-500">{filtered.length}件</p>
      <ul className="mt-1 divide-y divide-slate-100">
        {filtered.map((move) => (
          <li key={move.id} className="py-3">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
                  <span>{move.nameJa}</span>
                  {topMoveIds.has(move.id) && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">使用率上位</span>}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{getTypeDisplayNameJa(move.type)} / {DAMAGE_CLASS_LABELS[move.damageClass]}</p>
              </div>
              <p className="shrink-0 text-right text-[10px] leading-5 text-slate-500">
                威力 {move.power ?? "—"}<br />命中 {move.alwaysHits ? "必中" : move.accuracy ?? "—"}<br />PP {move.pp ?? "—"}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {!filtered.length && <p className="py-6 text-center text-sm text-slate-500">条件に合う技がありません。</p>}
    </>
  );
}

export function UsageDetail({ pokemon }: { pokemon: UsagePokemonPageData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const format = parseFormat(searchParams.get("format") ?? undefined);
  const changeFormat = (next: BattleFormat) => {
    router.replace(`${pathname}?format=${formatQuery(next)}`, { scroll: false });
  };
  const detail = pokemon.formats[format];
  const moves = useMemo(() => new Map(pokemon.learnableMoves.map((move) => [move.id, move])), [pokemon.learnableMoves]);
  const topMoveIds = useMemo(() => new Set(detail.moves.map((move) => move.moveId)), [detail.moves]);

  return (
    <div>
      <Link href={`/usage-ranking/?format=${formatQuery(format)}`} className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">← 使用率ランキング</Link>
      <div className="mt-2 flex items-center gap-4">
        <PokemonImage src={pokemon.sprite} name={pokemon.displayNameJa} size={96} />
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-black">{pokemon.displayNameJa}</h1>
          <p className="mt-2 text-xs font-bold text-slate-500">{pokemon.types.map(getTypeDisplayNameJa).join(" / ")}</p>
          <p className="mt-2 text-sm font-bold text-blue-700">{format === "Singles" ? "シングル" : "ダブル"} 第{detail.rank ?? "—"}位</p>
          <p className="mt-1 text-xs text-slate-500">使用率 {formatPercentage(detail.usagePercentage)}</p>
        </div>
      </div>
      <div className="mt-5"><FormatToggle value={format} onChange={changeFormat} /></div>
      <nav aria-label="詳細セクション" className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs font-bold text-blue-700">
        {[["moves", "使用技"], ["items", "持ち物"], ["spreads", "努力値"], ["natures", "性格"], ["teammates", "同時採用"], ["learnset", "覚える技"]].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="min-h-9 shrink-0 rounded-full bg-blue-50 px-3 py-2">{label}</a>
        ))}
      </nav>
      <div className="mt-4 space-y-4">
        <RankingSection id="moves" title="使用技"><MoveRankings detail={detail} moves={moves} /></RankingSection>
        <RankingSection id="items" title="持ち物"><ItemRankings detail={detail} /></RankingSection>
        <RankingSection id="spreads" title="努力値"><SpreadRankings detail={detail} /></RankingSection>
        <RankingSection id="natures" title="性格"><NatureRankings detail={detail} /></RankingSection>
        <RankingSection id="teammates" title="一緒に使われているポケモン"><TeammateRankings detail={detail} format={format} /></RankingSection>
        <RankingSection id="learnset" title="覚える技一覧"><LearnableMoves moves={pokemon.learnableMoves} topMoveIds={topMoveIds} /></RankingSection>
      </div>
    </div>
  );
}
