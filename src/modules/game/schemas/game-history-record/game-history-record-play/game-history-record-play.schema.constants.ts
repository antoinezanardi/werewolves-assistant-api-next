import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES, GAME_PLAY_TYPES } from "@/modules/game/constants/game-play/game-play.constants";
import { GAME_ADDITIONAL_CARD_SCHEMA } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema";
import { GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";
import { GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { ROLE_SIDES } from "@/modules/role/constants/role.constants";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS = {
  type: {
    required: true,
    enum: GAME_PLAY_TYPES,
  },
  action: {
    required: true,
    enum: GAME_PLAY_ACTIONS,
  },
  source: {
    required: true,
    type: GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA,
  },
  causes: {
    required: false,
    type: GAME_PLAY_CAUSES,
    default: undefined,
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
    enum: ROLE_SIDES,
  },
} as const satisfies Record<keyof GameHistoryRecordPlay, MongoosePropOptions>;

const GAME_HISTORY_RECORD_PLAY_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlay, ApiPropertyOptions>> = {
  type: {
    description: "Play's type",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.type),
  },
  action: {
    description: "Play's action",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.action),
  },
  source: {
    description: "Play's source",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.source),
  },
  causes: {
    description: "Play's causes",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.causes),
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
    description: "Only if there is the `wolf-hound` in the game, which side it joined",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenSide),
  },
};

export {
  GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_API_PROPERTIES,
};