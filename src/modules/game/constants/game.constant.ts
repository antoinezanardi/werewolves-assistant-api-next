import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../role/enums/role.enum";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../enums/player.enum";
import type { Game } from "../schemas/game.schema";
import type { GameSource } from "../types/game.type";

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
  upcomingPlays: { description: "Queue of upcoming plays that needs to be performed to continue the game" },
  options: { description: "Game's options" },
  additionalCards: { description: "Game's additional cards" },
  victory: { description: "Victory data set when `status` is `over`" },
  createdAt: { description: "When the game was created" },
  updatedAt: { description: "When the game was updated" },
});

const gameSourceValues: readonly GameSource[] = Object.freeze([...Object.values(PLAYER_GROUPS), ...Object.values(ROLE_NAMES), PLAYER_ATTRIBUTE_NAMES.SHERIFF]);

export { gameFieldsSpecs, gameApiProperties, gameSourceValues };