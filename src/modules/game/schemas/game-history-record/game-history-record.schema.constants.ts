import { GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { SchemaTypes } from "mongoose";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PHASE_SCHEMA } from "@/modules/game/schemas/game-phase/game-phase.schema";
import { DEAD_PLAYER_SCHEMA } from "@/modules/game/schemas/player/dead-player.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { GAME_HISTORY_RECORD_PLAY_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";

const GAME_HISTORY_RECORD_FIELDS_SPECS = {
  _id: { required: true },
  gameId: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  turn: {
    required: true,
    min: 1,
  },
  phase: {
    required: true,
    type: GAME_PHASE_SCHEMA,
  },
  tick: {
    required: true,
    min: 1,
  },
  play: {
    required: true,
    type: GAME_HISTORY_RECORD_PLAY_SCHEMA,
  },
  revealedPlayers: {
    required: false,
    type: [PLAYER_SCHEMA],
    default: undefined,
  },
  switchedSidePlayers: {
    required: false,
    type: [PLAYER_SCHEMA],
    default: undefined,
  },
  deadPlayers: {
    required: false,
    type: [DEAD_PLAYER_SCHEMA],
    default: undefined,
  },
  playerAttributeAlterations: {
    required: false,
    type: [GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_SCHEMA],
    default: undefined,
  },
  createdAt: { required: true },
} as const satisfies Record<keyof GameHistoryRecord, MongoosePropOptions>;

const GAME_HISTORY_RECORD_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecord, ApiPropertyOptions>> = {
  _id: {
    description: "Game history record's Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS._id),
  },
  gameId: {
    description: "Game's Mongo ObjectId related to this history record",
    example: "507f1f77bcf86cd799439012",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.gameId),
  },
  turn: {
    description: "Game's turn recorded in history",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.turn),
  },
  phase: {
    description: "Game's phase recorded in history",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.phase),
  },
  tick: {
    description: "Game's tick recorded in history",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.tick),
  },
  play: {
    description: "Game's play recorded in history",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.play),
  },
  revealedPlayers: {
    description: "Player(s) which the role has been revealed as consequence of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.revealedPlayers),
  },
  switchedSidePlayers: {
    description: "Player(s) which switched their current side as consequence of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.switchedSidePlayers),
  },
  deadPlayers: {
    description: "Player(s) that died as consequence of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.deadPlayers),
  },
  playerAttributeAlterations: {
    description: "Player attribute alteration(s) as consequence of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.playerAttributeAlterations),
  },
  createdAt: {
    description: "When the game history record was created",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_FIELDS_SPECS.createdAt),
  },
};

export {
  GAME_HISTORY_RECORD_FIELDS_SPECS,
  GAME_HISTORY_RECORD_API_PROPERTIES,
};