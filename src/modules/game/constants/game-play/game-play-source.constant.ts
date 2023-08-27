
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { gameSourceValues } from "@/modules/game/constants/game.constant";
import type { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";

const gamePlaySourceFieldsSpecs = Object.freeze<Record<keyof GamePlaySource, ApiPropertyOptions>>({
  name: {
    required: true,
    enum: gameSourceValues,
  },
  players: {
    required: false,
    default: undefined,
  },
});

const gamePlaySourceApiProperties = Object.freeze<Record<keyof GamePlaySource, ApiPropertyOptions>>({
  name: {
    description: "Source's name of the play",
    ...gamePlaySourceFieldsSpecs.name,
  },
  players: {
    description: "Expected players who will make the play. Only set for the current play, not the upcoming one",
    ...gamePlaySourceFieldsSpecs.players,
  },
});

export { gamePlaySourceFieldsSpecs, gamePlaySourceApiProperties };