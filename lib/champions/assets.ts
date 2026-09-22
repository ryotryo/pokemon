export const CHAMPIONS_ASSET_BASE_URL = "https://championsbattledata.com/pokemon_champions_assets";

export const CHAMPIONS_TYPES = [
  "bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying", "ghost",
  "grass", "ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water",
] as const;

export type ChampionsAssetType = (typeof CHAMPIONS_TYPES)[number];

const TYPE_ALIASES: Record<string, ChampionsAssetType> = {
  むし: "bug", あく: "dark", ドラゴン: "dragon", でんき: "electric", フェアリー: "fairy", かくとう: "fighting",
  ほのお: "fire", ひこう: "flying", ゴースト: "ghost", くさ: "grass", じめん: "ground", こおり: "ice",
  ノーマル: "normal", どく: "poison", エスパー: "psychic", いわ: "rock", はがね: "steel", みず: "water",
};

function assetUrl(folder: string, filename: string | null | undefined): string | null {
  const clean = filename?.trim();
  if (!clean || clean.includes("/") || clean.includes("\\")) return null;
  return `${CHAMPIONS_ASSET_BASE_URL}/${folder}/${encodeURIComponent(clean)}.png`;
}

function pokemonFilename(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  try {
    const pathname = imagePath.startsWith("http") ? new URL(imagePath).pathname : imagePath;
    const decoded = decodeURIComponent(pathname);
    const filename = decoded.split("/").at(-1)?.replace(/\.png$/i, "").trim();
    return filename || null;
  } catch {
    return null;
  }
}

export function getPokemonAssetUrl(imagePath: string | null | undefined): string | null {
  return assetUrl("pokemon", pokemonFilename(imagePath));
}

export function getPokemonMiniAssetUrl(imagePath: string | null | undefined): string | null {
  return assetUrl("pokemon_mini", pokemonFilename(imagePath));
}

export function getTypeAssetUrl(type: string | null | undefined): string | null {
  const input = type?.trim();
  const normalized = input ? TYPE_ALIASES[input] ?? input.toLowerCase() : undefined;
  if (!normalized || !CHAMPIONS_TYPES.includes(normalized as ChampionsAssetType)) return null;
  return assetUrl("types", normalized[0].toUpperCase() + normalized.slice(1));
}

export function getItemAssetUrl(canonicalName: string | null | undefined): string | null {
  return assetUrl("items", canonicalName);
}
