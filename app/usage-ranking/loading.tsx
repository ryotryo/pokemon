export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-3 py-7" aria-label="読み込み中">
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="mt-5 h-9 w-52 rounded bg-slate-200" />
        <div className="mt-7 h-12 rounded-xl bg-slate-200" />
        <div className="mt-5 space-y-2">{Array.from({ length: 7 }, (_, index) => <div key={index} className="h-16 rounded-xl bg-slate-200" />)}</div>
      </div>
    </main>
  );
}
