import { GAME_PHASES } from "../../../enums/game.enum";
import type { PLAYER_ATTRIBUTE_NAMES } from "../../../enums/player.enum";
import type { Game } from "../../../schemas/game.schema";
import type { PlayerAttribute } from "../../../schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "../../../schemas/player/player.schema";

function isPlayerAttributeActive({ activeAt }: PlayerAttribute, game: Game): boolean {
  return activeAt === undefined || activeAt.turn < game.turn ||
    activeAt.turn === game.turn && (activeAt.phase === game.phase || game.phase === GAME_PHASES.DAY);
}

function getPlayerAttribute({ attributes }: Player, attributeName: PLAYER_ATTRIBUTE_NAMES): PlayerAttribute | undefined {
  return attributes.find(({ name }) => name === attributeName);
}

export {
  isPlayerAttributeActive,
  getPlayerAttribute,
};