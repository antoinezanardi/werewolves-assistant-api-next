import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import { addPlayerAttributeInGame } from "../../../helpers/game.mutator";
import { createSeenBySeerPlayerAttribute } from "../../../helpers/player/player-attribute/player-attribute.factory";
import { createPlayerShotByHunterDeath } from "../../../helpers/player/player-death/player-death.factory";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import { PlayerKillerService } from "../player/player-killer.service";

@Injectable()
export class GamePlaysMakerService {
  public constructor(private readonly playerKillerService: PlayerKillerService) {}

  private werewolvesEat(play: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const { targets } = play;
    if (targets?.length !== 1) {
      return clonedGame;
    }
    return clonedGame;
  }

  private hunterShoots(play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const { targets } = play;
    if (targets?.length !== 1) {
      return clonedGame;
    }
    const shotByHunterDeath = createPlayerShotByHunterDeath();
    return this.playerKillerService.killOrRevealPlayer(targets[0].player._id, clonedGame, shotByHunterDeath, gameHistoryRecords);
  }

  private seerLooks(play: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const { targets } = play;
    if (targets?.length !== 1) {
      return clonedGame;
    }
    const seenBySeerAttribute = createSeenBySeerPlayerAttribute();
    return addPlayerAttributeInGame(targets[0].player._id, clonedGame, seenBySeerAttribute);
  }
}