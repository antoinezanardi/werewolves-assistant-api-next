import type { GamePhase } from "@/modules/game/schemas/game-phase/game-phase.schema";

const GAME_PHASE_NAMES = [
  "night",
  "day",
] as const;

const DEFAULT_GAME_PHASE = {
  name: "night",
  tick: 1,
} as const satisfies GamePhase;

export {
  GAME_PHASE_NAMES,
  DEFAULT_GAME_PHASE,
};