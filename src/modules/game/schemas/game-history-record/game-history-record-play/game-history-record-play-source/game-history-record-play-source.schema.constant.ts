import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { Player } from "@/modules/game/schemas/player/player.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { GAME_PLAY_SOURCE_NAMES } from "@/modules/game/constants/game-play/game-play.constant";
import type { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";

import { doesArrayRespectBounds } from "@/shared/validation/helpers/validation.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";

const GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS = {
  name: {
    required: true,
    enum: Object.values(GAME_PLAY_SOURCE_NAMES),
  },
  players: {
    required: true,
    type: [PLAYER_SCHEMA],
    validate: [(players: Player[]): boolean => doesArrayRespectBounds(players, { minItems: 1 }), "Path `play.source.players` length is less than minimum allowed value (1)."],
  },
} satisfies Record<keyof GameHistoryRecordPlaySource, MongoosePropOptions>;

const GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlaySource, ApiPropertyOptions>> = {
  name: {
    description: "Source of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.name),
  },
  players: {
    description: "Players that made the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.players),
  },
};

export {
  GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES,
};