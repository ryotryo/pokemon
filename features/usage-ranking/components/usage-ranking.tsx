"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getTypeDisplayNameJa } from "@/lib/champions/display-names";
import { formatPercentage, formatQuery, parseFormat, sortRankingPokemon, type UsageRankingPokemon } from "@/lib/champions/usage-ranking";
import { FormatToggle } from "./format-toggle";
import { PokemonImage } from "./pokemon-image";

const INITIAL_ROWS = 60;

export function UsageRanking({ pokemon }: { pokemon: UsageRankingPokemon[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const format = parseFormat(searchParams.get("format") ?? undefined);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS);

  const changeFormat = (next: ReturnType<typeof parseFormat>) => {
    setVisibleCount(INITIAL_ROWS);
    router.replace(`${pathname}?format=${formatQuery(next)}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ja");
    return sortRankingPokemon(pokemon, format).filter((entry) =>
      !normalizedQuery || entry.displayNameJa.toLocaleLowerCase("ja").includes(normalizedQuery) || entry.id.includes(normalizedQuery),
    );
  }, [format, pokemon, query]);

  if (!pokemon.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="font-bold">データを取得できませんでした。</p>
        <p className="mt-2 text-sm text-slate-500">時間をおいて、もう一度お試しください。</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 min-h-11 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white">再読み込み</button>
      </div>
    );
  }

  return (
    <div>
      <FormatToggle value={format} onChange={changeFormat} />
      <label className="mt-4 block">
        <span className="sr-only">ポケモン名で検索</span>
        <input
          value={query}
          onChange={(event) => { setQuery(event.target.value); setVisibleCount(INITIAL_ROWS); }}
          placeholder="ポケモン名で検索"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <p className="mt-3 px-1 text-xs text-slate-500">{filtered.length}件</p>

      <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[2rem_2.75rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-slate-100 px-3 py-2 text-[10px] font-bold text-slate-400">
          <span className="text-center">順位</span><span /><span>ポケモン</span><span>使用率</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.slice(0, visibleCount).map((entry) => (
            <Link
              key={entry.id}
              href={`/usage-ranking/${entry.id}/?format=${formatQuery(format)}`}
              className="grid min-h-16 grid-cols-[2rem_2.75rem_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600"
            >
              <span className="text-center text-xs font-black text-slate-500">{entry.ranks[format] ?? "—"}</span>
              <PokemonImage src={entry.sprite} name={entry.displayNameJa} size={44} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{entry.displayNameJa}</span>
                <span className="mt-1 flex min-w-0 flex-wrap gap-1">
                  {entry.types.map((type) => <span key={type} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{getTypeDisplayNameJa(type)}</span>)}
                </span>
              </span>
              <span className="flex items-center gap-2 text-right">
                <span className="text-xs font-bold text-slate-600">{formatPercentage(entry.usagePercentages[format])}</span>
                <span aria-hidden="true" className="text-lg text-blue-700">›</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      {visibleCount < filtered.length && (
        <button type="button" onClick={() => setVisibleCount((count) => count + INITIAL_ROWS)} className="mt-4 min-h-11 w-full rounded-xl border border-blue-200 bg-white text-sm font-bold text-blue-700">
          さらに表示
        </button>
      )}
    </div>
  );
}
