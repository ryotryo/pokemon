"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TypeBadge } from "@/components/ui/type-badge";
import { TYPE_NAMES_JA, TYPE_ORDER } from "@/lib/champions/display-names";
import { getTypeMatchupGroups, isTypeId } from "@/lib/champions/type-matchup";

const groupLabels: Record<number, string> = { 4: "4倍弱点", 2: "2倍弱点", 0.5: "半減", 0.25: "1/4", 0: "無効" };
const groupStyles: Record<number, string> = { 4: "border-rose-200 bg-rose-50", 2: "border-rose-100 bg-white", 0.5: "border-blue-100 bg-white", 0.25: "border-blue-200 bg-blue-50", 0: "border-slate-200 bg-slate-100" };

export function DualTypeChecker() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedType1 = searchParams.get("type1");
  const requestedType2 = searchParams.get("type2");
  const type1 = isTypeId(requestedType1) ? requestedType1.toLowerCase() : "normal";
  const type2 = isTypeId(requestedType2) && requestedType2.toLowerCase() !== type1 ? requestedType2.toLowerCase() : "none";
  const selectedTypes = type2 === "none" ? [type1] : [type1, type2];
  const groups = getTypeMatchupGroups(selectedTypes).filter((group) => group.types.length > 0);

  function updateTypes(nextType1: string, nextType2: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (nextType1 === "normal") next.delete("type1"); else next.set("type1", nextType1);
    if (nextType2 === "none" || nextType2 === nextType1) next.delete("type2"); else next.set("type2", nextType2);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return <section aria-labelledby="dual-type-heading" className="mt-10 scroll-mt-4">
    <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 id="dual-type-heading" className="text-xl font-black">複合タイプの弱点・耐性を調べる</h2>
      <p className="mt-1 text-xs leading-5 text-slate-500">防御するポケモンのタイプを選ぶと、技を受けるときの相性をまとめて表示します。</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-700">タイプ1（必須）
          <select value={type1} onChange={(event) => updateTypes(event.target.value, type2)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base sm:text-sm">
            {TYPE_ORDER.map((type) => <option key={type} value={type}>{TYPE_NAMES_JA[type]}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-700">タイプ2（任意）
          <select value={type2} onChange={(event) => updateTypes(type1, event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base sm:text-sm">
            <option value="none">なし</option>{TYPE_ORDER.map((type) => <option key={type} value={type} disabled={type === type1}>{TYPE_NAMES_JA[type]}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5" aria-label="選択中の防御タイプ"><span className="mr-1 text-xs font-bold text-slate-500">選択中</span>{selectedTypes.map((type) => <TypeBadge key={type} type={type} />)}</div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {groups.map((group) => <section key={group.multiplier} className={`rounded-2xl border p-3 ${groupStyles[group.multiplier]}`}>
          <h3 className="text-xs font-black text-slate-700">{groupLabels[group.multiplier]} <span className="font-medium text-slate-400">({group.types.length})</span></h3>
          <div className="mt-2 flex flex-wrap gap-1.5">{group.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
        </section>)}
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">一覧にないタイプは等倍です。特性・技・場の効果による相性変更は含みません。</p>
    </div>
  </section>;
}
