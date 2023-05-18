import { Injectable } from "@nestjs/common";
import { UNEXPECTED_EXCEPTION_REASONS } from "../../../../../shared/exception/enums/unexpected-exception.enum";
import { UnexpectedException } from "../../../../../shared/exception/types/unexpected-exception.type";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";

@Injectable()
export class GamePlaysMakerService {
  public werewolvesEat(game: Game, makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, gameHistoryRecords: GameHistoryRecord[]): Partial<Game> | undefined {
    const { targets } = makeGamePlayWithRelationsDto;
    const gameDataToUpdate: Partial<Game> = {};
    if (targets === undefined || targets.length !== 1) {
      throw new UnexpectedException("werewolvesEat", UNEXPECTED_EXCEPTION_REASONS.TOO_LESS_TARGETED_PLAYERS);
    }
    const { player: targetedPlayer, isInfected: isTargetInfected } = targets[0];
    if (isTargetInfected === true) {
    }
    return gameDataToUpdate;
  }
}