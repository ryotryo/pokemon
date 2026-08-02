export type ToolId = "party-check" | "speed-ranking" | "usage-ranking" | "meta-history";

// Original Poké Analytics SVGs inspired by each item's role; no game sprites are used.
export const TOOL_ICONS = {
  "party-check": {
    motif: "じゃくてんほけん",
    src: "/tool-icons/party-check.svg",
  },
  "speed-ranking": {
    motif: "インドメタシン",
    src: "/tool-icons/speed-ranking.svg",
  },
  "usage-ranking": {
    motif: "ものしりメガネ",
    src: "/tool-icons/usage-ranking.svg",
  },
  "meta-history": {
    motif: "ポケトレ",
    src: "/tool-icons/meta-history.svg",
  },
} as const satisfies Record<ToolId, {
  motif: string;
  src: string;
}>;
