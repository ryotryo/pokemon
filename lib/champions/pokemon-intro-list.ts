import { normalizeJapaneseSearchText, TYPE_ORDER } from "./display-names";
import type { UsageRankingPokemon } from "./usage-ranking";

export const POKEMON_INTRO_SORTS = ["dex", "name", "singles", "doubles", "speed", "bst"] as const;
export type PokemonIntroSort = (typeof POKEMON_INTRO_SORTS)[number];

export interface PokemonIntroListItem extends UsageRankingPokemon {
  summary: string;
  baseSpeed: number;
  baseStatTotal: number;
}

interface IntroSource { pokemonId: string; summary: string }
interface SpeedSource {
  id: string;
  baseSpeed: number;
  baseStats: Record<string, number>;
}

export function buildPokemonIntroListItems(
  intros: IntroSource[],
  rankingPokemon: UsageRankingPokemon[],
  speedPokemon: SpeedSource[],
): PokemonIntroListItem[] {
  const rankingById = new Map(rankingPokemon.map((entry) => [entry.id, entry]));
  const speedById = new Map(speedPokemon.map((entry) => [entry.id, entry]));

  return intros.map((intro) => {
    const ranking = rankingById.get(intro.pokemonId);
    const speed = speedById.get(intro.pokemonId);
    if (!ranking || !speed) throw new Error(`Pokemon intro list metadata is missing: ${intro.pokemonId}`);
    return {
      ...ranking,
      summary: intro.summary,
      baseSpeed: speed.baseSpeed,
      baseStatTotal: Object.values(speed.baseStats).reduce((total, stat) => total + stat, 0),
    };
  });
}

export function parsePokemonIntroSort(value: string | null | undefined): PokemonIntroSort {
  return POKEMON_INTRO_SORTS.includes(value as PokemonIntroSort) ? value as PokemonIntroSort : "dex";
}

export function parsePokemonIntroType(value: string | null | undefined): string {
  return value && TYPE_ORDER.includes(value) ? value : "all";
}

const jaCollator = new Intl.Collator("ja", { sensitivity: "base", numeric: true });

function compareDex(a: PokemonIntroListItem, b: PokemonIntroListItem): number {
  return a.dexNumber - b.dexNumber || a.formOrder - b.formOrder || jaCollator.compare(a.displayNameJa, b.displayNameJa) || a.id.localeCompare(b.id);
}

function compareRank(a: PokemonIntroListItem, b: PokemonIntroListItem, format: "Singles" | "Doubles"): number {
  return (a.ranks[format] ?? Number.POSITIVE_INFINITY) - (b.ranks[format] ?? Number.POSITIVE_INFINITY) || compareDex(a, b);
}

export function filterAndSortPokemonIntros(
  items: PokemonIntroListItem[],
  options: { query?: string | null; type?: string | null; sort?: string | null },
): PokemonIntroListItem[] {
  const query = normalizeJapaneseSearchText(options.query ?? "");
  const type = parsePokemonIntroType(options.type);
  const sort = parsePokemonIntroSort(options.sort);
  const filtered = items.filter((item) =>
    (!query || normalizeJapaneseSearchText(item.displayNameJa).includes(query)) &&
    (type === "all" || item.types.includes(type)));

  return filtered.sort((a, b) => {
    if (sort === "name") return jaCollator.compare(a.displayNameJa, b.displayNameJa) || compareDex(a, b);
    if (sort === "singles") return compareRank(a, b, "Singles");
    if (sort === "doubles") return compareRank(a, b, "Doubles");
    if (sort === "speed") return b.baseSpeed - a.baseSpeed || compareDex(a, b);
    if (sort === "bst") return b.baseStatTotal - a.baseStatTotal || compareDex(a, b);
    return compareDex(a, b);
  });
}
