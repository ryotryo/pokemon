export type ToolId = "party-check" | "speed-ranking" | "usage-ranking" | "meta-history";

// Item names and sprite URLs were verified with PokéAPI Item API.
// Sprites are stored locally under public/tool-icons; pages never request PokéAPI.
export const TOOL_ICONS = {
  "party-check": {
    itemId: "weakness-policy",
    itemNameJa: "じゃくてんほけん",
    src: "/tool-icons/weakness-policy.png",
    sourceUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/weakness-policy.png",
    displaySize: 22,
  },
  "speed-ranking": {
    itemId: "carbos",
    itemNameJa: "インドメタシン",
    src: "/tool-icons/carbos.png",
    sourceUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/carbos.png",
    displaySize: 21,
  },
  "usage-ranking": {
    itemId: "wise-glasses",
    itemNameJa: "ものしりメガネ",
    src: "/tool-icons/wise-glasses.png",
    sourceUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wise-glasses.png",
    displaySize: 24,
  },
  "meta-history": {
    itemId: "poke-radar",
    itemNameJa: "ポケトレ",
    src: "/tool-icons/poke-radar.png",
    sourceUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-radar.png",
    displaySize: 22,
  },
} as const satisfies Record<ToolId, {
  itemId: string;
  itemNameJa: string;
  src: string;
  sourceUrl: string;
  displaySize: number;
}>;
