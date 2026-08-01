"use client";

import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
import type { UsageMoveDetail } from "@/lib/champions/usage-ranking";
import { DetailDialog } from "./detail-dialog";

export function MoveDetailSheet({
  move,
  onClose,
}: {
  move: UsageMoveDetail | null;
  onClose: () => void;
}) {
  return (
    <DetailDialog open={move !== null} onClose={onClose}>
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
    </DetailDialog>
  );
}
