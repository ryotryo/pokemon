"use client";

import type { BattleFormat } from "@/lib/champions/types";

export function FormatToggle({ value, onChange }: { value: BattleFormat; onChange: (format: BattleFormat) => void }) {
  return (
    <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="group" aria-label="バトル形式">
      {(["Singles", "Doubles"] as const).map((format) => {
        const selected = value === format;
        return (
          <button
            key={format}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(format)}
            className={`min-h-11 rounded-lg px-4 text-sm font-bold transition ${selected ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            {format === "Singles" ? "シングル" : "ダブル"}
          </button>
        );
      })}
    </div>
  );
}

