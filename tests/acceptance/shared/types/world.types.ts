import { World } from "@cucumber/cucumber";
import type { IWorldOptions } from "@cucumber/cucumber";
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

  public game: Game;

  public constructor(options: IWorldOptions<unknown>) {
    super(options);
  }
}

export { CustomWorld };