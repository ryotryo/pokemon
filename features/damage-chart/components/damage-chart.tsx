"use client";

import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
import { FormatToggle } from "@/features/usage-ranking/components/format-toggle";
import { pushDataLayer, useToolView } from "@/lib/analytics";
import {
  ATTACK_PATTERNS,
  DEFENSE_PATTERNS,
  ITEM_DAMAGE_MODIFIERS,
  calculateDamage,
  damageBarColor,
  getDefaultAbilityName,
  isSupportedOffensiveAbility,
  type DamageChartDataset,
  type DamageChartMove,
  type DamageChartPokemon,
  type ItemDamageModifier,
} from "@/lib/champions/damage-chart";
import type { BattleFormat } from "@/lib/champions/types";

type AttackSettings = { ability: string | null; itemDamageModifier: ItemDamageModifier };
const UNSELECTED_ABILITY = "__unselected__";

function defaultAttackSettings(pokemon: DamageChartPokemon | undefined, format: BattleFormat): AttackSettings {
  return { ability: getDefaultAbilityName(pokemon?.abilities[format] ?? []), itemDamageModifier: 1 };
}

function formatPercent(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function PokemonSummary({ pokemon, label, format, settings, onClick, onSettingsChange }: {
  pokemon: DamageChartPokemon;
  label: string;
  format: BattleFormat;
  settings: AttackSettings;
  onClick: () => void;
  onSettingsChange: (settings: AttackSettings) => void;
}) {
  const unsupported = Boolean(settings.ability && !isSupportedOffensiveAbility(settings.ability));
  return (
    <div className="flex min-w-0 flex-col rounded-2xl bg-slate-50 px-2 py-2 text-center">
      <button type="button" onClick={onClick} aria-label={`${label}の${pokemon.displayNameJa}を変更`} className="flex min-w-0 flex-col items-center active:scale-[0.98]">
        <p className="text-[10px] font-bold text-slate-400">{label}</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- Champions Battle Data provides form-specific sprites. */}
        <img src={pokemon.sprite} alt="" className="size-20 max-w-full object-contain sm:size-24" />
        <p className="w-full truncate text-sm font-black">{pokemon.displayNameJa}</p>
        <div className="mt-1 flex gap-1">{pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
      </button>
      <label className="mt-2 grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-1 text-left text-[9px] font-bold text-slate-500">
        特性
        <select value={settings.ability ?? UNSELECTED_ABILITY} onChange={(event) => onSettingsChange({ ...settings, ability: event.target.value === UNSELECTED_ABILITY ? null : event.target.value })} className="h-8 min-w-0 rounded-lg border border-slate-200 bg-white px-1 text-[10px] font-bold text-slate-700 outline-none">
          {settings.ability === null && <option value={UNSELECTED_ABILITY}>選択してください</option>}
          {pokemon.abilities[format].map((ability) => <option key={ability.nameJa} value={ability.nameJa}>{ability.nameJa}{ability.percentageValue !== null ? `（${formatPercent(ability.percentageValue)}%）` : ""}{isSupportedOffensiveAbility(ability.nameJa) ? "" : "（未対応）"}</option>)}
          <option value="">特性補正なし</option>
        </select>
      </label>
      <label className="mt-1 grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-1 text-left text-[9px] font-bold text-slate-500">
        道具補正
        <select value={settings.itemDamageModifier} onChange={(event) => onSettingsChange({ ...settings, itemDamageModifier: Number(event.target.value) as ItemDamageModifier })} className="h-8 min-w-0 rounded-lg border border-slate-200 bg-white px-1 text-[10px] font-bold text-slate-700 outline-none">
          {ITEM_DAMAGE_MODIFIERS.map((modifier) => <option key={modifier} value={modifier}>{modifier === 1 ? "補正なし" : `×${modifier}`}</option>)}
        </select>
      </label>
      {unsupported && <p className="mt-1 text-[8px] leading-3 text-amber-700">攻撃時のダメージ補正は未対応</p>}
    </div>
  );
}

function DamageCell({ result }: { result: ReturnType<typeof calculateDamage> }) {
  return (
    <div className="min-w-0 px-0.5 py-1 text-center">
      <p className="whitespace-nowrap text-[8px] font-bold tabular-nums text-slate-700 sm:text-[10px]">
        {result.minDamage}〜{result.maxDamage}（{formatPercent(result.minPercent)}〜{formatPercent(result.maxPercent)}%）
      </p>
      <div className="mx-auto mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className={`h-full rounded-full ${damageBarColor(result.maxPercent)}`} style={{ width: `${Math.min(100, result.maxPercent)}%` }} />
      </div>
      <p className="mt-0.5 text-[9px] font-black text-slate-500">{result.hitLabel}</p>
    </div>
  );
}

function MoveDamageGrid({ attacker, defender, move, settings }: { attacker: DamageChartPokemon; defender: DamageChartPokemon; move: DamageChartMove; settings: AttackSettings }) {
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
                  attackerAbility: settings.ability,
                  defenderAbility: null,
                  itemDamageModifier: settings.itemDamageModifier,
                })}
              />
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}

