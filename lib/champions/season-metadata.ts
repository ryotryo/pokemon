export interface SeasonDisplayMetadata {
  seasonLabel: string;
  sourceGeneratedAt?: string;
  dailyDataPeriod?: { start: string; end: string };
}

function parseDailyFolder(folder: unknown) {
  if (typeof folder !== "string") return null;
  const match = folder.match(/^([^/]+)\/(\d{2})_(\d{2})_(\d{4})$/);
  if (!match) return null;
  return { season: match[1], date: `${match[4]}-${match[3]}-${match[2]}` };
}

export function getSeasonDisplayMetadata(index: {
  defaultSeason?: unknown;
  battleDataFolders?: unknown;
  dailyDataFolders?: unknown;
  generatedAt?: unknown;
}): SeasonDisplayMetadata {
  const defaultSeason = typeof index.defaultSeason === "string" ? index.defaultSeason : "";
  const battleSeasons = Array.isArray(index.battleDataFolders) ? index.battleDataFolders.filter((value): value is string => typeof value === "string") : [];
  const dailyEntries = Array.isArray(index.dailyDataFolders) ? index.dailyDataFolders.map(parseDailyFolder).filter((value): value is NonNullable<typeof value> => value !== null) : [];
  const currentSeason = dailyEntries[0]?.season ?? battleSeasons[0];
  const seasonLabel = defaultSeason.toLowerCase() === "current" && currentSeason ? currentSeason : defaultSeason;
  const relevantDates = dailyEntries.filter((entry) => !seasonLabel || entry.season === seasonLabel).map((entry) => entry.date).sort();

  return {
    seasonLabel,
    ...(typeof index.generatedAt === "string" ? { sourceGeneratedAt: index.generatedAt } : {}),
    ...(relevantDates.length ? { dailyDataPeriod: { start: relevantDates[0], end: relevantDates.at(-1)! } } : {}),
  };
}
