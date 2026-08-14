"use client";

import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
import { FormatToggle } from "@/features/usage-ranking/components/format-toggle";
import { pushDataLayer, useToolView } from "@/lib/analytics";
import {
  ATTACK_PATTERNS,
  DEFENSE_PATTERNS,
  calculateBattleStat,
  calculateDamage,
  calculateHpStat,
  damageBarColor,
  type DamageChartDataset,
  type DamageChartMove,
  type DamageChartPokemon,
} from "@/lib/champions/damage-chart";
import type { BattleFormat } from "@/lib/champions/types";

function formatPercent(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function PokemonSummary({ pokemon, label, onClick }: { pokemon: DamageChartPokemon; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={`${label}の${pokemon.displayNameJa}を変更`} className="flex min-w-0 flex-col items-center rounded-2xl bg-slate-50 px-2 py-2 text-center active:scale-[0.98]">
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- Champions Battle Data provides form-specific sprites. */}
      <img src={pokemon.sprite} alt="" className="size-20 max-w-full object-contain sm:size-24" />
      <p className="w-full truncate text-sm font-black">{pokemon.displayNameJa}</p>
      <div className="mt-1 flex gap-1">{pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
    </button>
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
  const attackBase = physical ? attacker.baseStats.attack : attacker.baseStats.specialAttack;
  const defenseBase = physical ? defender.baseStats.defense : defender.baseStats.specialDefense;
  const statLabel = physical ? "A" : "C";
  const defenseLabel = physical ? "B" : "D";
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 px-3 py-2">
        <h4 className="mr-auto text-sm font-black">{move.nameJa}</h4>
        <TypeBadge type={move.type} />
        <DamageClassBadge damageClass={move.damageClass} />
        <span className="text-[10px] font-bold text-slate-500">威力 {move.power}</span>
      </header>
      <div className="grid grid-cols-[3.1rem_repeat(3,minmax(0,1fr))] items-center px-1 pb-1.5 pt-1">
        <span className="text-center text-[8px] font-bold text-slate-400">攻＼防</span>
        {DEFENSE_PATTERNS.map((pattern) => (
          <span key={pattern.id} className="px-px text-center text-[8px] font-bold leading-[11px] text-slate-500 sm:text-[9px]">
            <span className="block text-slate-700">{physical ? pattern.physicalLabel : pattern.specialLabel}</span>
            <span className="block font-medium">HP {calculateHpStat(defender.baseStats.hp, pattern.hpEv)}</span>
            <span className="block font-medium">{defenseLabel} {calculateBattleStat(defenseBase, pattern.defenseEv, pattern.nature)}</span>
          </span>
        ))}
        {ATTACK_PATTERNS.map((attackPattern) => (
          <div key={attackPattern.id} className="contents">
            <span className="text-center text-[8px] font-black leading-[11px] text-blue-700 sm:text-[9px]">
              <span className="block">{physical ? attackPattern.physicalLabel : attackPattern.specialLabel}</span>
              <span className="block font-bold text-slate-500">{statLabel} {calculateBattleStat(attackBase, attackPattern.ev, attackPattern.nature)}</span>
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
  const [picker, setPicker] = useState<"attacker" | "defender" | null>(null);
  const [query, setQuery] = useState("");
  const attacker = dataset.pokemon.find((pokemon) => pokemon.id === attackerId) ?? sorted[0];
  const defender = dataset.pokemon.find((pokemon) => pokemon.id === defenderId) ?? sorted[1] ?? sorted[0];
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sorted;
    return sorted.filter((pokemon) => pokemon.displayNameJa.toLowerCase().includes(normalizedQuery) || pokemon.id.toLowerCase().includes(normalizedQuery));
  }, [query, sorted]);
  useToolView("damage-chart", format);

  function changeFormat(next: BattleFormat) {
    if (next === format) return;
    setFormat(next);
    pushDataLayer({ event: "battle_format_change", tool_name: "damage-chart", battle_format: next });
  }

  function choosePokemon(id: string) {
    if (picker === "attacker") setAttackerId(id);
    if (picker === "defender") setDefenderId(id);
    setPicker(null);
    setQuery("");
  }

  if (!attacker || !defender) return <p className="rounded-xl bg-white p-4 text-sm text-slate-500">データを表示できませんでした。</p>;

  return (
    <div>
      <section className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm" aria-label="比較条件">
        <FormatToggle value={format} onChange={changeFormat} />
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-1">
          <PokemonSummary pokemon={attacker} label="攻撃側" onClick={() => setPicker("attacker")} />
          <span className="text-center text-sm font-black text-slate-400">VS</span>
          <PokemonSummary pokemon={defender} label="防御側" onClick={() => setPicker("defender")} />
        </div>
      </section>

      <div className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-[10px] leading-4 text-blue-900">
        レベル50・個体値31。天候、特性、持ち物などの補正は含みません。A/Cは攻撃側、H/B/Dは防御側の努力値です。
      </div>

      <DamageDirection attacker={attacker} defender={defender} format={format} />
      <DamageDirection attacker={defender} defender={attacker} format={format} />

      <Sheet open={picker !== null} onOpenChange={(open) => { if (!open) { setPicker(null); setQuery(""); } }}>
        <SheetOverlay onClick={() => { setPicker(null); setQuery(""); }} />
        <SheetContent>
          <h2 className="text-xl font-black">ポケモンを選択</h2>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="日本語名で検索" className="mt-4 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base outline-none focus:border-blue-500" />
          <div className="mt-3 max-h-[58dvh] divide-y divide-slate-100 overflow-y-auto">
            {filtered.map((pokemon) => (
              <button key={pokemon.id} type="button" style={{ contentVisibility: "auto", containIntrinsicSize: "64px" }} className="flex h-16 w-full items-center gap-3 px-1 text-left" onClick={() => choosePokemon(pokemon.id)}>
                {/* eslint-disable-next-line @next/next/no-img-element -- Champions Battle Data provides form-specific sprites. */}
                <img src={pokemon.sprite} alt="" className="size-12 shrink-0 object-contain" />
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{pokemon.displayNameJa}</span>
              </button>
            ))}
            {!filtered.length && <p className="py-8 text-center text-sm text-slate-500">該当するポケモンがいません。</p>}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
