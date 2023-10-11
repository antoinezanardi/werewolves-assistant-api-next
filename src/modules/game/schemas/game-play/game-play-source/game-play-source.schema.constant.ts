import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GAME_PLAY_SOURCE_NAMES } from "@/modules/game/constants/game-play/game-play.constant";
import type { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";

const GAME_PLAY_SOURCE_FIELDS_SPECS = Object.freeze<Record<keyof GamePlaySource, ApiPropertyOptions>>({
  name: {
    required: true,
    enum: GAME_PLAY_SOURCE_NAMES,
  },
  players: {
    required: false,
    default: undefined,
  },
});

const GAME_PLAY_SOURCE_API_PROPERTIES = Object.freeze<Record<keyof GamePlaySource, ApiPropertyOptions>>({
  name: {
    description: "Source's name of the play",
    ...GAME_PLAY_SOURCE_FIELDS_SPECS.name,
  },
  players: {
    description: "Expected players who will make the play. Only set for the current play, not the upcoming one",
    ...GAME_PLAY_SOURCE_FIELDS_SPECS.players,
  },
});

export {
  GAME_PLAY_SOURCE_FIELDS_SPECS,
  GAME_PLAY_SOURCE_API_PROPERTIES,
};