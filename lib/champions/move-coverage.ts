const NON_COVERAGE_DAMAGE_MOVES = new Set([
  "bide",
  "comeuppance",
  "counter",
  "dragon-rage",
  "endeavor",
  "final-gambit",
  "fissure",
  "guardian-of-alola",
  "guillotine",
  "horn-drill",
  "metal-burst",
  "mirror-coat",
  "natures-madness",
  "night-shade",
  "psywave",
  "retaliate",
  "ruination",
  "seismic-toss",
  "sheer-cold",
  "sonic-boom",
  "super-fang",
]);

export function isCoverageMove(id: string, damageClass: string, metaCategory: string): boolean {
  if (damageClass !== "physical" && damageClass !== "special") return false;
  if (metaCategory === "ohko") return false;
  return !NON_COVERAGE_DAMAGE_MOVES.has(id);
}
