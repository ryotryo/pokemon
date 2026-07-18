/* eslint-disable @typescript-eslint/no-explicit-any -- External API values are validated during the publish pipeline. */
import type { BattleFormat, ChampionPokemon, FormRelation, MoveMasterEntry } from "./types";

export const slugifyMove = (name: string) => name.toLowerCase().normalize("NFKD").replace(/[.'’:,]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const slugifyPokemon = (name: string) => name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function classifyForm(formKind: string): FormRelation {
  if (/^mega(?:\s|$)/i.test(formKind)) return "mega";
  return formKind === "Base" ? "base" : "independent";
}

export function getAttachedForms(entry: any) {
  const primary = entry.summary?.primary;
  const primaryRelation = classifyForm(primary?.form_kind || "Base");
  return (entry.summary?.forms ?? []).filter((form: any) => {
    const relation = classifyForm(form.form_kind || "Base");
    return form.slug === entry.slug || (relation === "mega" && primaryRelation === "base");
  });
}

export function getRanking(indexPokemon: any[], season: string, format: BattleFormat, limit?: number) {
  return indexPokemon
    .map((entry) => {
      const summary = entry.summary?.battleSummary?.[season]?.[format];
      const rank = summary?.rows?.find((row: any) => row.column_position)?.column_position;
      return { entry, rank: Number(rank) };
    })
    .filter(({ rank }) => Number.isInteger(rank) && rank > 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
}

export function normalizePokemon(entry: any, rank: number, battle: any, moves: Record<string, MoveMasterEntry>, namesJa: Record<string, string>): ChampionPokemon {
  const primary = entry.summary?.primary;
  const forms = getAttachedForms(entry).map((form: any) => ({
    id: form.slug || slugifyPokemon(form.saved_name), name: form.saved_name, displayNameJa: namesJa[form.slug] ?? form.saved_name, baseName: entry.name,
    form: form.form_kind === "Base" ? null : form.form_name, formKind: form.form_kind || "Base",
    formRelation: classifyForm(form.form_kind || "Base"),
    types: form.types, sprite: `https://championsbattledata.com/${encodeURI(form.image_path)}`,
  }));
  const normalizedMoves = battle.rows.filter((row: any) => row.category === "move" && row.rank <= 10).map((row: any) => {
    const master = moves[slugifyMove(row.name)];
    return master?.damageClass === "status" || !master ? null : { id: master.id, rank: row.rank, name: row.name, displayNameJa: master.displayNameJa, usage: row.percentage_value, type: master.type, damageClass: master.damageClass, isCoverageMove: master.isCoverageMove };
  }).filter(Boolean);
  return {
    id: entry.slug, name: entry.battleName || entry.name, displayNameJa: namesJa[entry.slug] ?? entry.battleName ?? entry.name, baseName: entry.name,
    form: primary?.form_kind === "Base" ? null : primary?.form_name ?? null, formKind: primary?.form_kind || "Base",
    formRelation: classifyForm(primary?.form_kind || "Base"),
    rank, types: primary?.types ?? [], sprite: `https://championsbattledata.com/${encodeURI(primary?.image_path ?? "")}`,
    forms, moves: normalizedMoves, attackTypes: [...new Set<string>(normalizedMoves.filter((move: any) => move.isCoverageMove).map((move: any) => String(move.type)))],
  };
}
