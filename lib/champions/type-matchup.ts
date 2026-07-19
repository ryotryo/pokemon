const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export interface PartyMemberCoverage {
  id: string;
  name: string;
  canHitWeakness: boolean;
  effectiveTypes: string[];
  effectiveMoves: Array<{ moveId: string; displayNameJa: string; type: string; multiplier: number; usage?: number }>;
  bestMultiplier: number;
}

interface MatchupMove {
  id: string;
  displayNameJa: string;
  type: string;
  damageClass: string;
  isCoverageMove: boolean;
  usage?: number | null;
}

export function getTypeMultiplier(attackType: string, defenderTypes: string[]): number {
  return defenderTypes.reduce((total, defender) => total * (TYPE_CHART[attackType.toLowerCase()]?.[defender.toLowerCase()] ?? 1), 1);
}

export function evaluatePartyMember(member: { id: string; name: string; moves: MatchupMove[] }, defenderTypes: string[]): PartyMemberCoverage {
  const attackMoves = member.moves.filter((move) => move.isCoverageMove === true);
  const uniqueMoves = [...new Map(attackMoves.map((move) => [move.id, move])).values()];
  const scored = uniqueMoves.map((move) => ({ move, multiplier: getTypeMultiplier(move.type, defenderTypes) }));
  const effectiveMoves = scored
    .filter(({ multiplier }) => multiplier >= 2)
    .sort((a, b) => (b.move.usage ?? Number.NEGATIVE_INFINITY) - (a.move.usage ?? Number.NEGATIVE_INFINITY))
    .map(({ move, multiplier }) => ({ moveId: move.id, displayNameJa: move.displayNameJa, type: move.type.toLowerCase(), multiplier, ...(typeof move.usage === "number" ? { usage: move.usage } : {}) }));
  const effectiveTypes = [...new Set(effectiveMoves.map((move) => move.type))];
  return { id: member.id, name: member.name, canHitWeakness: effectiveMoves.length > 0, effectiveTypes, effectiveMoves, bestMultiplier: Math.max(0, ...scored.map(({ multiplier }) => multiplier)) };
}

export function evaluateMatchup(party: Array<{ id: string; name: string; moves: MatchupMove[] }>, defenderTypes: string[]) {
  const members = party.map((member) => evaluatePartyMember(member, defenderTypes));
  return { members, count: members.filter((member) => member.canHitWeakness).length };
}

export function getCoverageDots(coverageCount: number, total = 6): boolean[] {
  const filled = Math.max(0, Math.min(total, coverageCount));
  return Array.from({ length: total }, (_, index) => index < filled);
}
