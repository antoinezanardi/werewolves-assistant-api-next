import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "../config/database/database.module";
import { GameController } from "./controllers/game.controller";
import { GameHistoryRecordRepository } from "./providers/repositories/game-history-record.repository";
import { GameRepository } from "./providers/repositories/game.repository";
import { GameHistoryRecordService } from "./providers/services/game-history/game-history-record.service";
import { GamePlaysMakerService } from "./providers/services/game-play/game-plays-maker.service";
import { GamePlaysManagerService } from "./providers/services/game-play/game-plays-manager.service";
import { GamePlaysValidatorService } from "./providers/services/game-play/game-plays-validator.service";
import { GameRandomCompositionService } from "./providers/services/game-random-composition.service";
import { GameService } from "./providers/services/game.service";
import { PlayerKillerService } from "./providers/services/player/player-killer.service";
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
    GamePlaysMakerService,
    GameRepository,
    GameHistoryRecordService,
    GameHistoryRecordRepository,
    PlayerKillerService,
  ],
})
export class GameModule {}