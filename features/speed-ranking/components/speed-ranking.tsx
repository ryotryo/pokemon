"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { calculateEffectiveBaseSpeed, calculateModifiedSpeed, SPEED_MULTIPLIERS, type SpeedRankingDataset, type SpeedRankingPokemon } from "@/lib/champions/speed-ranking";
import { SPEED_POINTS, SpeedBand } from "./speed-band";

type BattleFormat = "Singles" | "Doubles";
type SortMode = "speed" | "usage";

const statLabels = [
  ["decreasingMin", "最遅（性格下降補正＋努力値0）"],
  ["neutral", "無振り（性格補正なし＋努力値0）"],
  ["neutralMax", "準速（性格補正なし＋努力値252）"],
  ["increasingMax", "最速（性格上昇補正＋努力値252）"],
] as const;

const baseStatLabels = [
  ["hp", "HP"],
  ["attack", "こうげき"],
  ["defense", "ぼうぎょ"],
  ["specialAttack", "とくこう"],
  ["specialDefense", "とくぼう"],
  ["speed", "すばやさ"],
] as const;

export function SpeedRanking({ dataset }: { dataset: SpeedRankingDataset }) {
  const [format, setFormat] = useState<BattleFormat>("Singles");
  const [sortMode, setSortMode] = useState<SortMode>("speed");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SpeedRankingPokemon | null>(null);

  const pokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ja");
    return dataset.pokemon
      .filter((entry) => !normalizedQuery || entry.displayNameJa.toLocaleLowerCase("ja").includes(normalizedQuery) || entry.name.toLowerCase().includes(normalizedQuery) || entry.id.includes(normalizedQuery))
      .sort((a, b) => {
        if (sortMode === "usage") {
          const rankDifference = (a.usageRanks[format] ?? Number.MAX_SAFE_INTEGER) - (b.usageRanks[format] ?? Number.MAX_SAFE_INTEGER);
          if (rankDifference) return rankDifference;
        } else {
          const speedDifference = b.baseSpeed - a.baseSpeed;
          if (speedDifference) return speedDifference;
        }
        return a.displayNameJa.localeCompare(b.displayNameJa, "ja");
      });
  }, [dataset.pokemon, format, query, sortMode]);

  return (
    <>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setSortMode("speed")} className={`min-h-10 flex-1 rounded-xl px-3 text-sm font-bold ${sortMode === "speed" ? "bg-blue-700 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>すばやさ順</button>
          <button type="button" onClick={() => setSortMode("usage")} className={`min-h-10 flex-1 rounded-xl px-3 text-sm font-bold ${sortMode === "usage" ? "bg-blue-700 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>使用率順</button>
        </div>
        {sortMode === "usage" && (
          <div className="grid grid-cols-2 rounded-xl bg-slate-200 p-1" aria-label="バトル形式">
            {(["Singles", "Doubles"] as const).map((value) => (
              <button key={value} type="button" onClick={() => setFormat(value)} className={`min-h-10 rounded-lg text-sm font-bold ${format === value ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}>
                {value === "Singles" ? "シングル" : "ダブル"}
              </button>
            ))}
          </div>
        )}
        <label className="block">
          <span className="sr-only">ポケモン名で検索</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="ポケモン名で検索" className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
      </div>

      <div className="sticky top-0 z-20 -mx-1 mt-3 grid h-8 grid-cols-4 items-center gap-1 border-y border-slate-200/80 bg-slate-50/90 px-2 text-center text-[10px] font-bold text-slate-600 shadow-sm backdrop-blur-md">
        {SPEED_POINTS.map((point) => <span key={point.key} className="flex min-w-0 items-center justify-center gap-1"><span className={`size-3 shrink-0 rounded-full border-2 border-white shadow-sm ${point.color}`} /><span>{point.label.split("（")[0]}</span></span>)}
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,9rem)_3.5rem_minmax(6rem,1fr)] items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
          <span>ポケモン</span><span className="text-center">種族値</span><span>実数値帯</span>
        </div>
        {pokemon.map((entry) => (
          <button key={entry.id} type="button" onClick={() => setSelected(entry)} className="grid min-h-[68px] w-full grid-cols-[minmax(0,9rem)_3.5rem_minmax(6rem,1fr)] items-center gap-2 border-b border-slate-100 px-3 text-left last:border-b-0 active:bg-blue-50" style={{ contentVisibility: "auto", containIntrinsicSize: "68px" }}>
            <span className="flex min-w-0 items-center gap-2">
              <Image src={entry.sprite} alt="" width={42} height={42} unoptimized className="size-10 shrink-0 object-contain" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{entry.displayNameJa}</span>
                {sortMode === "usage" && entry.usageRanks[format] && <span className="block text-[10px] text-slate-500">使用率 {entry.usageRanks[format]}位</span>}
              </span>
            </span>
            <span className="text-center text-base font-black tabular-nums">{entry.baseSpeed}</span>
            <SpeedBand stats={entry.stats} scale={dataset.scale} showValues />
          </button>
        ))}
        {pokemon.length === 0 && <p className="px-4 py-10 text-center text-sm text-slate-500">該当するポケモンがいません。</p>}
      </div>

      <Sheet open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <SheetOverlay onClick={() => setSelected(null)} />
        <SheetContent>
          {selected && (
            <div className="pb-2">
              <div className="flex items-center gap-4">
                <Image src={selected.sprite} alt="" width={88} height={88} unoptimized className="size-20 object-contain" />
                <div><p className="text-xs font-bold text-blue-700">すばやさ詳細</p><h2 className="mt-1 text-2xl font-black">{selected.displayNameJa}</h2></div>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                {baseStatLabels.map(([key, label]) => (
                  <div key={key} className="flex min-w-0 items-baseline justify-between gap-1">
                    <dt className="truncate text-[10px] font-medium text-slate-500">{label}</dt>
                    <dd className="text-xs font-bold tabular-nums text-slate-700">{selected.baseStats[key]}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-baseline justify-between"><span className="font-bold">すばやさ種族値</span><strong className="text-2xl tabular-nums">{selected.baseSpeed}</strong></div>
                <div className="mt-4"><SpeedBand stats={selected.stats} scale={dataset.scale} showValues /></div>
              </div>
              <dl className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                {statLabels.map(([key, label], index) => (
                  <div key={key} className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="flex items-center gap-2 text-sm text-slate-600"><span className={`size-3 shrink-0 rounded-full border-2 border-white shadow-sm ${SPEED_POINTS[index].color}`} />{label}</dt><dd className={`font-black tabular-nums ${SPEED_POINTS[index].textColor}`}>{selected.stats[key]}</dd>
                  </div>
                ))}
              </dl>
              <div className="my-5 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-slate-200" /><span className="text-xs font-bold text-slate-400">速度補正比較</span><span className="h-px flex-1 bg-slate-200" /></div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[5.25rem_repeat(3,minmax(0,1fr))] items-end bg-slate-50 text-center text-[10px] font-bold leading-tight text-slate-600">
                  <span className="px-2 py-3 text-left">状態</span>
                  {SPEED_MULTIPLIERS.map((modifier) => (
                    <span key={modifier.id} className="px-1 py-3">
                      <span className="block">{modifier.label}</span>
                      {modifier.note && <span className="mt-0.5 block text-[8px] font-medium">{modifier.note}</span>}
                    </span>
                  ))}
                </div>
                {statLabels.map(([key], index) => (
                  <div key={key} className="grid min-h-16 grid-cols-[5.25rem_repeat(3,minmax(0,1fr))] items-center border-t border-slate-100 text-center">
                    <span className={`flex items-center gap-1.5 px-2 text-xs font-bold ${SPEED_POINTS[index].textColor}`}><span className={`size-3 shrink-0 rounded-full border-2 border-white shadow-sm ${SPEED_POINTS[index].color}`} />{SPEED_POINTS[index].label.split("（")[0]}</span>
                    {SPEED_MULTIPLIERS.map((modifier) => (
                      <span key={modifier.id} className="min-w-0 px-0.5">
                        <strong className="block text-sm tabular-nums">{calculateModifiedSpeed(selected.stats[key], modifier.multiplier)}</strong>
                        <small className="mt-1 block whitespace-nowrap text-[8px] text-slate-500">約{calculateEffectiveBaseSpeed(selected.baseSpeed, modifier.multiplier)}族</small>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-500">上段は実数値、下段の「約○○族」は実質種族値です。</p>
              <p className="mt-4 text-xs leading-5 text-slate-500">レベル50・個体値最大で計算。努力値252はポケモンチャンピオンズのステータスポイント32に相当します。</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
