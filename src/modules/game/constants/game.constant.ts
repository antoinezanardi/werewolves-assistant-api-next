import type { ApiPropertyOptions } from "@nestjs/swagger";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import type { Game } from "../schemas/game.schema";

const gameFieldsSpecs = Object.freeze({
  players: {
    minItems: 4,
    maxItems: 40,
  },
  turn: { default: 1 },
  phase: { default: GAME_PHASES.NIGHT },
  tick: { default: 1 },
  status: { default: GAME_STATUSES.PLAYING },
});

const gameApiProperties: Record<keyof Game, ApiPropertyOptions> = Object.freeze({
  _id: {
    description: "Game's ID",
    example: "507f1f77bcf86cd799439011",
  },
  turn: {
    description: "Starting at `1`, a turn starts with the first phase (the `night`) and ends with the second phase (the `day`)",
    ...gameFieldsSpecs.turn,
  },
  phase: {
    description: "Each turn has two phases, `day` and `night`. Starting at `night`",
    ...gameFieldsSpecs.phase,
  },
  tick: {
    description: "Starting at `1`, tick increments each time a play is made",
    ...gameFieldsSpecs.tick,
  },
  status: {
    description: "Game's current status",
    ...gameFieldsSpecs.status,
  },
  players: {
    description: "Players of the game",
    ...gameFieldsSpecs.players,
  },
  options: { description: "Game's options" },
  createdAt: { description: "When the game was created" },
  updatedAt: { description: "When the game was updated" },
});

export { gameFieldsSpecs, gameApiProperties };