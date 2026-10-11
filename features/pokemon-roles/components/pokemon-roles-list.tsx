"use client";

import { useState } from "react";
import Link from "next/link";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";
import { pokemonRoleDefinitions, roleGroups } from "@/content/pokemon-roles";
import type { PokemonRoleLists } from "@/lib/champions/pokemon-role-list";
import type { BattleFormat } from "@/lib/champions/types";

export function PokemonRolesList({ lists }: { lists: PokemonRoleLists }) {
  const [format, setFormat] = useState<BattleFormat>("Singles");
  const formatLabel = format === "Singles" ? "シングル" : "ダブル";

  return <div>
    <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-3 sm:p-4">
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="対戦形式">
        {(["Singles", "Doubles"] as const).map((value) => <button key={value} type="button" aria-pressed={format === value} onClick={() => setFormat(value)} className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-blue-600 ${format === value ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}>{value === "Singles" ? "シングル" : "ダブル"}</button>)}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">各役割に分類されたポケモンを、{formatLabel}の使用率順位順に最大10匹表示します。順位がないポケモンは末尾に表示します。</p>
    </div>
    <div className="space-y-10">{roleGroups.map((group) => <section key={group.id} aria-labelledby={`group-${group.id}`}>
      <div className="border-b border-slate-200 pb-2"><h2 id={`group-${group.id}`} className="text-2xl font-black">{group.label}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{group.description}</p></div>
      <div className="divide-y divide-slate-200">{pokemonRoleDefinitions.filter((role) => role.group === group.id).map((role) => {
        const { entries, total } = lists[role.id][format];
        return <article key={role.id} id={`role-${role.id}`} className="scroll-mt-4 py-4">
          <h3 className="text-base font-black">{role.label}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{role.description}</p>
          {entries.length > 0 ? <div className="mt-3">
            <p className="text-xs text-slate-500">{formatLabel}使用率順 · {total}匹中{entries.length}匹</p>
            <ol className="mt-2 flex flex-wrap gap-2">{entries.map((entry) => <li key={entry.id}>
              <Link href={`/pokemon-intro/${entry.id}/`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-blue-100 bg-white py-1 pl-1 pr-2.5 text-xs font-bold text-slate-800 hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600">
                <PokemonImage src={entry.sprite} name={entry.displayNameJa} size={24} mini decorative/>
                <span>{entry.displayNameJa}</span>
              </Link>
            </li>)}</ol>
          </div> : <p className="mt-3 text-xs text-slate-500">該当するポケモンはまだいません。</p>}
        </article>;
      })}</div>
    </section>)}</div>
  </div>;
}
