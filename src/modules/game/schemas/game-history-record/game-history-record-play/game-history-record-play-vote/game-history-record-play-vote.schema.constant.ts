import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import type { GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS = {
  source: {
    required: true,
    type: PLAYER_SCHEMA,
  },
  target: {
    required: true,
    type: PLAYER_SCHEMA,
  },
} as const satisfies Record<keyof GameHistoryRecordPlayVote, MongoosePropOptions>;

const GAME_HISTORY_RECORD_PLAY_VOTE_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlayVote, ApiPropertyOptions>> = {
  source: {
    description: "Player who made the vote",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.source),
  },
  target: {
    description: "Player targeted by the vote",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.target),
  },
};

export {
  GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_VOTE_API_PROPERTIES,
};