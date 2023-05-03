import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "../config/database/database.module";
import { GameController } from "./controllers/game.controller";
import { GameHistoryRecordRepository } from "./providers/repositories/game-history-record.repository";
import { GameRepository } from "./providers/repositories/game.repository";
import { GameHistoryRecordService } from "./providers/services/game-history/game-history-record.service";
import { GamePlaysManagerService } from "./providers/services/game-play/game-plays-manager.service";
import { GamePlaysValidatorService } from "./providers/services/game-play/game-plays-validator.service";
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
    GamePlaysValidatorService,
    GameRepository,
    GameHistoryRecordService,
    GameHistoryRecordRepository,
  ],
})
export class GameModule {}