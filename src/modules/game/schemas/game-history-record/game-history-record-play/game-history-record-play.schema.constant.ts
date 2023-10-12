import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_ADDITIONAL_CARD_SCHEMA } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema";
import { GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";
import { GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS = {
  action: {
    required: true,
    enum: Object.values(GamePlayActions),
  },
  source: {
    required: true,
    type: GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA,
  },
  cause: {
    required: false,
    enum: Object.values(GamePlayCauses),
  },
  targets: {
    required: false,
    type: [GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA],
    default: undefined,
  },
  votes: {
    required: false,
    type: [GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA],
    default: undefined,
  },
  voting: {
    required: false,
    type: GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA,
  },
  didJudgeRequestAnotherVote: { required: false },
  chosenCard: {
    required: false,
    type: GAME_ADDITIONAL_CARD_SCHEMA,
  },
  chosenSide: {
    required: false,
    enum: Object.values(RoleSides),
  },
} satisfies Record<keyof GameHistoryRecordPlay, MongoosePropOptions>;

const GAME_HISTORY_RECORD_PLAY_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlay, ApiPropertyOptions>> = {
  action: {
    description: "Play's action",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.action),
  },
  source: {
    description: "Play's source",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.source),
  },
  cause: {
    description: "Play's cause",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.cause),
  },
  targets: {
    description: "Players affected by the play.",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.targets),
  },
  votes: {
    description: "Play's votes",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.votes),
  },
  voting: {
    description: "Only if `votes` are set, voting summary and nominated players if applicable",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.voting),
  },
  didJudgeRequestAnotherVote: {
    description: "Only if there is the `stuttering judge` in the game and `action` is either `vote` or `settle-votes`. If set to `true`, there is another vote planned after this play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.didJudgeRequestAnotherVote),
  },
  chosenCard: {
    description: "Only if there is a `thief` in the game, chosen card from additional cards.",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenCard),
  },
  chosenSide: {
    description: "Only if there is the `dog wolf` in the game, which side it joined",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenSide),
  },
};

export {
  GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_API_PROPERTIES,
};