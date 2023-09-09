import { plainToInstance } from "class-transformer";

import { Game } from "@/modules/game/schemas/game.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { toJSON } from "@tests/helpers/object/object.helper";

function createGame(game: Game): Game {
  return plainToInstance(Game, toJSON(game), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createGame };