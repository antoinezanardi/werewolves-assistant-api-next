import { Injectable } from "@nestjs/common";

import { WEREWOLF_ROLES } from "@/modules/role/constants/role.constant";
import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import { PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlay } from "@/modules/game/helpers/game-play/game-play.factory";
import { getLeftToEatByWerewolvesPlayers } from "@/modules/game/helpers/game.helper";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import { RoleNames } from "@/modules/role/enums/role.enum";

@Injectable()
export class GamePlayAugmenterService {
  private readonly canBeSkippedPlayMethods: Partial<Record<GamePlaySourceName, (gamePlay: GamePlay, game: Game) => boolean>> = {
    [PlayerGroups.CHARMED]: () => true,
    [PlayerGroups.LOVERS]: () => true,
    [PlayerGroups.SURVIVORS]: (gamePlay: GamePlay, game: Game) => this.canSurvivorsSkipGamePlay(gamePlay, game),
    [RoleNames.BIG_BAD_WOLF]: (gamePlay: GamePlay, game: Game) => this.canBigBadWolfSkipGamePlay(game),
    [RoleNames.FOX]: () => true,
    [RoleNames.RAVEN]: () => true,
    [RoleNames.SCAPEGOAT]: () => true,
    [RoleNames.THIEF]: (gamePlay: GamePlay, game: Game) => this.canThiefSkipGamePlay(game),
    [RoleNames.TWO_SISTERS]: () => true,
    [RoleNames.THREE_BROTHERS]: () => true,
    [RoleNames.WHITE_WEREWOLF]: () => true,
    [RoleNames.WITCH]: () => true,
  };

  public setGamePlayCanBeSkipped(gamePlay: GamePlay, game: Game): GamePlay {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.canBeSkipped = this.canGamePlayBeSkipped(gamePlay, game);
    return clonedGamePlay;
  }

  private canSurvivorsSkipGamePlay(gamePlay: GamePlay, game: Game): boolean {
    const { canBeSkipped } = game.options.votes;
    const isGamePlayVoteCauseAngelPresence = gamePlay.action === GamePlayActions.VOTE && gamePlay.cause === GamePlayCauses.ANGEL_PRESENCE;
    if (gamePlay.action === GamePlayActions.ELECT_SHERIFF || isGamePlayVoteCauseAngelPresence) {
      return false;
    }
    return canBeSkipped;
  }

  private canBigBadWolfSkipGamePlay(game: Game): boolean {
    const leftToEatByWerewolvesPlayers = getLeftToEatByWerewolvesPlayers(game);
    return leftToEatByWerewolvesPlayers.length === 0;
  }

  private canThiefSkipGamePlay(game: Game): boolean {
    const { mustChooseBetweenWerewolves } = game.options.roles.thief;
    if (game.additionalCards === undefined || game.additionalCards.length === 0) {
      return true;
    }
    const areAllAdditionalCardsWerewolves = game.additionalCards.every(({ roleName }) => WEREWOLF_ROLES.find(role => role.name === roleName));
    return !areAllAdditionalCardsWerewolves || !mustChooseBetweenWerewolves;
  }

  private canGamePlayBeSkipped(gamePlay: GamePlay, game: Game): boolean {
    const canBeSkippedGamePlayMethod = this.canBeSkippedPlayMethods[gamePlay.source.name];
    if (!canBeSkippedGamePlayMethod) {
      return false;
    }
    return canBeSkippedGamePlayMethod(gamePlay, game);
  }
}