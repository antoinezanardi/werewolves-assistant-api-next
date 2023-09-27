import { plainToInstance } from "class-transformer";

import { Game } from "@/modules/game/schemas/game.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGame(game: Game): Game {
  return plainToInstance(Game, toJSON(game), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createGame };