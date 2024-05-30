import type { GamePhase } from "@/modules/game/schemas/game-phase/game-phase.schema";

const GAME_PHASE_NAMES = [
  "night",
  "day",
  "twilight",
] as const;

const DEFAULT_GAME_PHASE = {
  name: "twilight",
  tick: 1,
} as const satisfies GamePhase;

export {
  GAME_PHASE_NAMES,
  DEFAULT_GAME_PHASE,
};