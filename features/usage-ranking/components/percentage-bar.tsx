export function PercentageBar({ value }: { value: number | null }) {
  if (value === null || !Number.isFinite(value)) return null;
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
      <div className="h-full rounded-full bg-blue-600" style={{ width: `${width}%` }} />
    </div>
  );
}

