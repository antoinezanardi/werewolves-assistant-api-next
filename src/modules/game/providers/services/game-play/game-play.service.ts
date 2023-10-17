import { Injectable } from "@nestjs/common";

import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import { ON_FIRST_AND_LATER_NIGHTS_GAME_PLAYS_PRIORITY_LIST, ON_NIGHTS_GAME_PLAYS_PRIORITY_LIST } from "@/modules/game/constants/game.constant";
import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlay, createGamePlaySurvivorsElectSheriff, createGamePlaySurvivorsVote } from "@/modules/game/helpers/game-play/game-play.factory";
import { areGamePlaysEqual, canSurvivorsVote, findPlayPriorityIndex } from "@/modules/game/helpers/game-play/game-play.helper";
import { createGame, createGameWithCurrentGamePlay } from "@/modules/game/helpers/game.factory";
import { areAllWerewolvesAlive, getExpectedPlayersToPlay, getGroupOfPlayers, getLeftToEatByWerewolvesPlayers, getLeftToEatByWhiteWerewolfPlayers, getPlayerDtoWithRole, getPlayersWithActiveAttributeName, getPlayersWithCurrentRole, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole, isGameSourceGroup, isGameSourceRole } from "@/modules/game/helpers/game.helper";
import { canPiedPiperCharm, isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createNoGamePlayPriorityUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePlayService {
  public constructor(
    private readonly gamePlayAugmenterService: GamePlayAugmenterService,
    private readonly gameHistoryRecordService: GameHistoryRecordService,
  ) {}

  public async refreshUpcomingPlays(game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    clonedGame = await this.removeObsoleteUpcomingPlays(clonedGame);
    const currentPhaseNewUpcomingPlays = await this.getNewUpcomingPlaysForCurrentPhase(clonedGame);
    const upcomingPlaysToSort = [...clonedGame.upcomingPlays, ...currentPhaseNewUpcomingPlays];
    clonedGame.upcomingPlays = this.sortUpcomingPlaysByPriority(upcomingPlaysToSort);
    return clonedGame;
  }

  public proceedToNextGamePlay(game: Game): Game {
    let clonedGame = createGame(game);
    if (!clonedGame.upcomingPlays.length) {
      clonedGame.currentPlay = null;
      return clonedGame;
    }
    clonedGame.currentPlay = clonedGame.upcomingPlays[0];
    clonedGame.upcomingPlays.shift();
    clonedGame = this.augmentCurrentGamePlay(clonedGame as GameWithCurrentPlay);
    return clonedGame;
  }

  public augmentCurrentGamePlay(game: GameWithCurrentPlay): GameWithCurrentPlay {
    const clonedGame = createGameWithCurrentGamePlay(game);
    clonedGame.currentPlay = this.gamePlayAugmenterService.setGamePlayCanBeSkipped(clonedGame.currentPlay, clonedGame);
    clonedGame.currentPlay.source.players = getExpectedPlayersToPlay(clonedGame);
    return clonedGame;
  }

  public getUpcomingDayPlays(game: Game): GamePlay[] {
    const upcomingDayPlays: GamePlay[] = [];
    if (this.isSheriffElectionTime(game.options.roles.sheriff, game.turn, game.phase)) {
      upcomingDayPlays.push(createGamePlaySurvivorsElectSheriff());
    }
    if (canSurvivorsVote(game)) {
      upcomingDayPlays.push(createGamePlaySurvivorsVote());
    }
    return upcomingDayPlays;
  }

  public async getUpcomingNightPlays(game: CreateGameDto | Game): Promise<GamePlay[]> {
    const isFirstNight = game.turn === 1;
    const eligibleNightPlays = isFirstNight ? ON_FIRST_AND_LATER_NIGHTS_GAME_PLAYS_PRIORITY_LIST : ON_NIGHTS_GAME_PLAYS_PRIORITY_LIST;
    const isSheriffElectionTime = this.isSheriffElectionTime(game.options.roles.sheriff, game.turn, game.phase);
    const upcomingNightPlays: GamePlay[] = isSheriffElectionTime ? [createGamePlaySurvivorsElectSheriff()] : [];
    for (const eligibleNightPlay of eligibleNightPlays) {
      if (await this.isGamePlaySuitableForCurrentPhase(game, eligibleNightPlay as GamePlay)) {
        upcomingNightPlays.push(createGamePlay(eligibleNightPlay as GamePlay));
      }
    }
    return upcomingNightPlays;
  }

  private async removeObsoleteUpcomingPlays(game: Game): Promise<Game> {
    const clonedGame = createGame(game);
    const validUpcomingPlays: GamePlay[] = [];
    for (const upcomingPlay of clonedGame.upcomingPlays) {
      if (await this.isGamePlaySuitableForCurrentPhase(clonedGame, upcomingPlay)) {
        validUpcomingPlays.push(upcomingPlay);
      }
    }
    clonedGame.upcomingPlays = validUpcomingPlays;
    return clonedGame;
  }

  private isUpcomingPlayNewForCurrentPhase(upcomingPlay: GamePlay, game: Game, gameHistoryPhaseRecords: GameHistoryRecord[]): boolean {
    const { currentPlay } = game;
    const isAlreadyPlayed = gameHistoryPhaseRecords.some(({ play }) => {
      const { occurrence } = upcomingPlay;
      const { source, action, cause } = play;
      return areGamePlaysEqual({ source, action, cause, occurrence }, upcomingPlay);
    });
    const isInUpcomingPlays = game.upcomingPlays.some(gamePlay => areGamePlaysEqual(gamePlay, upcomingPlay));
    const isCurrentPlay = !!currentPlay && areGamePlaysEqual(currentPlay, upcomingPlay);
    return !isInUpcomingPlays && !isAlreadyPlayed && !isCurrentPlay;
  }

  private async getNewUpcomingPlaysForCurrentPhase(game: Game): Promise<GamePlay[]> {
    const { _id, turn, phase } = game;
    const currentPhaseUpcomingPlays = game.phase === GamePhases.NIGHT ? await this.getUpcomingNightPlays(game) : this.getUpcomingDayPlays(game);
    const gameHistoryPhaseRecords = await this.gameHistoryRecordService.getGameHistoryPhaseRecords(_id, turn, phase);
    return currentPhaseUpcomingPlays.filter(gamePlay => this.isUpcomingPlayNewForCurrentPhase(gamePlay, game, gameHistoryPhaseRecords));
  }

  private validateUpcomingPlaysPriority(upcomingPlays: GamePlay[]): void {
    for (const upcomingPlay of upcomingPlays) {
      const playPriorityIndex = findPlayPriorityIndex(upcomingPlay);
      if (playPriorityIndex === -1) {
        throw createNoGamePlayPriorityUnexpectedException(this.validateUpcomingPlaysPriority.name, upcomingPlay);
      }
    }
  }

  private sortUpcomingPlaysByPriority(upcomingPlays: GamePlay[]): GamePlay[] {
    const clonedUpcomingPlays = upcomingPlays.map(upcomingPlay => createGamePlay(upcomingPlay));
    this.validateUpcomingPlaysPriority(clonedUpcomingPlays);
    return clonedUpcomingPlays.sort((playA, playB) => {
      const playAPriorityIndex = findPlayPriorityIndex(playA);
      const playBPriorityIndex = findPlayPriorityIndex(playB);
      return playAPriorityIndex - playBPriorityIndex;
    });
  }

  private isSheriffElectionTime(sheriffGameOptions: SheriffGameOptions, currentTurn: number, currentPhase: GamePhases): boolean {
    const { electedAt, isEnabled } = sheriffGameOptions;
    return isEnabled && electedAt.turn === currentTurn && electedAt.phase === currentPhase;
  }

  private isLoversGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.CUPID);
    }
    const cupidPlayer = getPlayerWithCurrentRole(game, RoleNames.CUPID);
    if (!cupidPlayer) {
      return false;
    }
    const inLovePlayers = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.IN_LOVE);
    return !inLovePlayers.length && isPlayerAliveAndPowerful(cupidPlayer, game) || inLovePlayers.length > 0 && inLovePlayers.every(player => player.isAlive);
  }

  private isSurvivorsGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): boolean {
    if (gamePlay.cause !== GamePlayCauses.ANGEL_PRESENCE) {
      return true;
    }
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.ANGEL);
    }
    const angelPlayer = getPlayerWithCurrentRole(game, RoleNames.ANGEL);
    return !!angelPlayer && isPlayerAliveAndPowerful(angelPlayer, game);
  }

  private isGroupGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): boolean {
    const source = gamePlay.source.name as PlayerGroups;
    const specificGroupMethods: Record<PlayerGroups, (game: CreateGameDto | Game, gamePlay: GamePlay) => boolean> = {
      [PlayerGroups.SURVIVORS]: this.isSurvivorsGamePlaySuitableForCurrentPhase,
      [PlayerGroups.LOVERS]: this.isLoversGamePlaySuitableForCurrentPhase,
      [PlayerGroups.CHARMED]: this.isPiedPiperGamePlaySuitableForCurrentPhase,
      [PlayerGroups.WEREWOLVES]: () => game instanceof CreateGameDto || getGroupOfPlayers(game, source).some(werewolf => isPlayerAliveAndPowerful(werewolf, game)),
      [PlayerGroups.VILLAGERS]: () => false,
    };
    return specificGroupMethods[source](game, gamePlay);
  }

  private async isWitchGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): Promise<boolean> {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.WITCH);
    }
    const hasWitchUsedLifePotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.LIFE)).length > 0;
    const hasWitchUsedDeathPotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.DEATH)).length > 0;
    const { doSkipCallIfNoTarget } = game.options.roles;
    const witchPlayer = getPlayerWithCurrentRole(game, RoleNames.WITCH);
    return !!witchPlayer && isPlayerAliveAndPowerful(witchPlayer, game) && (!doSkipCallIfNoTarget || !hasWitchUsedLifePotion || !hasWitchUsedDeathPotion);
  }

  private shouldBeCalledOnCurrentTurnInterval(wakingUpInterval: number, game: CreateGameDto | Game): boolean {
    return (game.turn - 1) % wakingUpInterval === 0;
  }

  private isWhiteWerewolfGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.whiteWerewolf;
    const shouldWhiteWerewolfBeCalledOnCurrentTurn = this.shouldBeCalledOnCurrentTurnInterval(wakingUpInterval, game);
    if (game instanceof CreateGameDto) {
      return shouldWhiteWerewolfBeCalledOnCurrentTurn && !!getPlayerDtoWithRole(game, RoleNames.WHITE_WEREWOLF);
    }
    const { doSkipCallIfNoTarget } = game.options.roles;
    const availableTargets = getLeftToEatByWhiteWerewolfPlayers(game);
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, RoleNames.WHITE_WEREWOLF);
    return shouldWhiteWerewolfBeCalledOnCurrentTurn && !!whiteWerewolfPlayer && isPlayerAliveAndPowerful(whiteWerewolfPlayer, game) &&
      (!doSkipCallIfNoTarget || !!availableTargets.length);
  }

  private isPiedPiperGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.PIED_PIPER);
    }
    const piedPiperPlayer = getPlayerWithCurrentRole(game, RoleNames.PIED_PIPER);
    return !!piedPiperPlayer && canPiedPiperCharm(piedPiperPlayer, game);
  }

  private isBigBadWolfGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.BIG_BAD_WOLF);
    }
    const { doSkipCallIfNoTarget } = game.options.roles;
    const availableTargets = getLeftToEatByWerewolvesPlayers(game);
    const { isPowerlessIfWerewolfDies } = game.options.roles.bigBadWolf;
    const bigBadWolfPlayer = getPlayerWithCurrentRole(game, RoleNames.BIG_BAD_WOLF);
    return !!bigBadWolfPlayer && isPlayerAliveAndPowerful(bigBadWolfPlayer, game) &&
      (!isPowerlessIfWerewolfDies || areAllWerewolvesAlive(game) && (!doSkipCallIfNoTarget || !!availableTargets.length));
  }

  private isThreeBrothersGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.threeBrothers;
    const shouldThreeBrothersBeCalledOnCurrentTurn = this.shouldBeCalledOnCurrentTurnInterval(wakingUpInterval, game);
    if (game instanceof CreateGameDto) {
      return shouldThreeBrothersBeCalledOnCurrentTurn && !!getPlayerDtoWithRole(game, RoleNames.THREE_BROTHERS);
    }
    const threeBrothersPlayers = getPlayersWithCurrentRole(game, RoleNames.THREE_BROTHERS);
    const minimumBrotherCountToCall = 2;
    return shouldThreeBrothersBeCalledOnCurrentTurn && threeBrothersPlayers.filter(brother => brother.isAlive).length >= minimumBrotherCountToCall;
  }

  private isTwoSistersGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.twoSisters;
    const shouldTwoSistersBeCalledOnCurrentTurn = this.shouldBeCalledOnCurrentTurnInterval(wakingUpInterval, game);
    if (game instanceof CreateGameDto) {
      return shouldTwoSistersBeCalledOnCurrentTurn && !!getPlayerDtoWithRole(game, RoleNames.TWO_SISTERS);
    }
    const twoSistersPlayers = getPlayersWithCurrentRole(game, RoleNames.TWO_SISTERS);
    return shouldTwoSistersBeCalledOnCurrentTurn && twoSistersPlayers.length > 0 && twoSistersPlayers.every(sister => sister.isAlive);
  }

  private async isRoleGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    const source = gamePlay.source.name as RoleNames;
    const player = game instanceof CreateGameDto ? getPlayerDtoWithRole(game, source) : getPlayerWithCurrentRole(game, source);
    if (!player) {
      return false;
    }
    const specificRoleMethods: Partial<Record<RoleNames, () => Promise<boolean> | boolean>> = {
      [RoleNames.TWO_SISTERS]: () => this.isTwoSistersGamePlaySuitableForCurrentPhase(game),
      [RoleNames.THREE_BROTHERS]: () => this.isThreeBrothersGamePlaySuitableForCurrentPhase(game),
      [RoleNames.BIG_BAD_WOLF]: () => this.isBigBadWolfGamePlaySuitableForCurrentPhase(game),
      [RoleNames.PIED_PIPER]: () => this.isPiedPiperGamePlaySuitableForCurrentPhase(game),
      [RoleNames.WHITE_WEREWOLF]: () => this.isWhiteWerewolfGamePlaySuitableForCurrentPhase(game),
      [RoleNames.WITCH]: async() => this.isWitchGamePlaySuitableForCurrentPhase(game),
      [RoleNames.HUNTER]: () => player instanceof CreateGamePlayerDto || isPlayerPowerful(player, game as Game),
      [RoleNames.SCAPEGOAT]: () => player instanceof CreateGamePlayerDto || isPlayerPowerful(player, game as Game),
    };
    if (specificRoleMethods[source] !== undefined) {
      return await specificRoleMethods[source]?.() === true;
    }
    return player instanceof CreateGamePlayerDto || isPlayerAliveAndPowerful(player, game as Game);
  }

  private isSheriffGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (!game.options.roles.sheriff.isEnabled) {
      return false;
    }
    if (game instanceof CreateGameDto) {
      return true;
    }
    const sheriffPlayer = getPlayerWithActiveAttributeName(game, PlayerAttributeNames.SHERIFF);
    return !!sheriffPlayer;
  }

  private async isGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    if (isGameSourceRole(gamePlay.source.name)) {
      return this.isRoleGamePlaySuitableForCurrentPhase(game, gamePlay);
    } else if (isGameSourceGroup(gamePlay.source.name)) {
      return this.isGroupGamePlaySuitableForCurrentPhase(game, gamePlay);
    }
    return this.isSheriffGamePlaySuitableForCurrentPhase(game);
  }
}