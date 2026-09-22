import { ItemAssetImage } from "@/components/ui/game-asset-image";
import { TypeBadge } from "@/components/ui/type-badge";

const itemExamples = [
  { canonicalName: "Choice Scarf", nameJa: "こだわりスカーフ", note: "素早さを上げる" },
  { canonicalName: "Focus Sash", nameJa: "きあいのタスキ", note: "満タンから1残す" },
  { canonicalName: "Leftovers", nameJa: "たべのこし", note: "毎ターン回復" },
] as const;

export function BattleBasicsAssetExamples({ articleSlug }: { articleSlug: string }) {
  const typeExamples: Record<string, { label: string; entries: Array<{ type: string; multiplier?: string }> }> = {
    "type-matchups": { label: "タイプ相性の表示例", entries: [{ type: "water", multiplier: "×2" }, { type: "grass", multiplier: "×1/2" }, { type: "normal", multiplier: "×0" }] },
    "same-type-attack-bonus": { label: "タイプ一致の例", entries: [{ type: "fire", multiplier: "×1.5" }] },
    "four-times-weakness": { label: "4倍弱点の表示例", entries: [{ type: "rock", multiplier: "×4" }] },
    "stealth-rock": { label: "ステルスロックの基準タイプ", entries: [{ type: "rock" }] },
  };
  const typeExample = typeExamples[articleSlug];
  if (typeExample) return <aside aria-label={typeExample.label} className="mt-5 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
    <p className="text-[10px] font-black text-slate-500">{typeExample.label}</p>
    <div className="mt-2 flex flex-wrap items-center gap-2">{typeExample.entries.map((entry) => <span key={entry.type} className="inline-flex items-center gap-1"><TypeBadge type={entry.type} />{entry.multiplier ? <b className="text-xs text-slate-700">{entry.multiplier}</b> : null}</span>)}</div>
  </aside>;
  if (articleSlug !== "held-items") return null;
  return <aside aria-label="持ち物の例" className="mt-5 rounded-2xl border border-slate-200 bg-white p-3">
    <p className="text-[10px] font-black text-slate-500">持ち物の例</p>
    <ul className="mt-2 grid grid-cols-3 gap-2">
      {itemExamples.map((item) => <li key={item.canonicalName} className="min-w-0 text-center">
        <ItemAssetImage canonicalName={item.canonicalName} nameJa={item.nameJa} size="md" decorative={false} className="mx-auto" />
        <strong className="mt-1 block truncate text-[11px]">{item.nameJa}</strong>
        <span className="mt-0.5 block text-[9px] leading-4 text-slate-500">{item.note}</span>
      </li>)}
    </ul>
  </aside>;
}
