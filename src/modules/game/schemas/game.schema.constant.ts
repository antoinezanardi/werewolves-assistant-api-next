import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GAME_PHASES, GAME_STATUSES } from "@/modules/game/enums/game.enum";
import type { Game } from "@/modules/game/schemas/game.schema";

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

const gameApiProperties: Readonly<Record<keyof Game, ApiPropertyOptions>> = Object.freeze({
  _id: {
    description: "Game's Mongo ObjectId",
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
  currentPlay: { description: "Current play which needs to be performed" },
  upcomingPlays: { description: "Queue of upcoming plays that needs to be performed to continue the game right after the current play" },
  options: { description: "Game's options" },
  additionalCards: { description: "Game's additional cards. Not set if thief is not in the game" },
  victory: { description: "Victory data set when `status` is `over`" },
  createdAt: { description: "When the game was created" },
  updatedAt: { description: "When the game was updated" },
});

export {
  gameFieldsSpecs,
  gameApiProperties,
};