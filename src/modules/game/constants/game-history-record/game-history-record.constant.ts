import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GamePhases } from "@/modules/game/enums/game.enum";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";

const GAME_HISTORY_RECORD_FIELDS_SPECS = Object.freeze<Record<keyof GameHistoryRecord, ApiPropertyOptions>>({
  _id: { required: true },
  gameId: { required: true },
  turn: {
    minimum: 1,
    required: true,
  },
  phase: {
    enum: GamePhases,
    required: true,
  },
  tick: {
    minimum: 1,
    required: true,
  },
  play: { required: true },
  revealedPlayers: { required: false },
  deadPlayers: { required: false },
  createdAt: { required: true },
});

const GAME_HISTORY_RECORD_API_PROPERTIES = Object.freeze<Record<keyof GameHistoryRecord, ApiPropertyOptions>>({
  _id: {
    description: "Game history record's Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS._id,
  },
  gameId: {
    description: "Game's Mongo ObjectId related to this history record",
    example: "507f1f77bcf86cd799439012",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.gameId,
  },
  turn: {
    description: "Game's turn recorded in history",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.turn,
  },
  phase: {
    description: "Game's phase recorded in history",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.phase,
  },
  tick: {
    description: "Game's tick recorded in history",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.tick,
  },
  play: {
    description: "Game's play recorded in history",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.play,
  },
  revealedPlayers: {
    description: "Player(s) which the role has been revealed after the play",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.revealedPlayers,
  },
  deadPlayers: {
    description: "Player(s) that died after the play",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.deadPlayers,
  },
  createdAt: {
    description: "When the game history record was created",
    ...GAME_HISTORY_RECORD_FIELDS_SPECS.createdAt,
  },
});

export {
  GAME_HISTORY_RECORD_FIELDS_SPECS,
  GAME_HISTORY_RECORD_API_PROPERTIES,
};