function DamageDirection({ attacker, defender, format, settings }: { attacker: DamageChartPokemon; defender: DamageChartPokemon; format: BattleFormat; settings: AttackSettings }) {
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
        <div className="space-y-2">{moves.map((move) => <MoveDamageGrid key={move.id} attacker={attacker} defender={defender} move={move} settings={settings} />)}</div>
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
  const [attackerSettings, setAttackerSettings] = useState<AttackSettings>(() => defaultAttackSettings(attacker, format));
  const [defenderSettings, setDefenderSettings] = useState<AttackSettings>(() => defaultAttackSettings(defender, format));
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sorted;
    return sorted.filter((pokemon) => pokemon.displayNameJa.toLowerCase().includes(normalizedQuery) || pokemon.id.toLowerCase().includes(normalizedQuery));
  }, [query, sorted]);
  useToolView("damage-chart", format);

  function changeFormat(next: BattleFormat) {
    if (next === format) return;
    setFormat(next);
    setAttackerSettings((current) => ({ ...current, ability: getDefaultAbilityName(attacker.abilities[next]) }));
    setDefenderSettings((current) => ({ ...current, ability: getDefaultAbilityName(defender.abilities[next]) }));
    pushDataLayer({ event: "battle_format_change", tool_name: "damage-chart", battle_format: next });
  }

  function choosePokemon(id: string) {
    const selected = dataset.pokemon.find((pokemon) => pokemon.id === id);
    if (picker === "attacker") { setAttackerId(id); setAttackerSettings(defaultAttackSettings(selected, format)); }
    if (picker === "defender") { setDefenderId(id); setDefenderSettings(defaultAttackSettings(selected, format)); }
    setPicker(null);
    setQuery("");
  }

  if (!attacker || !defender) return <p className="rounded-xl bg-white p-4 text-sm text-slate-500">データを表示できませんでした。</p>;

  return (
    <div>
      <section className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm" aria-label="比較条件">
        <FormatToggle value={format} onChange={changeFormat} />
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-1">
          <PokemonSummary pokemon={attacker} label="攻撃側" format={format} settings={attackerSettings} onSettingsChange={setAttackerSettings} onClick={() => setPicker("attacker")} />
          <span className="text-center text-sm font-black text-slate-400">VS</span>
          <PokemonSummary pokemon={defender} label="防御側" format={format} settings={defenderSettings} onSettingsChange={setDefenderSettings} onClick={() => setPicker("defender")} />
        </div>
      </section>

      <div className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-[10px] leading-4 text-blue-900">
        レベル50・個体値31。選択した対応済み特性と道具倍率以外の補正は含みません。A/Cは攻撃側、H/B/Dは防御側の努力値です。
      </div>

      <DamageDirection attacker={attacker} defender={defender} format={format} settings={attackerSettings} />
      <DamageDirection attacker={defender} defender={attacker} format={format} settings={defenderSettings} />

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
