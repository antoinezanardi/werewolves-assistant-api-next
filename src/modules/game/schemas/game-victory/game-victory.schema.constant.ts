import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

const GAME_VICTORY_FIELDS_SPECS: Readonly<Record<keyof GameVictory, ApiPropertyOptions>> = Object.freeze({
  type: {
    required: true,
    enum: GameVictoryTypes,
  },
  winners: { required: false },
});

const GAME_VICTORY_API_PROPERTIES: Readonly<Record<keyof GameVictory, ApiPropertyOptions>> = Object.freeze({
  type: {
    description: "Type of victory of this game",
    ...GAME_VICTORY_FIELDS_SPECS.type,
  },
  winners: {
    description: "List of players who won the game, even the dead ones. Not set if `type` is `none`",
    ...GAME_VICTORY_FIELDS_SPECS.winners,
  },
});

export {
  GAME_VICTORY_FIELDS_SPECS,
  GAME_VICTORY_API_PROPERTIES,
};