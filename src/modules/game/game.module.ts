import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "../config/database/database.module";
import { GameController } from "./controllers/game.controller";
import { GameHistoryRecordRepository } from "./providers/repositories/game-history-record.repository";
import { GameRepository } from "./providers/repositories/game.repository";
import { GamePlaysManagerService } from "./providers/services/game-plays-manager.service";
import { GameRandomCompositionService } from "./providers/services/game-random-composition.service";
import { GameService } from "./providers/services/game.service";
import { GameHistoryRecord, GameHistoryRecordSchema } from "./schemas/game-history-record/game-history-record.schema";
import { Game, GameSchema } from "./schemas/game.schema";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: GameHistoryRecord.name, schema: GameHistoryRecordSchema },
    ]),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameRandomCompositionService,
    GamePlaysManagerService,
    GameRepository,
    GameHistoryRecordRepository,
  ],
})
export class GameModule {}