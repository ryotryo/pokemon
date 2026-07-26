import { getTypeDisplayNameJa } from "@/lib/champions/display-names";
import type { DamageClass } from "@/lib/champions/types";

const TYPE_COLORS: Record<string, string> = {
  fire: "bg-red-100 text-red-700",
  water: "bg-blue-100 text-blue-700",
  grass: "bg-green-100 text-green-700",
  electric: "bg-yellow-100 text-yellow-800",
  ice: "bg-cyan-100 text-cyan-800",
  fighting: "bg-orange-100 text-orange-800",
  poison: "bg-purple-100 text-purple-700",
  ground: "bg-amber-100 text-amber-800",
  flying: "bg-sky-100 text-sky-700",
  psychic: "bg-pink-100 text-pink-700",
  bug: "bg-lime-100 text-lime-800",
  rock: "bg-stone-200 text-stone-700",
  ghost: "bg-violet-100 text-violet-700",
  dragon: "bg-indigo-100 text-indigo-700",
  dark: "bg-slate-200 text-slate-800",
  steel: "bg-zinc-200 text-zinc-700",
  fairy: "bg-fuchsia-100 text-fuchsia-700",
  normal: "bg-neutral-200 text-neutral-700",
};

const DAMAGE_CLASS_STYLES: Record<DamageClass, string> = {
  physical: "bg-red-100 text-red-700",
  special: "bg-blue-100 text-blue-700",
  status: "bg-emerald-100 text-emerald-700",
};

const DAMAGE_CLASS_LABELS: Record<DamageClass, string> = {
  physical: "物理",
  special: "特殊",
  status: "変化",
};

const badgeBase = "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-4";

export function TypeBadge({ type }: { type: string }) {
  return <span className={`${badgeBase} ${TYPE_COLORS[type.toLowerCase()] ?? "bg-slate-100 text-slate-700"}`}>{getTypeDisplayNameJa(type)}</span>;
}

export function DamageClassBadge({ damageClass }: { damageClass: DamageClass }) {
  return <span className={`${badgeBase} ${DAMAGE_CLASS_STYLES[damageClass]}`}>{DAMAGE_CLASS_LABELS[damageClass]}</span>;
}
