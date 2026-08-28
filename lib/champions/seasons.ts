export function latestNumberedSeason(seasons: string[]): string | null {
  return seasons
    .filter((season) => /^M\d+$/i.test(season))
    .sort((a, b) => Number(b.slice(1)) - Number(a.slice(1)))[0]
    ?.toUpperCase() ?? null;
}
