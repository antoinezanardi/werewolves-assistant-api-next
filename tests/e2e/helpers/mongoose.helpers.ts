import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import type { Model } from "mongoose";

import { Game } from "@/modules/game/schemas/game.schema";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";

async function truncateAllCollections(module: TestingModule): Promise<void> {
  const models = {
    game: module.get<Model<Game>>(getModelToken(Game.name)),
    gameHistoryRecord: module.get<Model<GameHistoryRecord>>(getModelToken(GameHistoryRecord.name)),
  };
  await Promise.all([
    models.game.deleteMany(),
    models.gameHistoryRecord.deleteMany(),
  ]);
}

export { truncateAllCollections };