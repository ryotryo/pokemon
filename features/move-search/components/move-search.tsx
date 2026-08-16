"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
import { pushDataLayer, useToolView } from "@/lib/analytics";
import { TYPE_ORDER } from "@/lib/champions/display-names";
import {
  filterAndSortMoveSearch,
  getMoveLearners,
  type MoveSearchDataset,
  type MoveSearchSort,
} from "@/lib/champions/move-search";
import { formatQuery, parseFormat } from "@/lib/champions/usage-ranking";
import type { BattleFormat } from "@/lib/champions/types";
import { FormatToggle } from "@/features/usage-ranking/components/format-toggle";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";

function MoveDetails({ move }: { move: MoveSearchDataset["moves"][number] }) {
  return (
    <section aria-labelledby="selected-move" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="selected-move" className="mr-auto text-xl font-black">{move.nameJa}</h2>
        <TypeBadge type={move.type} />
        <DamageClassBadge damageClass={move.damageClass} />
      </div>
      <dl className="mt-3 grid grid-cols-3 border-y border-slate-100 py-2 text-center">
        <div><dt className="text-[10px] text-slate-400">威力</dt><dd className="text-sm font-bold">{move.power ?? "—"}</dd></div>
        <div><dt className="text-[10px] text-slate-400">命中</dt><dd className="text-sm font-bold">{move.alwaysHits ? "必中" : move.accuracy ?? "—"}</dd></div>
        <div><dt className="text-[10px] text-slate-400">PP</dt><dd className="text-sm font-bold">{move.pp ?? "—"}</dd></div>
      </dl>
      {move.descriptionJa
        ? <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{move.descriptionJa}</p>
        : <p className="mt-3 text-xs text-slate-400">日本語の技説明はありません。</p>}
    </section>
  );
}

export function MoveSearch({ dataset }: { dataset: MoveSearchDataset }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const format = parseFormat(searchParams.get("format") ?? undefined);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<MoveSearchSort>("type");
  const [selectedMoveId, setSelectedMoveId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(true);
  useToolView("move-search", format);

  const filteredMoves = useMemo(
    () => filterAndSortMoveSearch(dataset.moves, query, sort),
    [dataset.moves, query, sort],
  );
  const selectedMove = useMemo(
    () => dataset.moves.find((move) => move.id === selectedMoveId) ?? null,
    [dataset.moves, selectedMoveId],
  );
  const learners = useMemo(
    () => selectedMoveId ? getMoveLearners(dataset.pokemon, selectedMoveId, format) : [],
    [dataset.pokemon, format, selectedMoveId],
  );

  const changeFormat = (next: BattleFormat) => {
    if (next === format) return;
    pushDataLayer({ event: "battle_format_change", tool_name: "move-search", battle_format: next });
    router.replace(`${pathname}?format=${formatQuery(next)}`, { scroll: false });
  };

  const selectMove = (moveId: string) => {
    const move = dataset.moves.find((entry) => entry.id === moveId);
    if (!move) return;
    setSelectedMoveId(moveId);
    setSelecting(false);
    setQuery("");
    pushDataLayer({ event: "move_detail_open", move_name: move.nameJa, tool_name: "move-search", battle_format: format });
  };

  return (
    <div className="space-y-4">
      <FormatToggle value={format} onChange={changeFormat} />

      <section aria-labelledby="move-picker" className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <h2 id="move-picker" className="text-base font-black">技を選択</h2>
          {selectedMove && !selecting && (
            <button type="button" onClick={() => setSelecting(true)} className="min-h-9 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700">
              技を変更
            </button>
          )}
        </div>

        {selectedMove && !selecting ? (
          <button type="button" onClick={() => setSelecting(true)} className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/50 px-3 text-left">
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-blue-950">{selectedMove.nameJa}</span>
            <TypeBadge type={selectedMove.type} />
          </button>
        ) : (
          <>
            <label className="block">
              <span className="sr-only">技名で検索</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="技名をひらがな・カタカナで検索"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <div className="mt-2 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="group" aria-label="技の並び順">
              {([['type', 'タイプ順'], ['name', '50音順']] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={sort === value}
                  onClick={() => setSort(value)}
                  className={`min-h-9 rounded-lg px-3 text-xs font-bold transition ${sort === value ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 px-1 text-xs text-slate-500">{filteredMoves.length}件</p>
            <div className="mt-1 max-h-[52dvh] overflow-y-auto rounded-xl border border-slate-100">
              {sort === "type" ? TYPE_ORDER.map((type) => {
                const moves = filteredMoves.filter((move) => move.type === type);
                if (!moves.length) return null;
                return (
                  <section key={type} aria-labelledby={`move-type-${type}`}>
                    <h3 id={`move-type-${type}`} className="sticky top-0 z-10 flex items-center border-y border-slate-100 bg-slate-50/95 px-3 py-1.5 backdrop-blur">
                      <TypeBadge type={type} />
                    </h3>
                    <ul className="divide-y divide-slate-100">
                      {moves.map((move) => (
                        <li key={move.id} className="[content-visibility:auto]">
                          <button type="button" onClick={() => selectMove(move.id)} className="flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600">
                            <span className="min-w-0 flex-1 truncate text-sm font-bold">{move.nameJa}</span>
                            <TypeBadge type={move.type} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              }) : (
                <ul className="divide-y divide-slate-100">
                  {filteredMoves.map((move) => (
                    <li key={move.id} className="[content-visibility:auto]">
                      <button type="button" onClick={() => selectMove(move.id)} className="flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600">
                        <span className="min-w-0 flex-1 truncate text-sm font-bold">{move.nameJa}</span>
                        <TypeBadge type={move.type} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!filteredMoves.length && <p className="py-8 text-center text-sm text-slate-500">一致する技がありません。</p>}
            </div>
          </>
        )}
      </section>

      {selectedMove && <MoveDetails move={selectedMove} />}

      {selectedMove && (
        <section aria-labelledby="move-learners" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 px-3 py-3">
            <h2 id="move-learners" className="text-base font-black">この技を覚えるポケモン</h2>
            <span className="shrink-0 text-xs text-slate-500">{learners.length}匹</span>
          </div>
          <div className="grid grid-cols-[2rem_2.75rem_minmax(0,1fr)] items-center gap-2 border-b border-slate-100 px-3 py-2 text-[10px] font-bold text-slate-400">
            <span className="text-center">順位</span><span /><span>ポケモン</span>
          </div>
          <ol className="divide-y divide-slate-100">
            {learners.map((pokemon) => (
              <li key={pokemon.id} className="grid min-h-14 grid-cols-[2rem_2.75rem_minmax(0,1fr)] items-center gap-2 px-3 py-1.5 [content-visibility:auto]">
                <span className="text-center text-xs font-black text-slate-500">{pokemon.ranks[format] ?? "—"}</span>
                <PokemonImage src={pokemon.sprite} name={pokemon.displayNameJa} size={44} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{pokemon.displayNameJa}</span>
                  <span className="mt-1 flex flex-wrap gap-1">{pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}</span>
                </span>
              </li>
            ))}
          </ol>
          {!learners.length && <p className="px-4 py-8 text-center text-sm text-slate-500">この技を覚えるポケモンはいません。</p>}
        </section>
      )}
    </div>
  );
}
