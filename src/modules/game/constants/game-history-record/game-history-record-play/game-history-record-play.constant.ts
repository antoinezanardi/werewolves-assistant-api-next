import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "@/modules/game/enums/game-play.enum";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { ROLE_SIDES } from "@/modules/role/enums/role.enum";

const gameHistoryRecordPlayFieldsSpecs = Object.freeze<Record<keyof GameHistoryRecordPlay, ApiPropertyOptions>>({
  action: {
    required: true,
    enum: GAME_PLAY_ACTIONS,
  },
  source: { required: true },
  cause: {
    required: false,
    enum: GAME_PLAY_CAUSES,
  },
  targets: { required: false },
  votes: { required: false },
  voting: { required: false },
  didJudgeRequestAnotherVote: { required: false },
  chosenCard: { required: false },
  chosenSide: {
    required: false,
    enum: ROLE_SIDES,
  },
});

const gameHistoryRecordPlayApiProperties = Object.freeze<Record<keyof GameHistoryRecordPlay, ApiPropertyOptions>>({
  action: {
    description: "Play's action",
    ...gameHistoryRecordPlayFieldsSpecs.action,
  },
  source: {
    description: "Play's source",
    ...gameHistoryRecordPlayFieldsSpecs.source,
  },
  cause: {
    description: "Play's cause",
    ...gameHistoryRecordPlayFieldsSpecs.cause,
  },
  targets: {
    description: "Players affected by the play.",
    ...gameHistoryRecordPlayFieldsSpecs.targets,
  },
  votes: {
    description: "Play's votes",
    ...gameHistoryRecordPlayFieldsSpecs.targets,
  },
  voting: {
    description: "Only if `votes` are set, voting summary and nominated players if applicable",
    ...gameHistoryRecordPlayFieldsSpecs.voting,
  },
  didJudgeRequestAnotherVote: {
    description: "Only if there is the `stuttering judge` in the game and `action` is either `vote` or `settle-votes`. If set to `true`, there is another vote planned after this play",
    ...gameHistoryRecordPlayFieldsSpecs.didJudgeRequestAnotherVote,
  },
  chosenCard: {
    description: "Only if there is a `thief` in the game, chosen card from additional cards.",
    ...gameHistoryRecordPlayFieldsSpecs.chosenCard,
  },
  chosenSide: {
    description: "Only if there is the `dog wolf` in the game, which side it joined",
    ...gameHistoryRecordPlayFieldsSpecs.chosenSide,
  },
});

export { gameHistoryRecordPlayFieldsSpecs, gameHistoryRecordPlayApiProperties };