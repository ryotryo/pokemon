"use client";

import type { UsageAbilityRow } from "@/lib/champions/usage-ranking";
import { DetailDialog } from "./detail-dialog";

export function AbilityDetailSheet({ ability, onClose }: { ability: UsageAbilityRow | null; onClose: () => void }) {
  return (
    <DetailDialog open={ability !== null} onClose={onClose}>
      {ability && (
        <div>
          <h2 className="pr-10 text-xl font-black">{ability.nameJa}</h2>
          {ability.descriptionJa && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{ability.descriptionJa}</p>}
        </div>
      )}
    </DetailDialog>
  );
}
