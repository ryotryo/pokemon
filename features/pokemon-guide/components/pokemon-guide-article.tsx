import Link from "next/link";
import { TypeBadge } from "@/components/ui/type-badge";
import { guideByPokemonId, sourceById, type GuideMatchup, type PokemonGuide } from "@/content/pokemon-guides";
import { PokemonImage } from "@/features/usage-ranking/components/pokemon-image";
import type { UsageRankingPokemon } from "@/lib/champions/usage-ranking";

function PokemonName({ pokemonId, pokemon }: { pokemonId: string; pokemon: Map<string, UsageRankingPokemon> }) {
  const entry = pokemon.get(pokemonId);
  if (!entry) return <span>{pokemonId}</span>;
  const guide = guideByPokemonId.get(pokemonId);
  const content = <><PokemonImage src={entry.sprite} name={entry.displayNameJa} size={44} /><span className="min-w-0"><b className="block truncate text-sm">{entry.displayNameJa}</b><span className="mt-1 flex flex-wrap gap-1">{entry.types.map((type) => <TypeBadge key={type} type={type} />)}</span></span></>;
  return guide
    ? <Link href={`/pokemon-guide/${guide.slug}/`} className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600">{content}</Link>
    : <span className="flex min-w-0 items-center gap-2">{content}</span>;
}

function MatchupList({ entries, pokemon }: { entries: GuideMatchup[]; pokemon: Map<string, UsageRankingPokemon> }) {
  return (
    <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-3">
      {entries.map((matchup) => (
        <article key={matchup.pokemonId} className="py-3">
          <PokemonName pokemonId={matchup.pokemonId} pokemon={pokemon} />
          <p className="mt-2 text-sm leading-7 text-slate-700">{matchup.explanation}</p>
          {matchup.caution && <p className="mt-1 text-xs leading-6 text-amber-800"><b>注意：</b>{matchup.caution}</p>}
        </article>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-black tracking-tight">{children}</h2>;
}

export function PokemonGuideArticle({ guide, pokemon: entries }: { guide: PokemonGuide; pokemon: UsageRankingPokemon[] }) {
  const pokemon = new Map(entries.map((entry) => [entry.id, entry]));
  const subject = pokemon.get(guide.pokemonId);
  if (!subject) return null;
  const megaForms = entries.filter((entry) => entry.formRelation === "mega" && entry.battleId === subject.battleId);
  const sources = guide.sourceIds.flatMap((id) => sourceById.get(id) ?? []);
  return (
    <article>
      <Link href="/pokemon-guide/" className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">← ポケモン使い方解説</Link>
      <header className="mt-2 border-b border-slate-200 pb-5">
        <p className="text-xs font-bold text-blue-700">Pokémon Champions・シングル</p>
        <div className="mt-2 flex items-center gap-4">
          <PokemonImage src={subject.sprite} name={subject.displayNameJa} size={96} />
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-black tracking-tight sm:text-3xl">{subject.displayNameJa}の使い方｜シングル</h1>
            <div className="mt-2 flex flex-wrap gap-1">{subject.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
            <p className="mt-2 text-xs font-bold text-slate-500">M5 制作時シングル第{guide.rankAtCreation}位</p>
          </div>
        </div>
        {!!megaForms.length && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-slate-100 px-3 py-2">
            <span className="text-[10px] font-bold text-slate-500">同じ使用率へ集約されるMega</span>
            {megaForms.map((mega) => <span key={mega.id} className="inline-flex items-center gap-1.5 text-xs font-bold">{mega.displayNameJa}<span className="flex gap-1">{mega.types.map((type) => <TypeBadge key={type} type={type} />)}</span></span>)}
          </div>
        )}
        <p className="mt-4 text-sm leading-7 text-slate-600">{guide.summary}</p>
        <Link href={`/usage-ranking/${guide.pokemonId}/?format=singles`} className="mt-3 inline-flex min-h-10 items-center rounded-full bg-blue-50 px-4 text-xs font-bold text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">現在の使用技・持ち物を見る →</Link>
      </header>

      <div className="mt-7 space-y-9">
        <section><SectionTitle>基本の使い方</SectionTitle><div className="mt-3 space-y-3">{guide.basicUsage.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-slate-700">{paragraph}</p>)}</div></section>
        <section><SectionTitle>得意な相手</SectionTitle><MatchupList entries={guide.favorableMatchups} pokemon={pokemon} /></section>
        <section><SectionTitle>苦手な相手</SectionTitle><MatchupList entries={guide.unfavorableMatchups} pokemon={pokemon} /></section>
        <section>
          <SectionTitle>苦手な相手への対策</SectionTitle>
          <div className="mt-3 space-y-3">
            {guide.countermeasures.map((measure) => (
              <article key={measure.title} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <h3 className="text-sm font-black text-blue-950">{measure.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{measure.body}</p>
                {!!measure.teammatePokemonIds?.length && <div className="mt-3 grid gap-2 min-[360px]:grid-cols-2">{measure.teammatePokemonIds.map((id) => <PokemonName key={id} pokemonId={id} pokemon={pokemon} />)}</div>}
              </article>
            ))}
          </div>
        </section>
        <section><SectionTitle>初めて使うなら</SectionTitle><div className="mt-3 space-y-3">{guide.beginnerSummary.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-slate-700">{paragraph}</p>)}</div></section>
        <section>
          <SectionTitle>参考にした構築記事</SectionTitle>
          <p className="mt-3 text-xs leading-6 text-slate-500">M3〜M5は使用可能なポケモンプールが同じため、M5の現行データと照合したうえで参照しています。本文は記事内容を要約し、転載していません。</p>
          <ul className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-3">
            {sources.map((source) => (
              <li key={source.id} className="py-3">
                <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-bold leading-6 text-blue-800 underline decoration-blue-200 underline-offset-2">{source.title}</a>
                <p className="mt-1 text-xs leading-5 text-slate-500">{source.author}・{source.season}{source.achievement ? `・${source.achievement}` : ""}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
