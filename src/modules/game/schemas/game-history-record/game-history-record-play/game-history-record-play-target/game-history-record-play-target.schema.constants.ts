import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { WitchPotions } from "@/modules/game/enums/game-play.enum";
import type { GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS = {
  player: {
    required: true,
    type: PLAYER_SCHEMA,
  },
  drankPotion: {
    required: false,
    enum: Object.values(WitchPotions),
  },
} as const satisfies Record<keyof GameHistoryRecordPlayTarget, MongoosePropOptions>;

const GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlayTarget, ApiPropertyOptions>> = {
  player: {
    description: "Targeted player of this play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.player),
  },
  drankPotion: {
    description: "Only if there is the `witch` in the game. The consequences depends on the type of potion",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.drankPotion),
  },
};

export {
  GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES,
};