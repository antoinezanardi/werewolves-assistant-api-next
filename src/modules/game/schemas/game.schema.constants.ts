import { GAME_EVENT_SCHEMA } from "@/modules/game/schemas/game-event/game-event.schema";
import { GAME_FEEDBACK_SCHEMA } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import { GAME_HISTORY_RECORD_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PHASE_SCHEMA } from "@/modules/game/schemas/game-phase/game-phase.schema";
import { GAME_STATUSES } from "@/modules/game/constants/game.constants";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import { GAME_ADDITIONAL_CARD_SCHEMA } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/game-options.schema";
import { GAME_PLAY_SCHEMA } from "@/modules/game/schemas/game-play/game-play.schema";
import { GAME_VICTORY_SCHEMA } from "@/modules/game/schemas/game-victory/game-victory.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import type { Game } from "@/modules/game/schemas/game.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_FIELDS_SPECS = {
  _id: { required: true },
  turn: {
    required: true,
    min: 1,
    default: 1,
  },
  phase: {
    required: true,
    type: GAME_PHASE_SCHEMA,
  },
  tick: {
    required: true,
    min: 1,
    default: 1,
  },
  status: {
    required: true,
    enum: GAME_STATUSES,
    default: "playing",
  },
  players: {
    required: true,
    type: [PLAYER_SCHEMA],
    minItems: 4,
    maxItems: 40,
  },
  playerGroups: {
    required: false,
    minItems: 2,
    default: undefined,
  },
  currentPlay: {
    required: true,
    type: GAME_PLAY_SCHEMA,
    default: null,
  },
  upcomingPlays: {
    required: true,
    type: [GAME_PLAY_SCHEMA],
  },
  events: {
    required: false,
    type: [GAME_EVENT_SCHEMA],
    default: undefined,
  },
  options: {
    required: true,
    type: GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS,
  },
  additionalCards: {
    required: false,
    type: [GAME_ADDITIONAL_CARD_SCHEMA],
    default: undefined,
  },
  victory: {
    required: false,
    type: GAME_VICTORY_SCHEMA,
    default: undefined,
  },
  lastGameHistoryRecord: {
    required: true,
    type: GAME_HISTORY_RECORD_SCHEMA,
    default: null,
  },
  feedback: {
    required: true,
    type: GAME_FEEDBACK_SCHEMA,
    default: null,
  },
  createdAt: { required: true },
  updatedAt: { required: true },
} as const satisfies Record<keyof Game, MongoosePropOptions>;

const GAME_API_PROPERTIES: ReadonlyDeep<Record<keyof Game, ApiPropertyOptions>> = {
  _id: {
    description: "Game's Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
  },
  turn: {
    description: "Starting at `1`, a turn starts with the first phase (the `night`) and ends with the second phase (the `day`)",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.turn),
  },
  phase: {
    description: "Game's current phase",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.phase),
  },
  tick: {
    description: "Starting at `1`, tick increments each time a play is made",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.tick),
  },
  status: {
    description: "Game's current status",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.status),
  },
  players: {
    description: "Players of the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.players),
  },
  playerGroups: {
    description: "Players unique groups. Not set if prejudiced manipulator is not in the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.playerGroups),
  },
  currentPlay: {
    description: "Current play which needs to be performed",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.currentPlay),
  },
  upcomingPlays: {
    description: "Queue of upcoming plays that needs to be performed to continue the game right after the current play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.upcomingPlays),
  },
  events: {
    description: "Game's events",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.events),
  },
  options: {
    description: "Game's options",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.options),
  },
  additionalCards: {
    description: "Game's additional cards. Not set if thief or actor are not in the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.additionalCards),
  },
  victory: {
    description: "Victory data set when `status` is `over`",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.victory),
  },
  lastGameHistoryRecord: {
    description: "Last game history record or the most recent play made in the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.lastGameHistoryRecord),
  },
  feedback: {
    description: "Game's feedback",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.feedback),
  },
  createdAt: {
    description: "When the game was created",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.createdAt),
  },
  updatedAt: {
    description: "When the game was updated",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FIELDS_SPECS.updatedAt),
  },
};

export {
  GAME_FIELDS_SPECS,
  GAME_API_PROPERTIES,
};