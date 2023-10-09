import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PLAY_SOURCE_NAMES } from "@/modules/game/constants/game-play/game-play.constant";
import type { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";

const GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS: ReadonlyDeep<Record<keyof GameHistoryRecordPlaySource, ApiPropertyOptions>> = {
  name: {
    required: true,
    enum: GAME_PLAY_SOURCE_NAMES,
  },
  players: {
    minItems: 1,
    required: true,
  },
};

const GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES: ReadonlyDeep<Record<keyof GameHistoryRecordPlaySource, ApiPropertyOptions>> = {
  name: {
    description: "Source of the play",
    ...GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.name,
  },
  players: {
    description: "Players that made the play",
    ...GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.players,
  },
};

export {
  GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES,
};