"use client";
/* eslint-disable @next/next/no-img-element -- Sprite URLs are supplied by Champions Battle Data. */

import { useEffect, useMemo, useState } from "react";
import { evaluateMatchup, getCoverageDots, type PartyMemberCoverage } from "@/lib/champions/type-matchup";
import { getPokemonDisplayNameJa, getTypeDisplayNameJa } from "@/lib/champions/display-names";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";

type Form = { id: string; name: string; displayNameJa: string; formKind: string; formRelation: string; types: string[]; sprite: string };
type Move = { id: string; displayNameJa: string; type: string; damageClass: string; isCoverageMove: boolean; usage?: number | null };
type RankedPokemon = { id: string; name: string; displayNameJa: string; rank: number; types: string[]; sprite: string; attackTypes: string[]; moves: Move[]; forms: Form[] };
type Candidate = Form & { attackTypes: string[]; moves: Move[]; rank: number };
type Target = Form & { rank: number; isFirstForm: boolean; coverage: { count: number; members: PartyMemberCoverage[] } };
const TYPE_COLORS: Record<string, string> = { fire: "bg-red-100 text-red-700", water: "bg-blue-100 text-blue-700", grass: "bg-green-100 text-green-700", electric: "bg-yellow-100 text-yellow-800", ice: "bg-cyan-100 text-cyan-800", fighting: "bg-orange-100 text-orange-800", poison: "bg-purple-100 text-purple-700", ground: "bg-amber-100 text-amber-800", flying: "bg-sky-100 text-sky-700", psychic: "bg-pink-100 text-pink-700", bug: "bg-lime-100 text-lime-800", rock: "bg-stone-200 text-stone-700", ghost: "bg-violet-100 text-violet-700", dragon: "bg-indigo-100 text-indigo-700", dark: "bg-slate-200 text-slate-800", steel: "bg-zinc-200 text-zinc-700", fairy: "bg-fuchsia-100 text-fuchsia-700", normal: "bg-neutral-200 text-neutral-700" };
const FORMAT_LABELS = { Singles: "シングル", Doubles: "ダブル" } as const;
const PARTY_STORAGE_KEY = "pokemon-champions-party";

function TypeBadge({ type }: { type: string }) { return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLORS[type.toLowerCase()] ?? "bg-slate-100"}`}>{getTypeDisplayNameJa(type)}</span>; }
function Dots({ members, large = false }: { members: PartyMemberCoverage[]; large?: boolean }) {
  const count = members.filter((member) => member.canHitWeakness).length;
  return <div className="flex shrink-0 gap-1" aria-label={`${count}匹が弱点をつける`}>{getCoverageDots(count).map((filled, index) => <span key={index} className={`${large ? "size-4" : "size-3"} rounded-full border ${filled ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"}`} />)}</div>;
}

