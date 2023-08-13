import { plainToInstance } from "class-transformer";
import { toJSON } from "../../../../tests/helpers/object/object.helper";
import { plainToInstanceDefaultOptions } from "../../../shared/validation/constants/validation.constant";
import { Game } from "../schemas/game.schema";

function createGame(game: Game): Game {
  return plainToInstance(Game, toJSON(game), plainToInstanceDefaultOptions);
}

export { createGame };