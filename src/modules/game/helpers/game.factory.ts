import { plainToInstance } from "class-transformer";

import { Game } from "@/modules/game/schemas/game.schema";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { toJSON } from "@tests/helpers/object/object.helper";

function createGame(game: Game): Game {
  return plainToInstance(Game, toJSON(game), plainToInstanceDefaultOptions);
}

export { createGame };