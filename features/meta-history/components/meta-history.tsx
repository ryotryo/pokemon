"use client";

import { useMemo, useState } from "react";
import type { BattleFormat } from "@/lib/champions/types";
import {
  initialMetaHistorySelection,
  latestTopPokemon,
  rankSegments,
  topRankRisers,
  topThirtyCandidates,
  type MetaHistoryDataset,
  type MetaHistoryPokemon,
} from "@/lib/champions/meta-history";
import { FormatToggle } from "@/features/usage-ranking/components/format-toggle";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";

const COLORS = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#ea580c", "#0891b2", "#be185d", "#4f46e5", "#65a30d", "#9333ea", "#0f766e", "#b45309"];
const LEFT = 42;
const RIGHT = 22;
const TOP = 24;
const PLOT_HEIGHT = 360;
const BOTTOM = 42;
const DAY_WIDTH = 66;
const OUT_OF_RANGE = 31;

function colorForIndex(index: number) {
  return COLORS[index] ?? `hsl(${Math.round((index * 137.5) % 360)} 68% 43%)`;
}

function shortDate(value: string) {
  const [, month, day] = value.split("-").map(Number);
  return `${month}/${day}`;
}

function longDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${year}/${month}/${day}`;
}

function yForRank(rank: number) {
  return TOP + ((Math.min(rank, OUT_OF_RANGE) - 1) / (OUT_OF_RANGE - 1)) * PLOT_HEIGHT;
}

function xForIndex(index: number) {
  return LEFT + index * DAY_WIDTH;
}

function pathForSegment(segment: Array<{ index: number; rank: number }>) {
  return segment.map(({ index, rank }, pointIndex) =>
    `${pointIndex === 0 ? "M" : "L"} ${xForIndex(index)} ${yForRank(rank)}`).join(" ");
}

interface ActivePoint {
  pokemon: MetaHistoryPokemon;
  date: string;
  rank: number;
}

export function MetaHistory({ dataset }: { dataset: MetaHistoryDataset }) {
  const [format, setFormat] = useState<BattleFormat>("Singles");
  const [selectedIds, setSelectedIds] = useState(() => initialMetaHistorySelection(dataset, "Singles"));
  const [focusedId, setFocusedId] = useState(() => initialMetaHistorySelection(dataset, "Singles")[0] ?? "");
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);
  const candidates = useMemo(() => topThirtyCandidates(dataset, format), [dataset, format]);
  const selected = useMemo(() => candidates.filter((pokemon) => selectedIds.includes(pokemon.showdownId)), [candidates, selectedIds]);
  const candidateIndex = useMemo(() => new Map(candidates.map((pokemon, index) => [pokemon.showdownId, index])), [candidates]);
  const risers = useMemo(() => topRankRisers(dataset, format), [dataset, format]);
  const chartWidth = LEFT + Math.max(dataset.dates.length - 1, 1) * DAY_WIDTH + RIGHT;
  const chartHeight = TOP + PLOT_HEIGHT + BOTTOM;

  function changeFormat(next: BattleFormat) {
    const initial = initialMetaHistorySelection(dataset, next);
    setFormat(next);
    setSelectedIds(initial);
    setFocusedId(initial[0] ?? "");
    setActivePoint(null);
  }

  function togglePokemon(pokemon: MetaHistoryPokemon, checked: boolean) {
    setSelectedIds((current) => checked
      ? [...current, pokemon.showdownId]
      : current.filter((id) => id !== pokemon.showdownId));
    if (checked) setFocusedId(pokemon.showdownId);
    if (!checked && focusedId === pokemon.showdownId) setFocusedId("");
  }

  function toggleLatestTop(limit: 10 | 20 | 30) {
    const ids = latestTopPokemon(dataset, format, limit).map((pokemon) => pokemon.showdownId);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allSelected
      ? current.filter((id) => !ids.includes(id))
      : [...new Set([...current, ...ids])]);
    if (!allSelected && ids[0]) setFocusedId(ids[0]);
    if (allSelected && ids.includes(focusedId)) setFocusedId("");
  }

  return (
    <div className="space-y-5">
      <FormatToggle value={format} onChange={changeFormat} />

      <section aria-labelledby="history-chart-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="history-chart-title" className="font-black">順位推移グラフ</h2>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">1位が上です。31位以下は「圏外」にまとめ、タップ時に実順位を表示します。</p>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-slate-500">{format === "Singles" ? "シングル" : "ダブル"}</span>
          </div>
          {activePoint && (
            <div role="status" className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-950">
              <strong>{activePoint.pokemon.displayNameJa}</strong>
              <span className="ml-2">{longDate(activePoint.date)}・第{activePoint.rank}位{activePoint.rank > 30 ? "（圏外）" : ""}</span>
            </div>
          )}
        </div>

        <div className="flex max-h-24 flex-wrap gap-x-3 gap-y-1.5 overflow-y-auto px-4 py-2.5" aria-label="表示中のポケモン">
          {selected.map((pokemon) => {
            const color = colorForIndex(candidateIndex.get(pokemon.showdownId) ?? 0);
            return (
              <button
                key={pokemon.showdownId}
                type="button"
                onClick={() => setFocusedId(pokemon.showdownId)}
                className={`inline-flex min-h-7 items-center gap-1.5 rounded-full px-2 text-[11px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${focusedId === pokemon.showdownId ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                {pokemon.displayNameJa}
              </button>
            );
          })}
        </div>

        <div className="flex border-t border-slate-100">
          <aside className="w-28 shrink-0 border-r border-slate-200 bg-slate-50/95" aria-label="最初の記録日の順位">
            <div className="border-b border-slate-200 px-2 py-2">
              <p className="text-[10px] font-bold text-slate-500">始点</p>
              <p className="text-xs font-black text-slate-800">{shortDate(dataset.dates[0])}</p>
            </div>
            <div className="max-h-[378px] overflow-y-auto px-1.5 py-1">
              {selected.map((pokemon) => {
                const rank = pokemon.ranks[format][0];
                const color = colorForIndex(candidateIndex.get(pokemon.showdownId) ?? 0);
                return (
                  <button
                    key={pokemon.showdownId}
                    type="button"
                    onClick={() => setFocusedId(pokemon.showdownId)}
                    className={`grid min-h-8 w-full grid-cols-[0.5rem_minmax(0,1fr)_auto] items-center gap-1 rounded-md px-1 text-left focus-visible:outline-2 focus-visible:outline-blue-600 ${focusedId === pokemon.showdownId ? "bg-white shadow-sm" : ""}`}
                    aria-label={`${pokemon.displayNameJa}の開始順位、${rank === null ? "データなし" : `第${rank}位`}`}
                  >
                    <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="truncate text-[10px] font-bold text-slate-700">{pokemon.displayNameJa}</span>
                    <span className="text-[10px] font-black text-slate-600">{rank === null ? "—" : `${rank}位`}</span>
                  </button>
                );
              })}
            </div>
          </aside>
          <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain" aria-label="順位推移グラフ。横方向にスクロールできます">
            <svg width={chartWidth} height={chartHeight} role="img" aria-labelledby="history-chart-title">
            {[1, 5, 10, 15, 20, 25, 30, 31].map((rank) => {
              const y = yForRank(rank);
              return (
                <g key={rank}>
                  <line x1={LEFT} x2={chartWidth - RIGHT} y1={y} y2={y} stroke={rank === 31 ? "#94a3b8" : "#e2e8f0"} strokeDasharray={rank === 31 ? "4 4" : undefined} />
                  <text x={LEFT - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">{rank === 31 ? "圏外" : rank}</text>
                </g>
              );
            })}
            {dataset.dates.map((date, index) => (
              <g key={date}>
                <line x1={xForIndex(index)} x2={xForIndex(index)} y1={TOP} y2={TOP + PLOT_HEIGHT} stroke="#f1f5f9" />
                <text x={xForIndex(index)} y={TOP + PLOT_HEIGHT + 24} textAnchor="middle" fontSize="10" fill="#64748b">{shortDate(date)}</text>
              </g>
            ))}
            {selected.map((pokemon) => {
              const color = colorForIndex(candidateIndex.get(pokemon.showdownId) ?? 0);
              const focused = focusedId === pokemon.showdownId;
              const segments = rankSegments(pokemon.ranks[format]);
              return (
                <g key={pokemon.showdownId} opacity={focused || !focusedId ? 1 : 0.48}>
                  {segments.map((segment, index) => (
                    <path
                      key={index}
                      d={pathForSegment(segment)}
                      fill="none"
                      stroke={color}
                      strokeWidth={focused ? 4 : 2.25}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={segment.some(({ rank }) => rank > 30) ? "5 3" : undefined}
                    />
                  ))}
                  {pokemon.ranks[format].map((rank, index) => rank === null ? null : (
                    <circle
                      key={dataset.dates[index]}
                      cx={xForIndex(index)}
                      cy={yForRank(rank)}
                      r={focused ? 5 : 3.5}
                      fill={color}
                      stroke="white"
                      strokeWidth="1.5"
                      tabIndex={0}
                      role="button"
                      aria-label={`${pokemon.displayNameJa}、${longDate(dataset.dates[index])}、第${rank}位`}
                      onClick={() => {
                        setFocusedId(pokemon.showdownId);
                        setActivePoint({ pokemon, date: dataset.dates[index], rank });
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setFocusedId(pokemon.showdownId);
                          setActivePoint({ pokemon, date: dataset.dates[index], rank });
                        }
                      }}
                    >
                      <title>{`${pokemon.displayNameJa} ${longDate(dataset.dates[index])} 第${rank}位`}</title>
                    </circle>
                  ))}
                </g>
              );
            })}
            </svg>
          </div>
        </div>
        <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">左右にスクロールして日付を確認できます。</p>
      </section>

      <section aria-labelledby="rank-risers-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="rank-risers-title" className="font-black">ランク上昇 TOP3</h2>
            <p className="mt-1 text-[11px] text-slate-500">{shortDate(dataset.dates[0])}から{shortDate(dataset.dates.at(-1)!)}までの順位差</p>
          </div>
          <span className="shrink-0 text-[11px] font-bold text-slate-500">{format === "Singles" ? "シングル" : "ダブル"}</span>
        </div>
        <ol className="mt-3 divide-y divide-slate-100">
          {risers.map((entry, index) => (
            <li key={entry.pokemon.showdownId} className="grid min-h-14 grid-cols-[1.5rem_2.75rem_minmax(0,1fr)_auto] items-center gap-2 py-1.5">
              <span className="text-center text-xs font-black text-slate-400">{index + 1}</span>
              <PokemonImage src={entry.pokemon.sprite} name={entry.pokemon.displayNameJa} size={44} />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{entry.pokemon.displayNameJa}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{entry.startRank}位 → {entry.latestRank}位</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">↑{entry.rise}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pokemon-selector-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="pokemon-selector-title" className="font-black">表示ポケモン</h2>
            <p className="mt-1 text-[11px] text-slate-500">M4の記録期間中に一度でもTOP30に入ったポケモン</p>
          </div>
          <span className="shrink-0 text-xs font-bold text-blue-700">{selected.length}匹表示中</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="最新日の順位で一括選択">
          {([10, 20, 30] as const).map((limit) => {
            const ids = latestTopPokemon(dataset, format, limit).map((pokemon) => pokemon.showdownId);
            const pressed = ids.every((id) => selectedIds.includes(id));
            return (
              <button
                key={limit}
                type="button"
                aria-pressed={pressed}
                onClick={() => toggleLatestTop(limit)}
                className={`min-h-10 rounded-xl border px-2 text-xs font-black transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${pressed ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}
              >
                TOP{limit}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {candidates.map((pokemon) => {
            const checked = selectedIds.includes(pokemon.showdownId);
            const latestRank = pokemon.ranks[format].at(-1) ?? null;
            const color = colorForIndex(candidateIndex.get(pokemon.showdownId) ?? 0);
            return (
              <div key={pokemon.showdownId} className={`flex min-h-14 items-center gap-2 rounded-xl border px-2.5 py-1.5 ${checked ? "border-blue-200 bg-blue-50/60" : "border-slate-200"}`}>
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => togglePokemon(pokemon, event.target.checked)}
                    className="size-4 shrink-0 accent-blue-700"
                  />
                  <PokemonImage src={pokemon.sprite} name={pokemon.displayNameJa} size={44} />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">{pokemon.displayNameJa}</span>
                    <span className="block text-[10px] text-slate-500">{latestRank === null ? "最新日データなし" : latestRank > 30 ? `最新 第${latestRank}位（圏外）` : `最新 第${latestRank}位`}</span>
                  </span>
                </label>
                {checked && (
                  <button
                    type="button"
                    aria-label={`${pokemon.displayNameJa}の線を強調`}
                    onClick={() => setFocusedId(pokemon.showdownId)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
