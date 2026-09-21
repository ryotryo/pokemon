import itemAssets from "../../data/usage-ranking/item-assets.json";
import itemsJa from "../../data/usage-ranking/items-ja.json";

const canonicalByJapanese = new Map(
  Object.entries(itemsJa).flatMap(([normalized, nameJa]) => {
    const canonicalName = (itemAssets as Record<string, string>)[normalized];
    return canonicalName ? [[nameJa, canonicalName] as const] : [];
  }),
);

export function getItemAssetName(nameJa: string | null | undefined): string | null {
  return nameJa ? canonicalByJapanese.get(nameJa) ?? null : null;
}
