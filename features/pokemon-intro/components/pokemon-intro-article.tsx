import Link from "next/link";
import { DamageClassBadge, TypeBadge } from "@/components/ui/type-badge";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";
import type { PokemonIntro } from "@/content/pokemon-intros";
import type { UsageRankingPokemon } from "@/lib/champions/usage-ranking";
import type { PokemonBaseStats } from "@/lib/champions/speed-ranking";
import { formatMoveAccuracy, formatMovePower, type ResolvedPokemonIntroMove } from "@/lib/champions/pokemon-intro-moves";

const statLabels: Array<[keyof PokemonBaseStats,string]> = [["hp","HP"],["attack","攻撃"],["defense","防御"],["specialAttack","特攻"],["specialDefense","特防"],["speed","素早さ"]];
function Heading({children}:{children:React.ReactNode}) { return <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-black">{children}</h2>; }
function TextList({items}:{items:string[]}) { return <ul className="mt-3 space-y-2">{items.map((item)=><li key={item} className="flex gap-2 text-sm leading-7 text-slate-700"><span className="font-black text-blue-600">・</span><span>{item}</span></li>)}</ul>; }

export function PokemonIntroArticle({ intro, pokemon, stats, featuredMoves }: { intro: PokemonIntro; pokemon: UsageRankingPokemon; stats: PokemonBaseStats; featuredMoves: ResolvedPokemonIntroMove[] }) {
  return <article>
    <Link href="/pokemon-intro/" className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700">← 一覧へ戻る</Link>
    <header className="mt-1 border-b border-slate-200 pb-5">
      <p className="text-xs font-bold text-blue-700">このポケモンってどんなポケモン？</p>
      <div className="mt-2 flex items-center gap-4"><PokemonImage src={pokemon.sprite} name={pokemon.displayNameJa} size={96}/><div><h1 className="text-2xl font-black sm:text-3xl">{pokemon.displayNameJa}</h1><div className="mt-2 flex gap-1">{pokemon.types.map(type=><TypeBadge key={type} type={type}/>)}</div></div></div>
      <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-slate-200 sm:grid-cols-6">{statLabels.map(([key,label])=><div key={key} className="bg-white px-2 py-2 text-center"><dt className="text-[10px] font-bold text-slate-500">{label}</dt><dd className="text-sm font-black">{stats[key]}</dd></div>)}</dl>
      <div className="mt-4 rounded-2xl bg-blue-50 p-4"><p className="text-[10px] font-black text-blue-700">ひとことで</p><p className="mt-1 text-lg font-black text-blue-950">{intro.summary}</p><div className="mt-2 flex flex-wrap gap-1.5">{intro.roles.map(role=><span key={role} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-blue-700">{role}</span>)}</div></div>
    </header>
    <div className="mt-7 space-y-8">
      <section><Heading>どんなポケモン？</Heading><div className="mt-3 space-y-3">{intro.overview.map(p=><p key={p} className="text-sm leading-7 text-slate-700">{p}</p>)}</div></section>
      <section><Heading>得意なこと</Heading><TextList items={intro.strengths}/></section>
      <section><Heading>よく使う技</Heading><div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-4">{featuredMoves.map(({ move, purpose })=><article key={move.id} className="py-3.5"><div className="flex flex-wrap items-center gap-1.5"><h3 className="mr-1 text-sm font-black">{move.nameJa}</h3><TypeBadge type={move.type}/><DamageClassBadge damageClass={move.damageClass}/></div><dl className="mt-2 flex gap-4 text-[11px] text-slate-500"><div><dt className="inline">威力 </dt><dd className="inline font-bold text-slate-700">{formatMovePower(move)}</dd></div><div><dt className="inline">命中 </dt><dd className="inline font-bold text-slate-700">{formatMoveAccuracy(move)}</dd></div></dl><p className="mt-2 whitespace-pre-line text-xs leading-6 text-slate-600">{move.descriptionJa}</p><p className="mt-2 border-l-2 border-blue-200 pl-2 text-xs leading-6 text-slate-700"><span className="font-bold text-blue-700">このポケモンでの役割：</span>{purpose}</p></article>)}</div></section>
      <section><Heading>覚えておきたい特徴</Heading><TextList items={intro.keyFeatures}/></section>
      <section><Heading>苦手なこと</Heading><TextList items={intro.weaknesses}/></section>
      <section className="rounded-2xl border border-blue-100 bg-white p-4"><Heading>つまりこんなポケモン</Heading><p className="mt-3 text-sm font-medium leading-7 text-slate-700">{intro.closingSummary}</p></section>
    </div>
  </article>;
}
