import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_SIDES } from "../../../../role/enums/role.enum";
import { GAME_PLAY_ACTIONS } from "../../../enums/game-play.enum";
import type { GameHistoryRecordPlay } from "../../../schemas/game-history-record/game-history-record-play/game-history-record-play.schema";

const gameHistoryRecordPlayFieldsSpecs = Object.freeze<Record<keyof GameHistoryRecordPlay, ApiPropertyOptions>>({
  action: {
    required: true,
    enum: GAME_PLAY_ACTIONS,
  },
  source: { required: true },
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