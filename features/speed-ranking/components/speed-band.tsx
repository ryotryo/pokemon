import { getScalePosition, type SpeedStats } from "@/lib/champions/speed-ranking";

export const SPEED_POINTS: Array<{ key: keyof SpeedStats; label: string; color: string; textColor: string }> = [
  { key: "decreasingMin", label: "最遅（性格下降補正＋努力値0）", color: "bg-red-500", textColor: "text-red-700" },
  { key: "neutral", label: "無振り（性格補正なし＋努力値0）", color: "bg-slate-500", textColor: "text-slate-600" },
  { key: "neutralMax", label: "準速（性格補正なし＋努力値252）", color: "bg-emerald-500", textColor: "text-emerald-700" },
  { key: "increasingMax", label: "最速（性格上昇補正＋努力値252）", color: "bg-blue-500", textColor: "text-blue-700" },
];

export function SpeedBand({ stats, scale, showValues = false }: { stats: SpeedStats; scale: { min: number; max: number }; showValues?: boolean }) {
  const start = getScalePosition(stats.decreasingMin, scale);
  const end = getScalePosition(stats.increasingMax, scale);

  return (
    <div className={showValues ? "w-full" : "w-full"} aria-label={`実数値帯 ${stats.decreasingMin}から${stats.increasingMax}`}>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-2 h-1.5 rounded-full bg-slate-200" />
        <div className="absolute top-2 h-1.5 rounded-full bg-slate-300" style={{ left: `${start}%`, width: `${end - start}%` }} />
        {SPEED_POINTS.map((point) => (
          <span
            key={point.key}
            title={point.label}
            className={`absolute top-1 size-3 -translate-x-1/2 rounded-full border-2 border-white shadow-sm ${point.color}`}
            style={{ left: `${getScalePosition(stats[point.key], scale)}%` }}
          />
        ))}
      </div>
      {showValues && (
        <div className="grid grid-cols-4 text-center text-[10px] font-black leading-none tabular-nums">
          {SPEED_POINTS.map((point) => <span key={point.key} className={point.textColor}>{stats[point.key]}</span>)}
        </div>
      )}
    </div>
  );
}
