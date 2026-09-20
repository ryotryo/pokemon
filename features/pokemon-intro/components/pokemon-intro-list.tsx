"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TypeBadge } from "@/components/ui/type-badge";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";
import { TYPE_NAMES_JA, TYPE_ORDER } from "@/lib/champions/display-names";
import { filterAndSortPokemonIntros, parsePokemonIntroSort, parsePokemonIntroType, type PokemonIntroListItem } from "@/lib/champions/pokemon-intro-list";

const SORT_LABELS = {
  dex: "全国図鑑順", name: "名前順（五十音）", singles: "シングル順位", doubles: "ダブル順位", speed: "素早さが高い順", bst: "種族値合計が高い順",
} as const;

export function PokemonIntroList({ items }: { items: PokemonIntroListItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const type = parsePokemonIntroType(searchParams.get("type"));
  const sort = parsePokemonIntroSort(searchParams.get("sort"));
  const visibleItems = filterAndSortPokemonIntros(items, { query, type, sort });

  function updateParam(key: "q" | "type" | "sort", value: string) {
    const next = new URLSearchParams(searchParams.toString());
    const isDefault = !value || (key === "type" && value === "all") || (key === "sort" && value === "dex");
    if (isDefault) next.delete(key); else next.set(key, value);
    const suffix = next.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
  }

  return <section aria-labelledby="pokemon-intro-results">
    <div className="mb-4 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:p-4">
      <label className="block text-xs font-bold text-slate-700" htmlFor="pokemon-intro-search">ポケモン名で検索</label>
      <input id="pokemon-intro-search" type="search" value={query} onChange={(event) => updateParam("q", event.target.value)} placeholder="例：リザードン、めがりざーどん" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white sm:text-sm" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="min-w-0 text-xs font-bold text-slate-700">タイプ
          <select value={type} onChange={(event) => updateParam("type", event.target.value)} className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm font-medium">
            <option value="all">すべて</option>{TYPE_ORDER.map((id) => <option key={id} value={id}>{TYPE_NAMES_JA[id]}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-bold text-slate-700">並び順
          <select value={sort} onChange={(event) => updateParam("sort", event.target.value)} className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm font-medium">
            {Object.entries(SORT_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
      </div>
    </div>
    <div className="mb-2 flex items-center justify-between px-1 text-xs text-slate-500"><h2 id="pokemon-intro-results" className="font-bold text-slate-700">該当するポケモン</h2><span aria-live="polite">{visibleItems.length}匹</span></div>
    {visibleItems.length ? <div className="grid gap-2 sm:grid-cols-2">{visibleItems.map((entry) => <Link key={entry.id} href={`/pokemon-intro/${entry.id}/`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm transition hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600">
      <PokemonImage src={entry.sprite} name={entry.displayNameJa} size={44} />
      <span className="min-w-0 flex-1"><span className="flex min-w-0 items-baseline gap-2"><strong className="truncate text-sm font-black">{entry.displayNameJa}</strong><small className="shrink-0 text-[10px] font-medium text-slate-400">No.{String(entry.dexNumber).padStart(4, "0")}</small></span><span className="mt-1 flex flex-wrap gap-1">{entry.types.map((entryType) => <TypeBadge key={entryType} type={entryType} />)}</span><span className="mt-1.5 block text-xs leading-5 text-slate-600">{entry.summary}</span></span><span aria-hidden="true" className="font-bold text-blue-700">→</span>
    </Link>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center"><p className="font-bold text-slate-700">条件に合うポケモンが見つかりません</p><p className="mt-1 text-xs text-slate-500">名前やタイプを変えてお試しください。</p></div>}
  </section>;
}
