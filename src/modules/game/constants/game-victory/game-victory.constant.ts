import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GAME_VICTORY_TYPES } from "@/modules/game/enums/game-victory.enum";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

const gameVictoryFieldsSpecs: Readonly<Record<keyof GameVictory, ApiPropertyOptions>> = Object.freeze({
  type: {
    required: true,
    enum: GAME_VICTORY_TYPES,
  },
  winners: { required: false },
});

const gameVictoryApiProperties: Readonly<Record<keyof GameVictory, ApiPropertyOptions>> = Object.freeze({
  type: {
    description: "Type of victory of this game",
    ...gameVictoryFieldsSpecs.type,
  },
  winners: {
    description: "List of players who won the game, even the dead ones. Not set if `type` is `none`",
    ...gameVictoryFieldsSpecs.winners,
  },
});

export { gameVictoryFieldsSpecs, gameVictoryApiProperties };