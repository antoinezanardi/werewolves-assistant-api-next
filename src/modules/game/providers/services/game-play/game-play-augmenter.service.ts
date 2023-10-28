import { Injectable } from "@nestjs/common";

import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { createGamePlayEligibleTargets } from "@/modules/game/helpers/game-play/game-play-eligible-targets/game-play-eligible-targets.factory";
import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import { WEREWOLF_ROLES } from "@/modules/role/constants/role.constant";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlay } from "@/modules/game/helpers/game-play/game-play.factory";
import { getAlivePlayers, getLeftToCharmByPiedPiperPlayers, getLeftToEatByWerewolvesPlayers, getLeftToEatByWhiteWerewolfPlayers } from "@/modules/game/helpers/game.helper";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import { RoleNames } from "@/modules/role/enums/role.enum";

@Injectable()
export class GamePlayAugmenterService {
  private readonly getEligibleTargetsPlayMethods: Partial<
  Record<GamePlaySourceName, (gamePlay: GamePlay, game: Game) => GamePlayEligibleTargets | Promise<GamePlayEligibleTargets>>
  > = {
      [PlayerAttributeNames.SHERIFF]: () => this.getSingleTargetGamePlayEligibleTargets(),
      [PlayerGroups.WEREWOLVES]: () => this.getSingleTargetGamePlayEligibleTargets(),
      [RoleNames.BIG_BAD_WOLF]: (gamePlay, game) => this.getBigBadWolfGamePlayEligibleTargets(gamePlay, game),
      [RoleNames.CUPID]: () => this.getCupidGamePlayEligibleTargets(),
      [RoleNames.FOX]: () => this.getFoxGamePlayEligibleTargets(),
      [RoleNames.GUARD]: () => this.getSingleTargetGamePlayEligibleTargets(),
      [RoleNames.HUNTER]: () => this.getSingleTargetGamePlayEligibleTargets(),
      [RoleNames.PIED_PIPER]: (gamePlay, game) => this.getPiedPiperGamePlayEligibleTargets(gamePlay, game),
      [RoleNames.RAVEN]: () => this.getRavenGamePlayEligibleTargets(),
      [RoleNames.SCAPEGOAT]: (gamePlay, game) => this.getScapegoatGamePlayEligibleTargets(gamePlay, game),
      [RoleNames.SEER]: () => this.getSingleTargetGamePlayEligibleTargets(),
      [RoleNames.WHITE_WEREWOLF]: (gamePlay, game) => this.getWhiteWerewolfGamePlayEligibleTargets(gamePlay, game),
      [RoleNames.WILD_CHILD]: () => this.getSingleTargetGamePlayEligibleTargets(),
      [RoleNames.WITCH]: async(gamePlay, game) => this.getWitchGamePlayEligibleTargets(gamePlay, game),
    };

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

  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public setGamePlayCanBeSkipped(gamePlay: GamePlay, game: Game): GamePlay {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.canBeSkipped = this.canGamePlayBeSkipped(gamePlay, game);
    return clonedGamePlay;
  }

  public async setGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): Promise<GamePlay> {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.eligibleTargets = await this.getGamePlayEligibleTargets(gamePlay, game);
    return clonedGamePlay;
  }

  private getBigBadWolfGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): GamePlayEligibleTargets {
    const leftToEatByBigBadWolfPlayers = getLeftToEatByWerewolvesPlayers(game);
    const leftToEatByBigBadWolfPlayersCount = leftToEatByBigBadWolfPlayers.length ? 1 : 0;
    return createGamePlayEligibleTargets({ boundaries: { min: leftToEatByBigBadWolfPlayersCount, max: leftToEatByBigBadWolfPlayersCount } });
  }

  private getCupidGamePlayEligibleTargets(): GamePlayEligibleTargets {
    return createGamePlayEligibleTargets({ boundaries: { min: 2, max: 2 } });
  }

  private getFoxGamePlayEligibleTargets(): GamePlayEligibleTargets {
    return createGamePlayEligibleTargets({ boundaries: { min: 0, max: 1 } });
  }

  private getPiedPiperGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): GamePlayEligibleTargets {
    const leftToCharmByPiedPiperPlayers = getLeftToCharmByPiedPiperPlayers(game);
    const { charmedPeopleCountPerNight } = game.options.roles.piedPiper;
    const leftToCharmByPiedPiperPlayersCount = leftToCharmByPiedPiperPlayers.length;
    const countToCharm = Math.min(charmedPeopleCountPerNight, leftToCharmByPiedPiperPlayersCount);
    return createGamePlayEligibleTargets({ boundaries: { min: countToCharm, max: countToCharm } });
  }

  private getRavenGamePlayEligibleTargets(): GamePlayEligibleTargets {
    return createGamePlayEligibleTargets({ boundaries: { min: 0, max: 1 } });
  }

  private getScapegoatGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    return createGamePlayEligibleTargets({ boundaries: { min: 0, max: alivePlayers.length } });
  }

  private getWhiteWerewolfGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): GamePlayEligibleTargets {
    const leftToEatByWhiteWerewolfPlayers = getLeftToEatByWhiteWerewolfPlayers(game);
    const max = Math.min(1, leftToEatByWhiteWerewolfPlayers.length);
    return createGamePlayEligibleTargets({ boundaries: { min: 0, max } });
  }

  private async getWitchGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): Promise<GamePlayEligibleTargets> {
    const hasWitchUsedLifePotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.LIFE)).length > 0;
    const hasWitchUsedDeathPotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.DEATH)).length > 0;
    let max = 2;
    if (hasWitchUsedLifePotion) {
      max--;
    }
    if (hasWitchUsedDeathPotion) {
      max--;
    }
    return createGamePlayEligibleTargets({ boundaries: { min: 0, max } });
  }

  private getSingleTargetGamePlayEligibleTargets(): GamePlayEligibleTargets {
    return createGamePlayEligibleTargets({ boundaries: { min: 1, max: 1 } });
  }

  private async getGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): Promise<GamePlayEligibleTargets | undefined> {
    const eligibleTargetsPlayMethod = this.getEligibleTargetsPlayMethods[gamePlay.source.name];
    if (!eligibleTargetsPlayMethod) {
      return undefined;
    }
    return eligibleTargetsPlayMethod(gamePlay, game);
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