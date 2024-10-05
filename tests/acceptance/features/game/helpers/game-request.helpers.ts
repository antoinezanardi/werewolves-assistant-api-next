import type { CreateGameFeedbackDto } from "@/modules/game/dto/create-game-feedback/create-game-feedback.dto";
import type { Response } from "light-my-request";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { stringify } from "qs";

import type { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";
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

async function getGameHistory(getGameHistoryDto: GetGameHistoryDto, game: Game, app: NestFastifyApplication): Promise<Response> {
  return app.inject({
    method: "GET",
    url: `/games/${game._id.toString()}/history`,
    query: stringify(getGameHistoryDto),
  });
}

async function createGameFeedback(createGameFeedbackDto: CreateGameFeedbackDto, game: Game, app: NestFastifyApplication): Promise<Response> {
  return app.inject({
    method: "POST",
    url: `/games/${game._id.toString()}/feedback`,
    payload: createGameFeedbackDto,
  });
}

export {
  createGameRequest,
  makeGamePlayRequest,
  getGameHistory,
  createGameFeedback,
};