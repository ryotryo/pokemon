import Link from "next/link";
import { battleBasicsArticleBySlug, battleBasicsCategories, battleBasicsTools, beginnerCourseArticles, type BattleBasicsArticle } from "@/content/battle-basics";

export function BattleBasicsArticle({ article }: { article: BattleBasicsArticle }) {
  const category = battleBasicsCategories.find((entry) => entry.id === article.categoryId)!;
  const courseIndex = beginnerCourseArticles.findIndex((entry) => entry.slug === article.slug);
  const previous = courseIndex > 0 ? beginnerCourseArticles[courseIndex - 1] : null;
  const next = courseIndex < beginnerCourseArticles.length - 1 ? beginnerCourseArticles[courseIndex + 1] : null;
  const related = article.relatedArticleSlugs.map((slug) => battleBasicsArticleBySlug.get(slug)).filter((entry): entry is BattleBasicsArticle => Boolean(entry));

  return <article>
    <Link href="/battle-basics/" className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700">← 基礎記事の一覧へ</Link>
    <header className="mt-1 border-b border-slate-200 pb-5">
      <p className="text-xs font-bold text-blue-700">完全初心者コース 第{article.beginnerCourseOrder}回</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{article.title}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">{article.description}</p>
      <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">{category.name}</p>
    </header>

    <div className="mt-7 space-y-8">
      {article.sections.map((section) => <section key={section.heading}>
        <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-black">{section.heading}</h2>
        <div className="mt-3 space-y-3">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-slate-700">{paragraph}</p>)}</div>
        {section.bullets ? <ul className="mt-3 space-y-2 rounded-2xl bg-white px-4 py-3">{section.bullets.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="font-black text-blue-600">・</span><span>{item}</span></li>)}</ul> : null}
        {section.facts ? <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{section.facts.map((fact) => <div key={fact.label} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center"><dt className="text-xs font-bold text-slate-500">{fact.label}</dt><dd className="mt-1 text-sm font-black text-slate-800">{fact.value}</dd></div>)}</dl> : null}
        {section.takeaway ? <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"><p className="text-[10px] font-black text-blue-700">ここだけ覚えればOK</p><p className="mt-1 text-sm font-bold leading-6 text-blue-950">{section.takeaway}</p></div> : null}
      </section>)}
    </div>

    <nav aria-label="初心者コースの記事移動" className="mt-9 grid grid-cols-2 gap-2 border-t border-slate-200 pt-5">
      {previous ? <Link href={`/battle-basics/${previous.slug}/`} className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500 hover:border-blue-300"><span className="font-bold">← 前の記事</span><strong className="mt-1 block text-sm leading-5 text-slate-800">{previous.title}</strong></Link> : <span />}
      {next ? <Link href={`/battle-basics/${next.slug}/`} className="rounded-xl border border-slate-200 bg-white p-3 text-right text-xs text-slate-500 hover:border-blue-300"><span className="font-bold">次の記事 →</span><strong className="mt-1 block text-sm leading-5 text-slate-800">{next.title}</strong></Link> : <span />}
    </nav>

    {related.length ? <section className="mt-8"><h2 className="text-lg font-black">関連する基礎記事</h2><ul className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-4">{related.map((entry) => <li key={entry.slug}><Link href={`/battle-basics/${entry.slug}/`} className="flex min-h-12 items-center justify-between gap-3 py-2 text-sm font-bold text-slate-700 hover:text-blue-700"><span>{entry.title}</span><span aria-hidden="true" className="text-blue-600">→</span></Link></li>)}</ul></section> : null}
    {article.relatedTools.length ? <section className="mt-8"><h2 className="text-lg font-black">実際に調べてみる</h2><div className="mt-2 grid gap-2 sm:grid-cols-2">{article.relatedTools.map((toolId) => { const tool = battleBasicsTools[toolId]; return <Link key={toolId} href={tool.href} className="rounded-2xl border border-blue-100 bg-white p-4 hover:border-blue-300"><strong className="text-sm font-black">{tool.title}</strong><span className="mt-1 block text-xs text-slate-500">{tool.description} →</span></Link>; })}</div></section> : null}
  </article>;
}
