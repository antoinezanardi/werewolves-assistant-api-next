import type { ApiPropertyOptions } from "@nestjs/swagger";
import { GAME_PHASES } from "../../enums/game.enum";
import type { GameHistoryRecord } from "../../schemas/game-history-record/game-history-record.schema";

const gameHistoryRecordFieldsSpecs = Object.freeze<Record<keyof GameHistoryRecord, ApiPropertyOptions>>({
  _id: { required: true },
  gameId: { required: true },
  turn: {
    minimum: 1,
    required: true,
  },
  phase: {
    enum: GAME_PHASES,
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
  updatedAt: { required: true },
});

const gameHistoryRecordApiProperties = Object.freeze<Record<keyof GameHistoryRecord, ApiPropertyOptions>>({
  _id: {
    description: "Game history record's Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
    ...gameHistoryRecordFieldsSpecs._id,
  },
  gameId: {
    description: "Game's Mongo ObjectId related to this history record",
    example: "507f1f77bcf86cd799439012",
    ...gameHistoryRecordFieldsSpecs.gameId,
  },
  turn: {
    description: "Game's turn recorded in history",
    ...gameHistoryRecordFieldsSpecs.turn,
  },
  phase: {
    description: "Game's phase recorded in history",
    ...gameHistoryRecordFieldsSpecs.phase,
  },
  tick: {
    description: "Game's tick recorded in history",
    ...gameHistoryRecordFieldsSpecs.tick,
  },
  play: {
    description: "Game's play recorded in history",
    ...gameHistoryRecordFieldsSpecs.play,
  },
  revealedPlayers: {
    description: "Player(s) which the role has been revealed after the play",
    ...gameHistoryRecordFieldsSpecs.revealedPlayers,
  },
  deadPlayers: {
    description: "Player(s) that died after the play",
    ...gameHistoryRecordFieldsSpecs.deadPlayers,
  },
  createdAt: {
    description: "When the game history record was created",
    ...gameHistoryRecordFieldsSpecs.createdAt,
  },
  updatedAt: {
    description: "When the game history record was updated",
    ...gameHistoryRecordFieldsSpecs.updatedAt,
  },
});

export { gameHistoryRecordFieldsSpecs, gameHistoryRecordApiProperties };