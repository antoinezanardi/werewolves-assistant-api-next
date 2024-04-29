import { World } from "@cucumber/cucumber";
import type { HttpExceptionBody } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { Response } from "light-my-request";
import type { Model } from "mongoose";

import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";

class CustomWorld extends World {
  public app: NestFastifyApplication;

  public models: {
    game: Model<Game>;
    gameHistoryRecord: Model<GameHistoryRecord>;
  };

  public response: Response;

  public responseException: HttpExceptionBody;

  public gameOnPreviousGamePlay: Game;

  public game: Game;

  public lastGameHistoryRecord: GameHistoryRecord;
}

export { CustomWorld };