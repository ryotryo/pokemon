import pokemonNamesJa from "../../data/i18n/pokemon-names-ja.json";

const names = pokemonNamesJa as Record<string, string>;

export const TYPE_NAMES_JA: Record<string, string> = {
  normal: "ノーマル", fire: "ほのお", water: "みず", electric: "でんき", grass: "くさ", ice: "こおり",
  fighting: "かくとう", poison: "どく", ground: "じめん", flying: "ひこう", psychic: "エスパー", bug: "むし",
  rock: "いわ", ghost: "ゴースト", dragon: "ドラゴン", dark: "あく", steel: "はがね", fairy: "フェアリー",
};

export function getPokemonDisplayNameJa(id: string, fallback: string): string {
  return names[id] ?? fallback;
}

export function getTypeDisplayNameJa(type: string): string {
  return TYPE_NAMES_JA[type.toLowerCase()] ?? type;
}
