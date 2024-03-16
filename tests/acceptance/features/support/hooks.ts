import { After, Before } from "@cucumber/cucumber";
import { getModelToken } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import { Game } from "@/modules/game/schemas/game.schema";

import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";
import { initNestApp } from "@tests/e2e/helpers/nest-app.helpers";

Before(async function(this: CustomWorld) {
  const { app, module } = await initNestApp();
  this.app = app;
  this.models = {
    game: module.get<Model<Game>>(getModelToken(Game.name)),
    gameHistoryRecord: module.get<Model<GameHistoryRecord>>(getModelToken(GameHistoryRecord.name)),
  };
});

After(async function(this: CustomWorld) {
  await Promise.all([
    this.models.game.deleteMany(),
    this.models.gameHistoryRecord.deleteMany(),
  ]);
  await this.app.close();
});