"use client";

import { useMemo, useState } from "react";
import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
import { pushDataLayer, useToolView } from "@/lib/analytics";
import {
  ATTACK_PATTERNS,
  DEFENSE_PATTERNS,
  calculateDamage,
  damageBarColor,
  type DamageChartDataset,
  type DamageChartMove,
  type DamageChartPokemon,
} from "@/lib/champions/damage-chart";
import type { BattleFormat } from "@/lib/champions/types";

const FORMAT_LABELS: Record<BattleFormat, string> = { Singles: "シングル", Doubles: "ダブル" };

function formatPercent(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function PokemonSummary({ pokemon, label }: { pokemon: DamageChartPokemon; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-2 py-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- Champions Battle Data provides form-specific sprites. */}
      <img src={pokemon.sprite} alt="" className="size-10 shrink-0 object-contain" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400">{label}</p>
        <p className="truncate text-xs font-black">{pokemon.displayNameJa}</p>
        <div className="mt-0.5 flex gap-1">{pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
      </div>
    </div>
  );
}

function DamageCell({ result }: { result: ReturnType<typeof calculateDamage> }) {
  return (
    <div className="min-w-0 px-0.5 py-1 text-center">
      <p className="whitespace-nowrap text-[9px] font-bold tabular-nums text-slate-700 sm:text-[10px]">
        {formatPercent(result.minPercent)}〜{formatPercent(result.maxPercent)}%
      </p>
      <div className="mx-auto mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className={`h-full rounded-full ${damageBarColor(result.maxPercent)}`} style={{ width: `${Math.min(100, result.maxPercent)}%` }} />
      </div>
      <p className="mt-0.5 text-[9px] font-black text-slate-500">{result.hitLabel}</p>
    </div>
  );
}

function MoveDamageGrid({ attacker, defender, move }: { attacker: DamageChartPokemon; defender: DamageChartPokemon; move: DamageChartMove }) {
  const physical = move.damageClass === "physical";
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 px-3 py-2">
        <h4 className="mr-auto text-sm font-black">{move.nameJa}</h4>
        <TypeBadge type={move.type} />
        <DamageClassBadge damageClass={move.damageClass} />
        <span className="text-[10px] font-bold text-slate-500">威力 {move.power}</span>
      </header>
      <div className="grid grid-cols-[2.8rem_repeat(3,minmax(0,1fr))] items-center px-1.5 pb-1.5 pt-1">
        <span className="text-center text-[8px] font-bold text-slate-400">攻＼防</span>
        {DEFENSE_PATTERNS.map((pattern) => (
          <span key={pattern.id} className="px-0.5 text-center text-[8px] font-bold leading-3 text-slate-500 sm:text-[9px]">
            {physical ? pattern.physicalLabel : pattern.specialLabel}
          </span>
        ))}
        {ATTACK_PATTERNS.map((attackPattern) => (
          <div key={attackPattern.id} className="contents">
            <span className="text-center text-[9px] font-black text-blue-700">
              {physical ? attackPattern.physicalLabel : attackPattern.specialLabel}
            </span>
            {DEFENSE_PATTERNS.map((defensePattern) => (
              <DamageCell
                key={defensePattern.id}
                result={calculateDamage({
                  attacker,
                  defender,
                  move,
                  attackEv: attackPattern.ev,
                  attackNature: attackPattern.nature,
                  hpEv: defensePattern.hpEv,
                  defenseEv: defensePattern.defenseEv,
                  defenseNature: defensePattern.nature,
                })}
              />
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}

function DamageDirection({ attacker, defender, format }: { attacker: DamageChartPokemon; defender: DamageChartPokemon; format: BattleFormat }) {
  const moves = attacker.moves[format];
  return (
    <section className="mt-6" aria-labelledby={`${attacker.id}-to-${defender.id}`}>
      <div className="mb-2 flex items-baseline justify-between gap-2 px-1">
        <h3 id={`${attacker.id}-to-${defender.id}`} className="min-w-0 truncate text-base font-black">
          {attacker.displayNameJa} → {defender.displayNameJa}
        </h3>
        <span className="shrink-0 text-[10px] font-bold text-slate-400">使用技TOP10内</span>
      </div>
      {moves.length ? (
        <div className="space-y-2">{moves.map((move) => <MoveDamageGrid key={move.id} attacker={attacker} defender={defender} move={move} />)}</div>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">表示できる通常攻撃技がありません。</p>
      )}
    </section>
  );
}

export function DamageChart({ dataset }: { dataset: DamageChartDataset }) {
  const [format, setFormat] = useState<BattleFormat>("Singles");
  const sorted = useMemo(() => [...dataset.pokemon].sort((a, b) =>
    (a.ranks[format] ?? Number.MAX_SAFE_INTEGER) - (b.ranks[format] ?? Number.MAX_SAFE_INTEGER)
      || a.displayNameJa.localeCompare(b.displayNameJa, "ja")), [dataset.pokemon, format]);
  const [attackerId, setAttackerId] = useState(sorted[0]?.id ?? "");
  const [defenderId, setDefenderId] = useState(sorted[1]?.id ?? sorted[0]?.id ?? "");
  const attacker = dataset.pokemon.find((pokemon) => pokemon.id === attackerId) ?? sorted[0];
  const defender = dataset.pokemon.find((pokemon) => pokemon.id === defenderId) ?? sorted[1] ?? sorted[0];
  useToolView("damage-chart", format);

  function changeFormat(next: BattleFormat) {
    if (next === format) return;
    setFormat(next);
    pushDataLayer({ event: "battle_format_change", tool_name: "damage-chart", battle_format: next });
  }

  if (!attacker || !defender) return <p className="rounded-xl bg-white p-4 text-sm text-slate-500">データを表示できませんでした。</p>;

  return (
    <div>
      <section className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm" aria-label="比較条件">
        <div className="grid grid-cols-2 gap-2">
          <label className="min-w-0 text-[11px] font-bold text-slate-600">
            攻撃側
            <select value={attacker.id} onChange={(event) => setAttackerId(event.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              {sorted.map((pokemon) => <option key={pokemon.id} value={pokemon.id}>{pokemon.displayNameJa}</option>)}
            </select>
          </label>
          <label className="min-w-0 text-[11px] font-bold text-slate-600">
            防御側
            <select value={defender.id} onChange={(event) => setDefenderId(event.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              {sorted.map((pokemon) => <option key={pokemon.id} value={pokemon.id}>{pokemon.displayNameJa}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="バトル形式">
          {(["Singles", "Doubles"] as const).map((value) => (
            <button key={value} type="button" aria-pressed={format === value} onClick={() => changeFormat(value)} className={`h-10 rounded-xl text-xs font-black ${format === value ? "bg-blue-700 text-white" : "border border-blue-200 bg-white text-blue-700"}`}>
              {FORMAT_LABELS[value]}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <PokemonSummary pokemon={attacker} label="攻撃側" />
          <PokemonSummary pokemon={defender} label="防御側" />
        </div>
      </section>

      <div className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-[10px] leading-4 text-blue-900">
        レベル50・個体値31。天候、特性、持ち物などの補正は含みません。A/Cは攻撃側、H/B/Dは防御側の努力値です。
      </div>

      <DamageDirection attacker={attacker} defender={defender} format={format} />
      <DamageDirection attacker={defender} defender={attacker} format={format} />
    </div>
  );
}
