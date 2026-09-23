"use client";

import Image from "next/image";
import { useState } from "react";
import { getItemAssetUrl, getPokemonAssetUrl, getPokemonMiniAssetUrl, getTypeAssetUrl } from "../../lib/champions/assets";

const sizeClasses = { xxs: "size-4", xs: "size-5", sm: "size-7", md: "size-11", lg: "size-24" } as const;
type AssetSize = keyof typeof sizeClasses;

function GameAssetImage({ sources, alt, size, className = "", fallback = null, priority = false }: { sources: Array<string | null>; alt: string; size: AssetSize; className?: string; fallback?: React.ReactNode; priority?: boolean }) {
  const validSources = sources.filter((source): source is string => Boolean(source));
  const [sourceIndex, setSourceIndex] = useState(0);
  const source = validSources[sourceIndex];
  if (!source) return fallback;
  const pixels = { xxs: 16, xs: 20, sm: 28, md: 44, lg: 96 }[size];
  return <Image src={source} alt={alt} width={pixels} height={pixels} priority={priority} loading={priority ? undefined : "lazy"} unoptimized onError={() => setSourceIndex((index) => index + 1)} className={`${sizeClasses[size]} shrink-0 object-contain ${className}`} />;
}

export function PokemonAssetImage({ imagePath, name, size = "md", mini = false, decorative = false, priority = false, className }: { imagePath: string | null | undefined; name: string; size?: AssetSize; mini?: boolean; decorative?: boolean; priority?: boolean; className?: string }) {
  const normal = getPokemonAssetUrl(imagePath);
  const sources = mini ? [getPokemonMiniAssetUrl(imagePath), normal] : [normal];
  return <GameAssetImage sources={sources} alt={decorative ? "" : `${name}の画像`} size={size} priority={priority} className={className} fallback={<span aria-hidden={decorative ? "true" : undefined} aria-label={decorative ? undefined : `${name}の画像を表示できません`} className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400`}>？</span>} />;
}

export function ItemAssetImage({ canonicalName, nameJa, size = "sm", decorative = true, className }: { canonicalName: string | null | undefined; nameJa: string; size?: AssetSize; decorative?: boolean; className?: string }) {
  return <GameAssetImage sources={[getItemAssetUrl(canonicalName)]} alt={decorative ? "" : `${nameJa}の画像`} size={size} className={className} />;
}

export function TypeAssetImage({ type, nameJa, size = "xs", decorative = true, className }: { type: string; nameJa: string; size?: AssetSize; decorative?: boolean; className?: string }) {
  return <GameAssetImage sources={[getTypeAssetUrl(type)]} alt={decorative ? "" : `${nameJa}タイプ`} size={size} className={className} />;
}
