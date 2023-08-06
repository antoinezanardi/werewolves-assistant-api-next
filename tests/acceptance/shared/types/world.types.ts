import type { IWorldOptions } from "@cucumber/cucumber";
import { World } from "@cucumber/cucumber";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { Response } from "light-my-request";
import type { Model } from "mongoose";
import type { GameHistoryRecord } from "../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../../src/modules/game/schemas/game.schema";

class CustomWorld extends World {
  public app: NestFastifyApplication;

  public models: {
    game: Model<Game>;
    gameHistoryRecord: Model<GameHistoryRecord>;
  };

  public response: Response;

  public game: Game;

  public constructor(options: IWorldOptions<unknown>) {
    super(options);
  }
}

export { CustomWorld };