import { PokemonAssetImage } from "@/components/ui/game-asset-image";

export function PokemonImage({ src, name, size, mini = false, decorative = false }: { src: string; name: string; size: 24 | 44 | 96; mini?: boolean; decorative?: boolean }) {
  const assetSize = size === 96 ? "lg" : size === 44 ? "md" : "xs";
  return <PokemonAssetImage imagePath={src} name={name} size={assetSize} mini={mini} decorative={decorative} priority={size === 96} />;
}
