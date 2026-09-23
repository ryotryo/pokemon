import { TypeAssetImage } from "@/components/ui/game-asset-image";
import { TypeBadge } from "@/components/ui/type-badge";
import { TYPE_NAMES_JA, TYPE_ORDER } from "@/lib/champions/display-names";
import { getTypeMultiplier } from "@/lib/champions/type-matchup";

const cellStyles: Record<number, string> = {
  2: "bg-rose-100 font-black text-rose-800",
  0.5: "bg-blue-100 font-black text-blue-800",
  0: "bg-slate-700 font-black text-white",
};

function formatMultiplier(multiplier: number) {
  if (multiplier === 1) return "—";
  return `×${multiplier}`;
}

export function TypeChartTable() {
  return <section aria-labelledby="type-chart-heading">
    <div className="mb-3">
      <h2 id="type-chart-heading" className="text-xl font-black">タイプ相性表</h2>
      <p className="mt-1 text-xs leading-5 text-slate-500">左の攻撃タイプから、上の防御タイプへ技を使ったときの倍率です。</p>
    </div>
    <div data-testid="type-chart-scroll" className="w-fit max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-[720px] table-fixed border-separate border-spacing-0 text-center text-[8px]" aria-label="18タイプの攻撃と防御の相性表">
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 top-0 z-30 w-[72px] border-b border-r border-slate-200 bg-slate-100 px-1 py-0.5 text-left text-[8px] font-black leading-3 text-slate-700">
              <span className="block">攻撃↓</span><span className="block">防御→</span>
            </th>
            {TYPE_ORDER.map((type) => <th key={type} scope="col" aria-label={`${TYPE_NAMES_JA[type]}タイプ`} title={`${TYPE_NAMES_JA[type]}タイプ`} className="sticky top-0 z-20 w-9 border-b border-r border-slate-200 bg-slate-100 p-0.5 last:border-r-0">
              <span className="flex justify-center"><TypeAssetImage type={type} nameJa={TYPE_NAMES_JA[type]} size="xxs" /></span>
            </th>)}
          </tr>
        </thead>
        <tbody>
          {TYPE_ORDER.map((attackType) => <tr key={attackType}>
            <th scope="row" className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white p-0.5 text-left last:border-b-0"><TypeBadge type={attackType} compact /></th>
            {TYPE_ORDER.map((defenseType) => {
              const multiplier = getTypeMultiplier(attackType, [defenseType]);
              return <td key={defenseType} aria-label={`${TYPE_NAMES_JA[attackType]}技を${TYPE_NAMES_JA[defenseType]}タイプへ使うと${multiplier}倍`} className={`h-6 border-b border-r border-slate-100 p-0 text-center tabular-nums last:border-r-0 ${cellStyles[multiplier] ?? "text-slate-300"}`}>{formatMultiplier(multiplier)}</td>;
            })}
          </tr>)}
        </tbody>
      </table>
    </div>
    <div aria-label="相性表の凡例" className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
      <span><b className="text-rose-700">×2</b> 効果抜群</span><span><b className="text-blue-700">×0.5</b> いまひとつ</span><span><b className="text-slate-800">×0</b> 効果なし</span><span><b>—</b> 等倍</span>
    </div>
  </section>;
}
