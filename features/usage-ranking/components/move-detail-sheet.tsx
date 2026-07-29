"use client";

import { Sheet, SheetOverlay } from "@/components/ui/sheet";
import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
import type { UsageMoveDetail } from "@/lib/champions/usage-ranking";

export function MoveDetailSheet({
  move,
  onClose,
}: {
  move: UsageMoveDetail | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={move !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetOverlay onClick={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div className="pointer-events-auto relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 shadow-2xl">
          <button type="button" aria-label="閉じる" onClick={onClose} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-600 active:bg-slate-200">×</button>
          {move && (
            <div>
              <h2 className="pr-10 text-xl font-black">{move.nameJa}</h2>
              <div className="mt-2 flex items-center gap-1">
                <TypeBadge type={move.type} />
                <DamageClassBadge damageClass={move.damageClass} />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-slate-100 py-3 text-center">
                <div>
                  <dt className="text-[10px] text-slate-400">威力</dt>
                  <dd className="mt-0.5 text-sm font-bold">{move.power ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400">命中</dt>
                  <dd className="mt-0.5 text-sm font-bold">{move.alwaysHits ? "必中" : move.accuracy ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400">PP</dt>
                  <dd className="mt-0.5 text-sm font-bold">{move.pp ?? "—"}</dd>
                </div>
              </dl>
              {move.descriptionJa && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{move.descriptionJa}</p>}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
