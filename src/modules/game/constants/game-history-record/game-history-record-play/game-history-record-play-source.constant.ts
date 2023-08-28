import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GAME_SOURCE_VALUES } from "@/modules/game/constants/game.constant";
import type { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source.schema";

const GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS = Object.freeze<Record<keyof GameHistoryRecordPlaySource, ApiPropertyOptions>>({
  name: {
    required: true,
    enum: GAME_SOURCE_VALUES,
  },
  players: {
    minItems: 1,
    required: true,
  },
});

const GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES = Object.freeze<Record<keyof GameHistoryRecordPlaySource, ApiPropertyOptions>>({
  name: {
    description: "Source of the play",
    ...GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.name,
  },
  players: {
    description: "Players that made the play",
    ...GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.players,
  },
});

export {
  GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES,
};