import { cloneDeep } from "lodash";

import type { Game } from "@/modules/game/schemas/game.schema";

import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

function setGameInContext(game: Game, context: CustomWorld): CustomWorld {
  const clonedContext = cloneDeep({ ...context });
  clonedContext.gameOnPreviousGamePlay = context.game;
  clonedContext.game = game;
  return clonedContext;
}

export { setGameInContext };