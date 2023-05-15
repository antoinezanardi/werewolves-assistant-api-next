import { Injectable } from "@nestjs/common";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";

@Injectable()
export class GameRolePlaysManagerService {
  public werewolvesEat(game: Game, makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, gameHistoryRecords: GameHistoryRecord[]): Partial<Game> | undefined {
    const { targets } = makeGamePlayWithRelationsDto;
    const gameDataToUpdate: Partial<Game> = {};
    if (targets[0].isInfected) {
      
    }
    return gameDataToUpdate;
  }
}