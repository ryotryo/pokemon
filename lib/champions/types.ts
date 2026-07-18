export type BattleFormat = "Singles" | "Doubles";
export type DamageClass = "physical" | "special";
export type FormRelation = "base" | "mega" | "independent";

export interface MoveMasterEntry {
  id: string;
  name: string;
  displayNameJa: string;
  type: string;
  damageClass: "physical" | "special" | "status";
  metaCategory: string;
  isCoverageMove: boolean;
  source: "pokeapi";
}

export interface ChampionPokemon {
  id: string;
  name: string;
  displayNameJa: string;
  baseName: string;
  form: string | null;
  formKind: string;
  formRelation: FormRelation;
  rank: number;
  types: string[];
  sprite: string;
  forms: Array<{ id: string; name: string; displayNameJa: string; form: string | null; formKind: string; formRelation: FormRelation; types: string[]; sprite: string }>;
  moves: Array<{ id: string; rank: number; name: string; displayNameJa: string; usage: number; type: string; damageClass: DamageClass; isCoverageMove: boolean }>;
  attackTypes: string[];
}

export interface ChampionsDataset {
  season: string;
  format: BattleFormat;
  updatedAt: string;
  source: string;
  pokemon: ChampionPokemon[];
}
