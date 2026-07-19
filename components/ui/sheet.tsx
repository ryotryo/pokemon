"use client";

import { createContext, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

const SheetContext = createContext<{ close: () => void } | null>(null);

function useSheet() {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used inside Sheet");
  return context;
}

export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => { onOpenChangeRef.current = onOpenChange; }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const previousBody = { overflow: document.body.style.overflow, position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    const previousHtml = { overflow: document.documentElement.style.overflow, overscrollBehavior: document.documentElement.style.overscrollBehavior };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onOpenChangeRef.current(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      Object.assign(document.body.style, previousBody);
      Object.assign(document.documentElement.style, previousHtml);
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open) return null;
  return <SheetContext.Provider value={{ close: () => onOpenChangeRef.current(false) }}><div className="fixed inset-0 z-50 overscroll-none" role="dialog" aria-modal="true">{children}</div></SheetContext.Provider>;
}

export function SheetOverlay({ onClick }: { onClick: () => void }) {
  return <button type="button" aria-label="閉じる" className="absolute inset-0 touch-none bg-slate-950/50" onClick={onClick} />;
}

export function SheetContent({ children }: { children: ReactNode }) {
  const { close } = useSheet();
  const startY = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;
    startY.current = event.clientY;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    event.preventDefault();
    const nextOffset = Math.max(0, event.clientY - startY.current);
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };
  const finishDrag = () => {
    if (startY.current === null) return;
    startY.current = null;
    setDragging(false);
    if (dragOffsetRef.current >= 72) close();
    else {
      dragOffsetRef.current = 0;
      setDragOffset(0);
    }
  };

  return <div className="absolute inset-x-0 bottom-0 sm:bottom-1/2 sm:left-1/2 sm:right-auto sm:w-[min(32rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:translate-y-1/2">
    <div className={`max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[min(80dvh,48rem)] sm:rounded-3xl ${dragging ? "" : "transition-transform duration-200 ease-out"}`} style={{ transform: `translateY(${dragOffset}px)` }}>
      <div className="sticky top-0 z-10 -mx-5 mb-2 flex h-12 touch-none select-none items-center justify-center rounded-t-3xl bg-white/95 backdrop-blur-sm sm:cursor-grab" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
        <div className="h-1.5 w-12 rounded-full bg-slate-300" aria-hidden="true" />
        <button type="button" aria-label="閉じる" className="absolute right-3 flex size-9 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-600 active:bg-slate-200" onPointerDown={(event) => event.stopPropagation()} onClick={close}>×</button>
      </div>
      {children}
    </div>
  </div>;
}
