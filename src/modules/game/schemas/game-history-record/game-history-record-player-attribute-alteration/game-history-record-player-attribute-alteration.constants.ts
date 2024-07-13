import { GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_STATUSES } from "@/modules/game/constants/game-history-record/game-history-record.constants";
import { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import { PLAYER_ATTRIBUTE_NAMES } from "@/modules/game/constants/player/player-attribute/player-attribute.constants";
import type { GameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

const GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS = {
  name: {
    enum: PLAYER_ATTRIBUTE_NAMES,
    required: true,
  },
  source: {
    enum: GAME_SOURCES,
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  status: {
    enum: GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_STATUSES,
    required: true,
  },
} as const satisfies Record<keyof GameHistoryRecordPlayerAttributeAlteration, MongoosePropOptions>;

const GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlayerAttributeAlteration, ApiPropertyOptions>> = {
  name: {
    description: "Attribute's name",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.name),
  },
  source: {
    description: "Which entity gave this attribute to the player",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.source),
  },
  playerName: {
    description: "Player's name on which the attribute was altered",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.playerName),
  },
  status: {
    description: "Status of the attribute alteration",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.status),
  },
};

export {
  GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_API_PROPERTIES,
  GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS,
};