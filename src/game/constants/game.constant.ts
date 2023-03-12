import type { ApiPropertyOptions } from "@nestjs/swagger";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import type { Game } from "../schemas/game.schema";

const gamePlayersSpecs = Object.freeze({
  minItems: 4,
  maxItems: 40,
});

const gameApiProperties: Record<keyof Game, ApiPropertyOptions> = Object.freeze({
  _id: {
    description: "Game's ID",
    example: "507f1f77bcf86cd799439011",
  },
  turn: {
    description: "Starting at `1`, a turn starts with the first phase (the `night`) and ends with the second phase (the `day`)",
    default: 1,
  },
  phase: {
    description: "Each turn has two phases, `day` and `night`. Starting at `night`",
    default: GAME_PHASES.NIGHT,
  },
  tick: {
    description: "Starting at `1`, tick increments each time a play is made",
    default: 1,
  },
  status: {
    description: "Game's current status",
    default: GAME_STATUSES.PLAYING,
  },
  players: {
    description: "Players of the game",
    minItems: gamePlayersSpecs.minItems,
    maxItems: gamePlayersSpecs.maxItems,
  },
  options: { description: "Game's options" },
  createdAt: { description: "When the game was created" },
  updatedAt: { description: "When the game was updated" },
});

export { gamePlayersSpecs, gameApiProperties };