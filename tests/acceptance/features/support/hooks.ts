import { After, Before } from "@cucumber/cucumber";
import { getModelToken } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import { GameHistoryRecord } from "../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import { Game } from "../../../../src/modules/game/schemas/game.schema";
import { initNestApp } from "../../../e2e/helpers/nest-app.helper";
import type { CustomWorld } from "../../shared/types/world.types";

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