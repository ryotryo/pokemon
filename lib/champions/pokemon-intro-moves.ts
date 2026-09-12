import type { PokemonIntroMove } from "@/content/pokemon-intros";
import type { UsageMoveDetail } from "./usage-ranking";

export interface ResolvedPokemonIntroMove extends PokemonIntroMove {
  move: UsageMoveDetail;
}

export function resolvePokemonIntroMoves(
  featuredMoves: PokemonIntroMove[],
  moveMetadata: Record<string, UsageMoveDetail>,
): ResolvedPokemonIntroMove[] {
  return featuredMoves.flatMap((featured) => {
    const move = moveMetadata[featured.moveId];
    return move ? [{ ...featured, move }] : [];
  });
}

export function formatMovePower(move: UsageMoveDetail): string {
  return move.power === null ? "—" : String(move.power);
}

export function formatMoveAccuracy(move: UsageMoveDetail): string {
  if (move.accuracy === null) return "—";
  return move.alwaysHits ? "必中" : String(move.accuracy);
}
