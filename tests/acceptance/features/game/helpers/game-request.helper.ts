import type { Response } from "light-my-request";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import type { Game } from "@/modules/game/schemas/game.schema";

async function createGameRequest(createGameDto: CreateGameDto, app: NestFastifyApplication): Promise<Response> {
  return app.inject({
    method: "POST",
    url: "/games",
    payload: createGameDto,
  });
}

async function makeGamePlayRequest(makeGamePlayDto: MakeGamePlayDto, game: Game, app: NestFastifyApplication): Promise<Response> {
  return app.inject({
    method: "POST",
    url: `/games/${game._id.toString()}/play`,
    payload: makeGamePlayDto,
  });
}

export {
  createGameRequest,
  makeGamePlayRequest,
};