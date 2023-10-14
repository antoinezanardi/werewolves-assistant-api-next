import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import type { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";

const GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS = {
  result: {
    required: true,
    enum: Object.values(GameHistoryRecordVotingResults),
  },
  nominatedPlayers: {
    required: false,
    type: [PLAYER_SCHEMA],
    default: undefined,
  },
} as const satisfies Record<keyof GameHistoryRecordPlayVoting, MongoosePropOptions>;

const GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlayVoting, ApiPropertyOptions>> = {
  result: {
    description: "Define the results and their consequences",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.result),
  },
  nominatedPlayers: {
    description: "Nominated players from the play votes",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.nominatedPlayers),
  },
};

export {
  GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES,
};