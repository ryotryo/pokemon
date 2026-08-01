"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { pushDataLayer, useToolView } from "@/lib/analytics";
import { TYPE_NAMES_JA } from "@/lib/champions/display-names";
import type { BattleFormat, DamageClass } from "@/lib/champions/types";
import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
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
import { MoveDetailSheet } from "./move-detail-sheet";
import { PercentageBar } from "./percentage-bar";
import { PokemonImage } from "./pokemon-image";

const SECTIONS = [
  ["moves", "使用技"],
  ["items", "持ち物"],
  ["spreads", "努力値"],
  ["natures", "性格"],
  ["abilities", "特性"],
  ["teammates", "同時採用"],
  ["learnset", "覚える技"],
] as const;
const RANKING_GRID_CLASS = "grid grid-cols-1 gap-x-3 min-[360px]:grid-flow-col min-[360px]:grid-cols-2 min-[360px]:grid-rows-5";

function RankingSection({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-14 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="flex items-baseline gap-2 text-base font-black">{title}{note && <span className="text-[10px] font-bold text-slate-400">{note}</span>}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function EmptyRanking() {
  return <p className="py-3 text-sm text-slate-500">表示できるデータがありません。</p>;
}

function UsageValue({ value, fallback }: { value: number | null; fallback?: string | null }) {
  return <span className="text-xs font-bold text-slate-600">{formatPercentage(value, fallback)}</span>;
}

function BaseStats({ stats }: { stats: UsagePokemonPageData["baseStats"] }) {
  const values = [
    ["HP", stats.hp],
    ["こうげき", stats.attack],
    ["ぼうぎょ", stats.defense],
    ["とくこう", stats.specialAttack],
    ["とくぼう", stats.specialDefense],
    ["すばやさ", stats.speed],
  ] as const;
  return (
    <div className="mt-2 max-w-72">
      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 tabular-nums">
        {values.map(([label, value]) => (
          <span key={label} className="min-w-0">
            <span className="block truncate text-[9px] leading-3 text-slate-400">{label}</span>
            <b className="block text-xs leading-4 text-slate-700">{value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function MegaBaseStats({ pokemon }: { pokemon: UsagePokemonPageData }) {
  if (!pokemon.megaForms.length) return null;
  return (
    <section className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
      <h2 className="text-sm font-black text-blue-950">メガシンカ種族値</h2>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {pokemon.megaForms.map((mega) => (
          <div key={mega.id} className="flex items-center gap-2 rounded-lg bg-white px-2 py-2">
            <PokemonImage src={mega.sprite} name={mega.displayNameJa} size={44} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">{mega.displayNameJa}</p>
              <BaseStats stats={mega.baseStats} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MoveRankings({ detail, moves, onSelectMove }: { detail: UsageFormatDetail; moves: Map<string, UsageMoveDetail>; onSelectMove: (move: UsageMoveDetail) => void }) {
  if (!detail.moves.length) return <EmptyRanking />;
  return (
    <ol className={RANKING_GRID_CLASS}>
      {detail.moves.map((row) => {
        const move = moves.get(row.moveId);
        if (!move) return null;
        return (
          <li key={`${row.rank}-${row.moveId}`} className="grid min-h-14 grid-cols-[1.25rem_minmax(0,1fr)] gap-1.5 border-b border-slate-100 py-2">
            <span className="text-center text-[11px] font-black text-slate-400">{row.rank}</span>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-1">
                <button type="button" onClick={() => onSelectMove(move)} className="min-w-0 truncate text-left text-xs font-bold text-blue-800 underline decoration-blue-200 underline-offset-2" title={`${move.nameJa}の詳細を表示`}>{move.nameJa}</button>
                <UsageValue value={row.percentageValue} fallback={row.percentage} />
              </div>
              <div className="mt-1 flex items-center gap-1"><TypeBadge type={move.type} /><DamageClassBadge damageClass={move.damageClass} /></div>
              <PercentageBar value={row.percentageValue} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ItemRankings({ detail }: { detail: UsageFormatDetail }) {
  if (!detail.items.length) return <EmptyRanking />;
  return (
    <ol className={RANKING_GRID_CLASS}>
      {detail.items.map((row) => (
        <li key={`${row.rank}-${row.nameJa}`} className="grid min-h-12 grid-cols-[1.25rem_minmax(0,1fr)] gap-1.5 border-b border-slate-100 py-2">
          <span className="text-center text-[11px] font-black text-slate-400">{row.rank}</span>
          <div className="min-w-0"><div className="flex gap-1"><p className="min-w-0 flex-1 truncate text-xs font-bold" title={row.nameJa}>{row.nameJa}</p><UsageValue value={row.percentageValue} fallback={row.percentage} /></div><PercentageBar value={row.percentageValue} /></div>
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
        <li key={`${row.rank}-${row.raw}`} className="py-2">
          <div className="flex items-start gap-2">
            <span className="w-6 shrink-0 text-center text-xs font-black text-slate-400">{row.rank}</span>
            <div className="min-w-0 flex-1">
              <p className="break-words text-xs font-bold">
                {row.hp ?? "—"}-{row.attack ?? "—"}-{row.defense ?? "—"}-{row.specialAttack ?? "—"}-{row.specialDefense ?? "—"}-{row.speed ?? "—"}
              </p>
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
    <ol className={RANKING_GRID_CLASS}>
      {detail.natures.map((row) => (
        <li key={`${row.rank}-${row.nameJa}`} className="grid min-h-12 grid-cols-[1.25rem_minmax(0,1fr)] gap-1.5 border-b border-slate-100 py-2">
          <span className="text-center text-[11px] font-black text-slate-400">{row.rank}</span>
          <div className="min-w-0">
            <div className="flex gap-1"><p className="min-w-0 flex-1 truncate text-xs font-bold">{row.nameJa}</p><UsageValue value={row.percentageValue} fallback={row.percentage} /></div>
            <p className="text-[10px] text-slate-500">{row.statUp && row.statDown ? `${row.statUp}↑ / ${row.statDown}↓` : "能力補正なし"}</p>
            <PercentageBar value={row.percentageValue} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function AbilityRankings({ detail }: { detail: UsageFormatDetail }) {
  if (!detail.abilities.length) return <EmptyRanking />;
  return (
    <ol className={RANKING_GRID_CLASS}>
      {detail.abilities.map((row) => (
        <li key={`${row.rank}-${row.nameJa}`} className="grid min-h-12 grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-1.5 border-b border-slate-100 py-2">
          <span className="text-center text-[11px] font-black text-slate-400">{row.rank}</span>
          <p className="min-w-0 truncate text-xs font-bold" title={row.nameJa}>{row.nameJa}</p>
        </li>
      ))}
    </ol>
  );
}

function TeammateRankings({ detail, format }: { detail: UsageFormatDetail; format: BattleFormat }) {
  if (!detail.teammates.length) return <EmptyRanking />;
  return (
    <ol className={RANKING_GRID_CLASS}>
      {detail.teammates.map((row) => (
        <li key={`${row.rank}-${row.pokemonId}`}>
          <Link href={`/usage-ranking/${row.pokemonId}/?format=${formatQuery(format)}`} className="grid min-h-14 grid-cols-[1.25rem_2.25rem_minmax(0,1fr)_auto] items-center gap-1.5 border-b border-slate-100 py-1.5 focus-visible:outline-2 focus-visible:outline-blue-600">
            <span className="text-center text-[11px] font-black text-slate-400">{row.rank}</span>
            <PokemonImage src={row.sprite} name={row.displayNameJa} size={44} />
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold" title={row.displayNameJa}>{row.displayNameJa}</span>
            </span>
            <UsageValue value={row.percentageValue} fallback={row.percentage} />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function LearnableMoves({ moves, topMoveIds, onSelectMove }: { moves: UsageMoveDetail[]; topMoveIds: Set<string>; onSelectMove: (move: UsageMoveDetail) => void }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [damageClass, setDamageClass] = useState<DamageClass | "all">("all");
  const [sort, setSort] = useState<UsageMoveSort>("type");

  const filtered = useMemo(
    () => filterAndSortUsageMoves(moves, { query, type, damageClass, sort }),
    [damageClass, moves, query, sort, type],
  );

  return (
    <>
      <p className="text-[11px] leading-4 text-slate-500">TOP10は、現在の対戦データで採用率上位10位以内の技です。</p>
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
          <option value="type">タイプ順</option><option value="name">技名順</option><option value="power">威力が高い順</option><option value="pp">PPが多い順</option>
        </select>
      </div>
      <p className="mt-3 text-xs text-slate-500">{filtered.length}件</p>
      <ul className="mt-1 divide-y divide-slate-100">
        {filtered.map((move) => (
          <li key={move.id} className="py-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <button type="button" onClick={() => onSelectMove(move)} className="min-w-0 flex-1 basis-32 truncate text-left text-xs font-bold text-blue-800 underline decoration-blue-200 underline-offset-2" title={`${move.nameJa}の詳細を表示`}>{move.nameJa}</button>
              <p className="shrink-0 text-[10px] text-slate-500">威力 {move.power ?? "—"}　命中 {move.alwaysHits ? "必中" : move.accuracy ?? "—"}　PP {move.pp ?? "—"}</p>
              <div className="flex w-full items-center gap-1">
                <TypeBadge type={move.type} /><DamageClassBadge damageClass={move.damageClass} />
                {topMoveIds.has(move.id) && <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">TOP10</span>}
              </div>
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
  useToolView("usage-ranking", format);
  const changeFormat = (next: BattleFormat) => {
    if (next === format) return;
    pushDataLayer({ event: "battle_format_change", tool_name: "usage-ranking", battle_format: next });
    router.replace(`${pathname}?format=${formatQuery(next)}`, { scroll: false });
  };
  const detail = pokemon.formats[format];
  const moves = useMemo(() => new Map(pokemon.learnableMoves.map((move) => [move.id, move])), [pokemon.learnableMoves]);
  const topMoveIds = useMemo(() => new Set(detail.moves.map((move) => move.moveId)), [detail.moves]);
  const [activeSection, setActiveSection] = useState("moves");
  const [selectedMove, setSelectedMove] = useState<UsageMoveDetail | null>(null);
  const detailOpenSent = useRef(false);
  const openMoveDetail = (move: UsageMoveDetail) => {
    pushDataLayer({ event: "move_detail_open", move_name: move.nameJa, pokemon_name: pokemon.displayNameJa, tool_name: "usage-ranking", battle_format: format });
    setSelectedMove(move);
  };

  useEffect(() => {
    if (detailOpenSent.current) return;
    detailOpenSent.current = true;
    pushDataLayer({ event: "pokemon_detail_open", pokemon_name: pokemon.displayNameJa, tool_name: "usage-ranking", battle_format: format });
  }, [format, pokemon.displayNameJa]);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = SECTIONS.reduce<string>((active, [id]) => {
          const top = document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
          return top <= 64 ? id : active;
        }, SECTIONS[0][0]);
        setActiveSection(current);
      });
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  return (
    <div>
      <Link href={`/usage-ranking/?format=${formatQuery(format)}`} className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">← 使用率ランキング</Link>
      <div className="mt-2 flex items-center gap-4">
        <PokemonImage src={pokemon.sprite} name={pokemon.displayNameJa} size={96} />
        <div className="min-w-0 flex-1">
          <h1 className="break-words text-2xl font-black">{pokemon.displayNameJa}</h1>
          <div className="mt-2 flex flex-wrap gap-1">{pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
          <p className="mt-2 text-sm font-bold text-blue-700">{format === "Singles" ? "シングル" : "ダブル"} 第{detail.rank ?? "—"}位</p>
          <BaseStats stats={pokemon.baseStats} />
        </div>
      </div>
      <div className="mt-5"><FormatToggle value={format} onChange={changeFormat} /></div>
      <MegaBaseStats pokemon={pokemon} />
      <nav aria-label="詳細セクション" className="sticky top-0 z-30 -mx-3 mt-3 flex gap-1 overflow-x-auto border-y border-slate-200 bg-white/95 px-3 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur">
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.replaceState(null, "", `#${id}`);
              setActiveSection(id);
            }}
            aria-current={activeSection === id ? "location" : undefined}
            className={`min-h-8 shrink-0 rounded-full px-2.5 py-1.5 transition ${activeSection === id ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700"}`}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="mt-3 space-y-3">
        <RankingSection id="moves" title="使用技" note="TOP10"><MoveRankings detail={detail} moves={moves} onSelectMove={openMoveDetail} /></RankingSection>
        <RankingSection id="items" title="持ち物" note="TOP10"><ItemRankings detail={detail} /></RankingSection>
        <RankingSection id="spreads" title="努力値" note="HP-こうげき-ぼうぎょ-とくこう-とくぼう-すばやさ"><SpreadRankings detail={detail} /></RankingSection>
        <RankingSection id="natures" title="性格" note="TOP10"><NatureRankings detail={detail} /></RankingSection>
        <RankingSection id="abilities" title="特性" note="TOP10"><AbilityRankings detail={detail} /></RankingSection>
        <RankingSection id="teammates" title="一緒に使われているポケモン" note="TOP10"><TeammateRankings detail={detail} format={format} /></RankingSection>
        <RankingSection id="learnset" title="覚える技一覧"><LearnableMoves moves={pokemon.learnableMoves} topMoveIds={topMoveIds} onSelectMove={openMoveDetail} /></RankingSection>
      </div>
      <MoveDetailSheet move={selectedMove} onClose={() => setSelectedMove(null)} />
    </div>
  );
}
