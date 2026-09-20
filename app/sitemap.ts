import type { MetadataRoute } from "next";
import { battleBasicsArticles } from "../content/battle-basics";
import { pokemonIntros } from "../content/pokemon-intros";

const baseUrl = "https://poke-analytics.com";
const staticRoutes = ["", "/party-check", "/speed-ranking", "/usage-ranking", "/damage-chart", "/move-search", "/pokemon-intro", "/pokemon-roles", "/battle-basics"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}/`, changeFrequency: "weekly" as const })),
    ...pokemonIntros.map((article) => ({ url: `${baseUrl}/pokemon-intro/${article.pokemonId}/`, changeFrequency: "monthly" as const })),
    ...battleBasicsArticles.map((article) => ({ url: `${baseUrl}/battle-basics/${article.slug}/`, changeFrequency: "monthly" as const })),
  ];
}
