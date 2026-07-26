"use client";

import Image from "next/image";
import { useState } from "react";

export function PokemonImage({ src, name, size }: { src: string; name: string; size: 44 | 96 }) {
  const [failed, setFailed] = useState(false);
  const sizeClass = size === 96 ? "size-24" : "size-11";
  if (failed) {
    return (
      <span
        role="img"
        aria-label={`${name}の画像を表示できません`}
        className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 ${sizeClass}`}
      >
        ？
      </span>
    );
  }
  return <Image src={src} alt={`${name}の画像`} width={size} height={size} unoptimized onError={() => setFailed(true)} className={`${sizeClass} shrink-0 object-contain`} />;
}

