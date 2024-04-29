import type { HttpExceptionBody } from "@nestjs/common";
import type { Response } from "light-my-request";

import type { Game } from "@/modules/game/schemas/game.schema";

import { SUCCESS_HTTP_STATUSES } from "@tests/acceptance/shared/constants/api.constants";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

function setGameInContext(response: Response, context: CustomWorld): void {
  if (!SUCCESS_HTTP_STATUSES.includes(response.statusCode)) {
    context.responseException = response.json<HttpExceptionBody>();

    return;
  }
  context.gameOnPreviousGamePlay = context.game;
  context.game = response.json<Game>();
}

export { setGameInContext };