export function PartyChecker({ singles, doubles, singlesAvailable, doublesAvailable, season, updatedAt }: { singles: RankedPokemon[]; doubles: RankedPokemon[]; singlesAvailable: RankedPokemon[]; doublesAvailable: RankedPokemon[]; season: string; updatedAt: string }) {
  const [format, setFormat] = useState<"Singles" | "Doubles">("Singles");
  const [partyIds, setPartyIds] = useState<string[]>(Array(6).fill(""));
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Target | null>(null);
  const [sort, setSort] = useState<"rank" | "thin">("rank");
  const [resultQuery, setResultQuery] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const ranked = format === "Singles" ? singles : doubles;
  const available = format === "Singles" ? singlesAvailable : doublesAvailable;
  const candidates = useMemo(() => {
    const map = new Map<string, Candidate>();
    available.forEach((pokemon) => pokemon.forms.forEach((form) => map.set(form.id, { ...form, attackTypes: pokemon.attackTypes, moves: pokemon.moves, rank: pokemon.rank })));
    return [...map.values()].sort((a, b) => (Number.isFinite(a.rank) ? a.rank : Number.MAX_SAFE_INTEGER) - (Number.isFinite(b.rank) ? b.rank : Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name));
  }, [available]);
  const party = partyIds.map((id) => candidates.find((candidate) => candidate.id === id)).filter(Boolean) as Candidate[];
  const hasParty = party.length > 0;
  const results = useMemo(() => {
    if (!hasParty) return [];
    const targets = ranked.flatMap((pokemon) => pokemon.forms.map((form, index) => ({ ...form, rank: pokemon.rank, isFirstForm: index === 0, coverage: evaluateMatchup(party, form.types) })));
    return sort === "thin" ? targets.sort((a, b) => a.coverage.count - b.coverage.count || a.rank - b.rank) : targets;
  }, [hasParty, party, ranked, sort]);
  const selectedIds = new Set(partyIds.filter(Boolean));
  const filteredResults = results.filter((target) => {
    const normalizedQuery = resultQuery.trim().toLowerCase();
    return getPokemonDisplayNameJa(target.id, target.name).toLowerCase().includes(normalizedQuery) || target.name.toLowerCase().includes(normalizedQuery);
  });
  const filtered = candidates.filter((candidate) => {
    const normalizedQuery = query.trim().toLowerCase();
    return getPokemonDisplayNameJa(candidate.id, candidate.name).toLowerCase().includes(normalizedQuery) || candidate.name.toLowerCase().includes(normalizedQuery) || candidate.id.includes(normalizedQuery);
  });
  const choose = (id: string) => { if (pickerSlot === null) return; setPartyIds((current) => current.map((value, index) => index === pickerSlot ? id : value)); setPickerSlot(null); setQuery(""); };
  const switchFormat = (next: "Singles" | "Doubles") => { setFormat(next); setDetail(null); };

  useEffect(() => {
    let restoredParty = Array(6).fill("") as string[];
    try {
      const saved = JSON.parse(localStorage.getItem(PARTY_STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) restoredParty = Array.from({ length: 6 }, (_, index) => typeof saved[index] === "string" ? saved[index] : "");
    } catch {
      localStorage.removeItem(PARTY_STORAGE_KEY);
    }
    queueMicrotask(() => {
      setPartyIds(restoredParty);
      setStorageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    if (partyIds.some(Boolean)) localStorage.setItem(PARTY_STORAGE_KEY, JSON.stringify(partyIds));
    else localStorage.removeItem(PARTY_STORAGE_KEY);
  }, [partyIds, storageReady]);

  const clearParty = () => {
    setPartyIds(Array(6).fill(""));
    localStorage.removeItem(PARTY_STORAGE_KEY);
    setConfirmClear(false);
    setDetail(null);
  };

  return <>
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">{(["Singles", "Doubles"] as const).map((item) => <button key={item} className={`h-9 rounded-lg px-3 ${format === item ? "bg-slate-950 text-white" : "text-slate-500"}`} onClick={() => switchFormat(item)}>{FORMAT_LABELS[item]}</button>)}</div>
        <div className="text-right text-[11px] leading-4 text-slate-500"><strong className="text-slate-800">{season}</strong><br />更新 {new Date(updatedAt).toLocaleDateString("ja-JP")}</div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-xs font-bold text-blue-700">YOUR PARTY</p><h2 className="text-lg font-black">パーティーを選択</h2></div><div className="flex items-center gap-2"><span className="text-xs text-slate-400">{party.length} / 6</span><button disabled={!party.length} className="h-9 rounded-lg px-2 text-xs font-bold text-red-600 disabled:opacity-30" onClick={() => setConfirmClear(true)}>全削除</button></div></div>
        <div className="grid grid-cols-6 gap-2">
          {partyIds.map((id, index) => { const member = candidates.find((candidate) => candidate.id === id); return <button key={index} aria-label={member ? `${getPokemonDisplayNameJa(member.id, member.name)}を変更` : `${index + 1}匹目を選択`} className="aspect-square min-w-0 rounded-full border border-slate-200 bg-slate-50 p-1 active:scale-95" onClick={() => setPickerSlot(index)}>{member ? <img src={member.sprite} alt="" className="size-full object-contain" /> : <span className="flex size-full items-center justify-center text-xl font-light text-slate-400">＋</span>}</button>; })}
        </div>
        {confirmClear && <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3"><p className="text-sm font-bold text-slate-800">パーティーをすべて削除しますか？</p><div className="mt-3 grid grid-cols-2 gap-2"><button className="h-11 rounded-xl bg-white text-sm font-bold text-slate-600" onClick={() => setConfirmClear(false)}>キャンセル</button><button className="h-11 rounded-xl bg-red-600 text-sm font-bold text-white" onClick={clearParty}>すべて削除</button></div></div>}
      </div>

      {!hasParty ? <div className="border-t border-slate-100 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">ポケモンを1匹選ぶと、環境への対応状況が表示されます</div> : <>
        <div className="border-y border-slate-100 bg-slate-50 px-4 py-3"><div className="flex items-center justify-between"><h2 className="text-sm font-black">全ポケモンへの対応</h2><div className="flex rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-bold"><button className={`rounded-md px-2 py-1.5 ${sort === "rank" ? "bg-white shadow-sm" : "text-slate-500"}`} onClick={() => setSort("rank")}>ランキング順</button><button className={`rounded-md px-2 py-1.5 ${sort === "thin" ? "bg-white shadow-sm" : "text-slate-500"}`} onClick={() => setSort("thin")}>対応が薄い順</button></div></div><input value={resultQuery} onChange={(event) => setResultQuery(event.target.value)} placeholder="診断対象を日本語で検索" className="mt-3 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500" /><p className="mt-1.5 text-right text-[10px] text-slate-400">{filteredResults.length}件</p></div>
        <div className="divide-y divide-slate-100">{filteredResults.map((target) => <button key={`${target.rank}-${target.id}`} style={{ contentVisibility: "auto", containIntrinsicSize: "56px" }} className="grid h-14 w-full grid-cols-[1.75rem_2.25rem_minmax(0,1fr)_auto] items-center gap-2 px-3 text-left hover:bg-slate-50" onClick={() => setDetail(target)}><span className="text-center text-[11px] font-bold text-slate-400">{target.isFirstForm && target.rank < Number.MAX_SAFE_INTEGER ? target.rank : ""}</span><img src={target.sprite} alt="" className="size-9 object-contain" /><span className="min-w-0 truncate text-[13px] font-bold">{getPokemonDisplayNameJa(target.id, target.name)}</span><Dots members={target.coverage.members} /></button>)}</div>
      </>}
    </section>
    <p className="mt-4 px-1 text-xs leading-5 text-slate-500">この診断はPokémon Championsでよく使用されている技をもとにした潜在的な対応範囲です。実際の技構成によって対応範囲は異なります。</p>

    <Sheet open={pickerSlot !== null} onOpenChange={(open) => !open && setPickerSlot(null)}><SheetOverlay onClick={() => setPickerSlot(null)} /><SheetContent>
      <div className="flex items-center justify-between"><h2 className="text-xl font-black">ポケモンを選択</h2>{pickerSlot !== null && partyIds[pickerSlot] && <button className="text-sm font-bold text-red-600" onClick={() => choose("")}>削除</button>}</div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="名前で検索" className="mt-4 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base outline-none focus:border-blue-500" />
      <div className="mt-3 max-h-[58dvh] divide-y divide-slate-100 overflow-y-auto">{filtered.map((candidate) => { const disabled = selectedIds.has(candidate.id) && partyIds[pickerSlot ?? -1] !== candidate.id; return <button key={candidate.id} disabled={disabled} style={{ contentVisibility: "auto", containIntrinsicSize: "64px" }} className="flex h-16 w-full items-center gap-3 px-1 text-left disabled:opacity-30" onClick={() => choose(candidate.id)}><img src={candidate.sprite} alt="" className="size-12 object-contain" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{getPokemonDisplayNameJa(candidate.id, candidate.name)}</p><div className="mt-1 flex gap-1">{candidate.types.map((type) => <TypeBadge key={type} type={type} />)}</div></div></button>; })}</div>
    </SheetContent></Sheet>

    <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}><SheetOverlay onClick={() => setDetail(null)} /><SheetContent>{detail && <>
      <div className="flex items-center gap-4"><img src={detail.sprite} alt="" className="size-24 object-contain" /><div className="min-w-0"><p className="text-xs font-bold text-slate-400">RANK {detail.rank}</p><h2 className="truncate text-xl font-black">{getPokemonDisplayNameJa(detail.id, detail.name)}</h2><div className="mt-2 flex gap-1">{detail.types.map((type) => <TypeBadge key={type} type={type} />)}</div><div className="mt-3"><Dots members={detail.coverage.members} large /></div></div></div>
      <div className="mt-5 divide-y divide-slate-100 border-y border-slate-100">{detail.coverage.members.map((member, index) => { const pokemon = party[index]; const groups = [...new Map(member.effectiveMoves.map((move) => [`${move.type}-${move.multiplier}`, { type: move.type, multiplier: move.multiplier, moves: member.effectiveMoves.filter((item) => item.type === move.type && item.multiplier === move.multiplier) }])).values()]; return <div key={member.id} className="flex gap-3 py-3"><img src={pokemon.sprite} alt="" className="size-11 shrink-0 object-contain" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{getPokemonDisplayNameJa(pokemon.id, pokemon.name)}</p>{member.canHitWeakness ? <div className="mt-2 space-y-2">{groups.map((group) => <div key={`${group.type}-${group.multiplier}`}><div className="flex items-center gap-2"><TypeBadge type={group.type} /><span className="text-xs font-black text-blue-700">{group.multiplier}倍</span></div><ul className="mt-1 space-y-0.5 pl-1 text-xs text-slate-600">{group.moves.map((move) => <li key={move.moveId}>・{move.displayNameJa}{typeof move.usage === "number" && Number.isFinite(move.usage) ? `（${move.usage}%）` : ""}</li>)}</ul></div>)}</div> : <p className="mt-1 text-xs text-slate-400">有効な技なし</p>}</div><div className={`shrink-0 text-sm font-black ${member.canHitWeakness ? "text-blue-700" : "text-slate-300"}`}>{member.bestMultiplier}×</div></div>; })}</div>
    </>}</SheetContent></Sheet>
  </>;
}
