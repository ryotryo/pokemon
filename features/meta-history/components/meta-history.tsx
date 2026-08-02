"use client";

import { useMemo, useState } from "react";
import { pushDataLayer, useToolView } from "@/lib/analytics";
import type { BattleFormat } from "@/lib/champions/types";
import {
  latestRankBand,
  rankSegments,
  topRankFallers,
  topRankRisers,
  type MetaHistoryDataset,
  type MetaHistoryPokemon,
} from "@/lib/champions/meta-history";
import { FormatToggle } from "@/features/usage-ranking/components/format-toggle";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";

const COLORS = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#ea580c", "#0891b2", "#be185d", "#4f46e5", "#65a30d", "#9333ea", "#0f766e", "#b45309"];
const RIGHT = 22;
const START_WIDTH = 24;
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
  return index * DAY_WIDTH;
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
  const [rankBand, setRankBand] = useState<1 | 11 | 21>(1);
  const [focusedId, setFocusedId] = useState("");
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);
  useToolView("meta-history", format);
  const selected = useMemo(() => latestRankBand(dataset, format, rankBand), [dataset, format, rankBand]);
  const candidateIndex = useMemo(() => new Map(selected.map((pokemon, index) => [pokemon.showdownId, index])), [selected]);
  const risers = useMemo(() => topRankRisers(dataset, format), [dataset, format]);
  const fallers = useMemo(() => topRankFallers(dataset, format), [dataset, format]);
  const chartWidth = Math.max(dataset.dates.length - 1, 1) * DAY_WIDTH + RIGHT;
  const chartHeight = TOP + PLOT_HEIGHT + BOTTOM;

  function changeFormat(next: BattleFormat) {
    if (next === format) return;
    pushDataLayer({ event: "battle_format_change", tool_name: "meta-history", battle_format: next });
    setFormat(next);
    setFocusedId("");
    setActivePoint(null);
  }

  function changeRankBand(next: 1 | 11 | 21) {
    setRankBand(next);
    setFocusedId("");
    setActivePoint(null);
  }

  return (
    <div className="space-y-5">
      <FormatToggle value={format} onChange={changeFormat} />

      <section aria-labelledby="history-chart-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="history-chart-title" className="font-black">順位推移グラフ（{dataset.season}）</h2>
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
          <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="最新日の順位帯">
            {([1, 11, 21] as const).map((startRank) => {
              const selectedBand = rankBand === startRank;
              return (
                <button
                  key={startRank}
                  type="button"
                  aria-pressed={selectedBand}
                  onClick={() => changeRankBand(startRank)}
                  className={`min-h-10 rounded-xl border px-2 text-xs font-black transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${selectedBand ? "border-blue-700 bg-blue-700 text-white" : "border-blue-200 bg-white text-blue-700"}`}
                >
                  {startRank}〜{startRank + 9}位
                </button>
              );
            })}
          </div>
          <div className="mt-2 grid grid-cols-10 gap-1" aria-label="グラフに表示中のポケモン">
            {selected.map((pokemon, index) => {
              const color = colorForIndex(index);
              const focused = focusedId === pokemon.showdownId;
              return (
                <button
                  key={pokemon.showdownId}
                  type="button"
                  aria-label={`${pokemon.displayNameJa}の線を${focused ? "通常表示に戻す" : "強調する"}`}
                  aria-pressed={focused}
                  onClick={() => setFocusedId(focused ? "" : pokemon.showdownId)}
                  className={`flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-md border-2 bg-white p-0.5 transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 ${focused ? "shadow-md ring-1 ring-slate-900/20" : ""}`}
                  style={{ borderColor: color }}
                >
                  <PokemonImage src={pokemon.sprite} name={pokemon.displayNameJa} size={24} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex border-t border-slate-100">
          <svg width={START_WIDTH} height={chartHeight} className="relative z-10 shrink-0 bg-white" aria-label={`${longDate(dataset.dates[0])}の始点`}>
            {selected.map((pokemon) => {
              const rank = pokemon.ranks[format][0];
              if (rank === null) return null;
              const color = colorForIndex(candidateIndex.get(pokemon.showdownId) ?? 0);
              const focused = focusedId === pokemon.showdownId;
              return (
                <g key={pokemon.showdownId} opacity={focused || !focusedId ? 1 : 0.48}>
                  {pokemon.ranks[format][1] !== null && (
                    <line x1={START_WIDTH / 2} x2={START_WIDTH} y1={yForRank(rank)} y2={yForRank(rank)} stroke={color} strokeWidth={focused ? 4 : 2.25} />
                  )}
                  <circle
                    cx={START_WIDTH / 2}
                    cy={yForRank(rank)}
                    r="10"
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    className="cursor-pointer"
                    aria-label={`${pokemon.displayNameJa}、${longDate(dataset.dates[0])}、第${rank}位`}
                    onClick={() => {
                      setFocusedId(pokemon.showdownId);
                      setActivePoint({ pokemon, date: dataset.dates[0], rank });
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setFocusedId(pokemon.showdownId);
                        setActivePoint({ pokemon, date: dataset.dates[0], rank });
                      }
                    }}
                  />
                  <circle
                    cx={START_WIDTH / 2}
                    cy={yForRank(rank)}
                    r={focused ? 5 : 3.5}
                    fill={color}
                    stroke="white"
                    strokeWidth="1.5"
                    pointerEvents="none"
                  />
                </g>
              );
            })}
          </svg>
          <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain" aria-label="順位推移グラフ。横方向にスクロールできます">
            <svg width={chartWidth} height={chartHeight} role="img" aria-labelledby="history-chart-title">
            {[1, 5, 10, 15, 20, 25, 30, 31].map((rank) => {
              const y = yForRank(rank);
              return (
                <g key={rank}>
                  <line x1={0} x2={chartWidth - RIGHT} y1={y} y2={y} stroke={rank === 31 ? "#94a3b8" : "#e2e8f0"} strokeDasharray={rank === 31 ? "4 4" : undefined} />
                  <text x={4} y={y + 4} textAnchor="start" fontSize="10" fill="#64748b">{rank === 31 ? "圏外" : rank}</text>
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
                  {pokemon.ranks[format].map((rank, index) => rank === null || index === 0 ? null : (
                    <g key={dataset.dates[index]}>
                      <circle
                        cx={xForIndex(index)}
                        cy={yForRank(rank)}
                        r="10"
                        fill="transparent"
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer"
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
                      <circle
                        cx={xForIndex(index)}
                        cy={yForRank(rank)}
                        r={focused ? 5 : 3.5}
                        fill={color}
                        stroke="white"
                        strokeWidth="1.5"
                        pointerEvents="none"
                      />
                    </g>
                  ))}
                </g>
              );
            })}
            </svg>
          </div>
        </div>
        <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">左右にスクロールして日付を確認できます。</p>
      </section>

      <RankChangeSection
        id="rank-risers-title"
        title="ランク上昇 TOP5"
        entries={risers}
        direction="up"
        format={format}
        startDate={dataset.dates[0]}
        latestDate={dataset.dates.at(-1)!}
      />

      <RankChangeSection
        id="rank-fallers-title"
        title="ランク下降 TOP5"
        entries={fallers}
        direction="down"
        format={format}
        startDate={dataset.dates[0]}
        latestDate={dataset.dates.at(-1)!}
      />

    </div>
  );
}

function RankChangeSection({
  id,
  title,
  entries,
  direction,
  format,
  startDate,
  latestDate,
}: {
  id: string;
  title: string;
  entries: ReturnType<typeof topRankRisers>;
  direction: "up" | "down";
  format: BattleFormat;
  startDate: string;
  latestDate: string;
}) {
  const rising = direction === "up";
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id={id} className="font-black">{title}</h2>
            <p className="mt-1 text-[11px] text-slate-500">{shortDate(startDate)}から{shortDate(latestDate)}までの順位差</p>
          </div>
          <span className="shrink-0 text-[11px] font-bold text-slate-500">{format === "Singles" ? "シングル" : "ダブル"}</span>
        </div>
        <ol className="mt-3 divide-y divide-slate-100">
          {entries.map((entry, index) => (
            <li key={entry.pokemon.showdownId} className="grid min-h-14 grid-cols-[1.5rem_2.75rem_minmax(0,1fr)_auto] items-center gap-2 py-1.5">
              <span className="text-center text-xs font-black text-slate-400">{index + 1}</span>
              <PokemonImage src={entry.pokemon.sprite} name={entry.pokemon.displayNameJa} size={44} />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{entry.pokemon.displayNameJa}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{entry.startRank}位 → {entry.latestRank}位</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-black ${rising ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {rising ? "↑" : "↓"}{entry.change}
              </span>
            </li>
          ))}
        </ol>
    </section>
  );
}
