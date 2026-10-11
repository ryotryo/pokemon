import { readFile, writeFile, mkdir } from "node:fs/promises";

// フォームの結び付けは検証済みのpersonalIdを保持する。未知のフォームは黙って通常種へ寄せない。
interface Mechanics {
  sourceCommit: string;
  pokemon: Record<string, { weightKg: number; personalId: string }>;
  pokemonById: Record<string, { weightKg: number; personalId: string }>;
  moves: Record<string, { priority: number; spread: boolean }>;
}
const destination = "data/damage-chart/mechanics.json";
const previous = JSON.parse(await readFile(destination, "utf8")) as Mechanics;
const { champoutCommit } = JSON.parse(
  await readFile("data/usage-ranking/metadata.json", "utf8"),
) as { champoutCommit: string };
if (!/^[a-f0-9]{40}$/.test(champoutCommit))
  throw new Error("Invalid Champions snapshot commit");
const root = `https://raw.githubusercontent.com/projectpokemon/champout/${champoutCommit}`;
async function fetchText(file: string) {
  const response = await fetch(`${root}/${file}`);
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
  return response.text();
}
const [personalRaw, dump, movesRaw, indexRaw] = await Promise.all([
  fetchText("masterdata/personal.json"),
  fetchText("parse/personal_dump.txt"),
  fetchText("masterdata/waza.json"),
  readFile("data/usage-ranking/index.json", "utf8"),
]);
const personal = JSON.parse(personalRaw) as Array<{
  id: string;
  no: string;
  weight: string;
  hp: string;
  atk: string;
  def: string;
  spatk: string;
  spdef: string;
  agi: string;
}>;
const headings = [...dump.matchAll(/^(\d{4}) - (.+)$/gm)];
if (
  personal.length !== headings.length ||
  personal.some((p, i) => Number(p.no) !== Number(headings[i][1]))
)
  throw new Error("Personal dump and master data are out of sync");
const normalize = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, "");
const pokemon = Object.fromEntries(
  personal.map((p, i) => [
    normalize(headings[i][2]),
    { weightKg: Number(p.weight) / 10, personalId: p.id },
  ]),
);
const byPersonalId = new Map(
  personal.map((p) => [
    p.id,
    { weightKg: Number(p.weight) / 10, personalId: p.id },
  ]),
);
const speed = JSON.parse(
  await readFile("data/champions/speed-ranking.json", "utf8"),
) as { pokemon: Array<{ id: string; baseStats: Record<string, number> }> };
const statsById = new Map(speed.pokemon.map((p) => [p.id, p.baseStats]));
const sourceByPersonalId = new Map(personal.map((p) => [p.id, p]));
const index = JSON.parse(indexRaw) as { pokemon: Array<{ id: string }> };
const pokemonById: Mechanics["pokemonById"] = {};
for (const { id } of index.pokemon) {
  const pinned = previous.pokemonById[id];
  const resolved = pinned
    ? byPersonalId.get(pinned.personalId)
    : pokemon[normalize(id)];
  if (
    !resolved ||
    !Number.isFinite(resolved.weightKg) ||
    resolved.weightKg <= 0
  )
    throw new Error(`Champions form mapping needs review: ${id}`);
  const source = sourceByPersonalId.get(resolved.personalId)!;
  const stats = statsById.get(id);
  const fields = {
    hp: "hp",
    attack: "atk",
    defense: "def",
    specialAttack: "spatk",
    specialDefense: "spdef",
    speed: "agi",
  } as const;
  if (
    !stats ||
    Object.entries(fields).some(
      ([stat, field]) => stats[stat] !== Number(source[field]),
    )
  )
    throw new Error(`Form stats do not match Champions master data: ${id}`);
  pokemonById[id] = resolved;
}
const rawMoves = JSON.parse(movesRaw) as Array<{
  id: string;
  priority: string;
  target: string;
}>;
const moves = Object.fromEntries(
  rawMoves.map((m) => [
    m.id,
    { priority: Number(m.priority), spread: ["4", "5"].includes(m.target) },
  ]),
);
if (Object.values(moves).some((m) => !Number.isFinite(m.priority)))
  throw new Error("Invalid move priority");
await mkdir("data/damage-chart", { recursive: true });
await writeFile(
  destination,
  JSON.stringify(
    { sourceCommit: champoutCommit, pokemon, pokemonById, moves },
    null,
    2,
  ) + "\n",
);
console.log(
  `[damage] ${index.pokemon.length} verified forms, ${rawMoves.length} moves, snapshot=${champoutCommit}`,
);
