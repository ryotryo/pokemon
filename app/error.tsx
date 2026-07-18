"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
      <div className="max-w-sm text-center">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-700">POKÉMON CHAMPIONS</p>
        <h1 className="mt-2 text-2xl font-black">画面を表示できませんでした</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">静的データの読み込みに失敗しました。少し待ってから再試行してください。</p>
        <button className="mt-5 h-11 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white" onClick={reset}>再試行</button>
      </div>
    </main>
  );
}
