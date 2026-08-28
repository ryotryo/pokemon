"use client";

import { useEffect, useRef } from "react";

export type AnalyticsToolName = "party-check" | "speed-ranking" | "usage-ranking" | "damage-chart" | "move-search";
export type AnalyticsBattleFormat = "Singles" | "Doubles";

export type AnalyticsEvent =
  | { event: "tool_view"; tool_name: AnalyticsToolName; battle_format?: AnalyticsBattleFormat }
  | { event: "pokemon_detail_open"; pokemon_name: string; tool_name: AnalyticsToolName; battle_format: AnalyticsBattleFormat }
  | { event: "move_detail_open"; move_name: string; pokemon_name?: string; tool_name: AnalyticsToolName; battle_format: AnalyticsBattleFormat }
  | { event: "battle_format_change"; tool_name: AnalyticsToolName; battle_format: AnalyticsBattleFormat }
  | { event: "party_complete"; battle_format: AnalyticsBattleFormat };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function pushDataLayer(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

export function useToolView(toolName: AnalyticsToolName, battleFormat?: AnalyticsBattleFormat) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    pushDataLayer({ event: "tool_view", tool_name: toolName, ...(battleFormat ? { battle_format: battleFormat } : {}) });
  }, [battleFormat, toolName]);
}
