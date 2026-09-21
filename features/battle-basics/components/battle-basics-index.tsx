import Link from "next/link";
import { SiteIcon } from "@/components/ui/site-icon";
import { battleBasicsArticles, battleBasicsCategories, beginnerCourseArticles } from "@/content/battle-basics";

export function BattleBasicsIndex() {
  return <>
    <section aria-labelledby="beginner-course" className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-bold text-blue-700">はじめての人はこちら</p>
      <h2 id="beginner-course" className="mt-1 text-xl font-black">完全初心者コース</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">第1回から第45回まで、対戦画面の見方から実戦で役立つ仕組みや考え方まで順番に学べます。気になる記事だけ読んでも大丈夫です。</p>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {beginnerCourseArticles.map((article) => <li key={article.slug}>
          <Link href={`/battle-basics/${article.slug}/`} className="group flex h-full gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-700">{article.beginnerCourseOrder}</span>
            {article.icon ? <span aria-hidden="true" className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><SiteIcon name={article.icon} className="size-4.5" /></span> : null}
            <span className="min-w-0"><strong className="block text-sm font-black group-hover:text-blue-700">{article.title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{article.description}</span></span>
          </Link>
        </li>)}
      </ol>
    </section>

    <section aria-labelledby="categories" className="mt-8">
      <h2 id="categories" className="text-xl font-black">テーマから探す</h2>
      <div className="mt-3 space-y-3">
        {[...battleBasicsCategories].sort((a, b) => a.order - b.order).map((category) => {
          const articles = battleBasicsArticles.filter((article) => article.categoryId === category.id);
          return <section key={category.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex gap-3"><span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><SiteIcon name={category.icon} className="size-5" /></span><div><p className="text-[10px] font-black text-blue-600">CATEGORY {category.order}</p><h3 className="font-black">{category.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{category.description}</p></div></div>
            {articles.length > 0 ? <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">{articles.map((article) => <li key={article.slug}><Link href={`/battle-basics/${article.slug}/`} className="flex min-h-11 items-center gap-2.5 py-2 text-sm font-bold text-slate-700 hover:text-blue-700">{article.icon ? <SiteIcon name={article.icon} className="size-4.5 shrink-0 text-slate-500" /> : null}<span className="min-w-0 flex-1">{article.title}</span><span aria-hidden="true" className="text-blue-600">→</span></Link></li>)}</ul> : <p className="mt-3 text-xs text-slate-400">公開中の記事はまだありません。</p>}
          </section>;
        })}
      </div>
    </section>
  </>;
}
