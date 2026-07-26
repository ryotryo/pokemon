const IMAGE_PATH_OVERRIDES: Record<string, string> = {
  "fan-rotom": "pokemon_champions_assets/pokemon/Rotom Fan.png",
};

export function getChampionsSprite(pokemonId: string, imagePath: string): string {
  const resolvedPath = IMAGE_PATH_OVERRIDES[pokemonId] ?? imagePath;
  return `https://championsbattledata.com/${encodeURI(resolvedPath)}`;
}
