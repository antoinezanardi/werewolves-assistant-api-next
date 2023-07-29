import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "../config/database/database.module";
import { GameController } from "./controllers/game.controller";
import { GameHistoryRecordRepository } from "./providers/repositories/game-history-record.repository";
import { GameRepository } from "./providers/repositories/game.repository";
import { GameHistoryRecordService } from "./providers/services/game-history/game-history-record.service";
import { GamePhaseService } from "./providers/services/game-phase/game-phase.service";
import { GamePlayMakerService } from "./providers/services/game-play/game-play-maker.service";
import { GamePlayValidatorService } from "./providers/services/game-play/game-play-validator.service";
import { GamePlayService } from "./providers/services/game-play/game-play.service";
import { GameRandomCompositionService } from "./providers/services/game-random-composition.service";
import { GameService } from "./providers/services/game.service";
import { PlayerAttributeService } from "./providers/services/player/player-attribute.service";
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
    GamePlayService,
    GamePlayValidatorService,
    GamePlayMakerService,
    GamePhaseService,
    GameRepository,
    GameHistoryRecordService,
    GameHistoryRecordRepository,
    PlayerKillerService,
    PlayerAttributeService,
  ],
})
export class GameModule {}