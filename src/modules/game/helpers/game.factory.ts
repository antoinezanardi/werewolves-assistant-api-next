import { plainToInstance } from "class-transformer";

import { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { Game } from "@/modules/game/schemas/game.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGameWithCurrentGamePlay(gameWithCurrentPlay: GameWithCurrentPlay): GameWithCurrentPlay {
  return plainToInstance(GameWithCurrentPlay, toJSON(gameWithCurrentPlay), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createGame(game: Game): Game {
  return plainToInstance(Game, toJSON(game), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export {
  createGameWithCurrentGamePlay,
  createGame,
};