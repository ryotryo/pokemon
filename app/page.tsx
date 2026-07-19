import Link from "next/link";

const tools = [
  {
    title: "パーティ相性チェッカー",
    description: "自分の6匹のパーティが、使用率上位ポケモンへどの程度弱点を突けるか確認できます。",
    href: "/party-check/",
    available: true,
  },
  {
    title: "技分析",
    description: "ポケモンごとの使用技や技タイプを分析する機能です。",
    available: false,
  },
  {
    title: "ポケモンランキング",
    description: "使用率や対戦環境データを見る機能です。",
    available: false,
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <header className="mb-10">
          <p className="text-xs font-black tracking-[0.2em] text-blue-700">POKÉ ANALYTICS</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Poké Analytics</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">ポケモン対戦をデータで分析するツールサイト</p>
        </header>

        <section aria-labelledby="available-tools">
          <div className="mb-4 flex items-center gap-3">
            <h2 id="available-tools" className="text-lg font-black">現在利用可能</h2>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          {tools.filter((tool) => tool.available).map((tool) => (
            <Link key={tool.title} href={tool.href} className="group block rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-blue-700">POKÉMON CHAMPIONS</p>
                  <h3 className="mt-2 text-xl font-black">{tool.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
                </div>
                <span aria-hidden="true" className="mt-1 text-2xl text-blue-700 transition group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-5 text-sm font-bold text-blue-700">ツールを開く</p>
            </Link>
          ))}
        </section>

        <section className="mt-10" aria-labelledby="planned-tools">
          <div className="mb-4 flex items-center gap-3">
            <h2 id="planned-tools" className="text-lg font-black">今後追加予定</h2>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.filter((tool) => !tool.available).map((tool) => (
              <article key={tool.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black">{tool.title}</h3>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">準備中</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">{tool.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500">
          Pokémon、Nintendo、Game Freak、Creaturesとは関係のない非公式ツールサイトです。
        </footer>
      </div>
    </main>
  );
}
