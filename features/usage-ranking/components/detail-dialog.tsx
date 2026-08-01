"use client";

import type { ReactNode } from "react";
import { Sheet, SheetOverlay } from "@/components/ui/sheet";

export function DetailDialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetOverlay onClick={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div className="pointer-events-auto relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 shadow-2xl">
          <button type="button" aria-label="閉じる" onClick={onClose} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-600 active:bg-slate-200">×</button>
          {children}
        </div>
      </div>
    </Sheet>
  );
}
