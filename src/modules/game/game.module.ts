import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { GameVictoryService } from "@/modules/game/providers/services/game-victory/game-victory.service";
import { DatabaseModule } from "@/modules/config/database/database.module";
import { GameController } from "@/modules/game/controllers/game.controller";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePhaseService } from "@/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { GameRandomCompositionService } from "@/modules/game/providers/services/game-random-composition.service";
import { GameService } from "@/modules/game/providers/services/game.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import { GameHistoryRecord, GAME_HISTORY_RECORD_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import { Game, GAME_SCHEMA } from "@/modules/game/schemas/game.schema";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Game.name, schema: GAME_SCHEMA },
      { name: GameHistoryRecord.name, schema: GAME_HISTORY_RECORD_SCHEMA },
    ]),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameRandomCompositionService,
    GamePlayService,
    GamePlayValidatorService,
    GamePlayMakerService,
    GamePlayVoteService,
    GamePhaseService,
    GameVictoryService,
    GameRepository,
    GameHistoryRecordService,
    GameHistoryRecordRepository,
    PlayerKillerService,
    PlayerAttributeService,
  ],
})
export class GameModule {}