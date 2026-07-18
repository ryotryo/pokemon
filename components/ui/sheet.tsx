"use client";

import { useEffect, type ReactNode } from "react";

export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, onOpenChange]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">{children}</div>;
}

export function SheetOverlay({ onClick }: { onClick: () => void }) { return <button aria-label="閉じる" className="absolute inset-0 bg-slate-950/50" onClick={onClick} />; }
export function SheetContent({ children }: { children: ReactNode }) { return <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />{children}</div>; }
