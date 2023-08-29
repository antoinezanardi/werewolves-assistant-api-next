import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { RoleSides } from "@/modules/role/enums/role.enum";

const GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS = Object.freeze<Record<keyof GameHistoryRecordPlay, ApiPropertyOptions>>({
  action: {
    required: true,
    enum: GamePlayActions,
  },
  source: { required: true },
  cause: {
    required: false,
    enum: GamePlayCauses,
  },
  targets: { required: false },
  votes: { required: false },
  voting: { required: false },
  didJudgeRequestAnotherVote: { required: false },
  chosenCard: { required: false },
  chosenSide: {
    required: false,
    enum: RoleSides,
  },
});

const GAME_HISTORY_RECORD_PLAY_API_PROPERTIES = Object.freeze<Record<keyof GameHistoryRecordPlay, ApiPropertyOptions>>({
  action: {
    description: "Play's action",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.action,
  },
  source: {
    description: "Play's source",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.source,
  },
  cause: {
    description: "Play's cause",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.cause,
  },
  targets: {
    description: "Players affected by the play.",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.targets,
  },
  votes: {
    description: "Play's votes",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.targets,
  },
  voting: {
    description: "Only if `votes` are set, voting summary and nominated players if applicable",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.voting,
  },
  didJudgeRequestAnotherVote: {
    description: "Only if there is the `stuttering judge` in the game and `action` is either `vote` or `settle-votes`. If set to `true`, there is another vote planned after this play",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.didJudgeRequestAnotherVote,
  },
  chosenCard: {
    description: "Only if there is a `thief` in the game, chosen card from additional cards.",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenCard,
  },
  chosenSide: {
    description: "Only if there is the `dog wolf` in the game, which side it joined",
    ...GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenSide,
  },
});

export {
  GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_API_PROPERTIES,
};