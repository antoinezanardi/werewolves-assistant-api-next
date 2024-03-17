import { plainToInstance } from "class-transformer";

import { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";
import { Game } from "@/modules/game/schemas/game.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createGameWithCurrentGamePlay(gameWithCurrentPlay: GameWithCurrentPlay): GameWithCurrentPlay {
  return plainToInstance(GameWithCurrentPlay, toJSON(gameWithCurrentPlay), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createGame(game: Game): Game {
  return plainToInstance(Game, toJSON(game), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createGameWithCurrentGamePlay,
  createGame,
};