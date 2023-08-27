
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { gameSourceValues } from "@/modules/game/constants/game.constant";
import type { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source.schema";

const gameHistoryRecordPlaySourceFieldsSpecs = Object.freeze<Record<keyof GameHistoryRecordPlaySource, ApiPropertyOptions>>({
  name: {
    required: true,
    enum: gameSourceValues,
  },
  players: {
    minItems: 1,
    required: true,
  },
});

const gameHistoryRecordPlaySourceApiProperties = Object.freeze<Record<keyof GameHistoryRecordPlaySource, ApiPropertyOptions>>({
  name: {
    description: "Source of the play",
    ...gameHistoryRecordPlaySourceFieldsSpecs.name,
  },
  players: {
    description: "Players that made the play",
    ...gameHistoryRecordPlaySourceFieldsSpecs.players,
  },
});

export { gameHistoryRecordPlaySourceFieldsSpecs, gameHistoryRecordPlaySourceApiProperties };