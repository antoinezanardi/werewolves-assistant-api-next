import { GAME_PHASES } from "../../../enums/game.enum";
import type { Game } from "../../../schemas/game.schema";
import type { PlayerAttribute } from "../../../schemas/player/player-attribute/player-attribute.schema";

function isPlayerAttributeActive({ activeAt }: PlayerAttribute, game: Game): boolean {
  return activeAt === undefined || activeAt.turn < game.turn ||
    activeAt.turn === game.turn && (activeAt.phase === game.phase || game.phase === GAME_PHASES.DAY);
}

export { isPlayerAttributeActive };