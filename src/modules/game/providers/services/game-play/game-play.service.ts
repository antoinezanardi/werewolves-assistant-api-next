import { Injectable } from "@nestjs/common";

import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import { NIGHT_GAME_PLAYS_PRIORITY_LIST } from "@/modules/game/constants/game.constant";
import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { GamePlayCauses, GamePlayOccurrences, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlay, createGamePlaySurvivorsElectSheriff, createGamePlaySurvivorsVote } from "@/modules/game/helpers/game-play/game-play.factory";
import { areGamePlaysEqual, canSurvivorsVote, findPlayPriorityIndex } from "@/modules/game/helpers/game-play/game-play.helper";
import { createGame, createGameWithCurrentGamePlay } from "@/modules/game/helpers/game.factory";
import { getGroupOfPlayers, getEligibleWerewolvesTargets, getEligibleWhiteWerewolfTargets, getPlayerDtoWithRole, getPlayersWithActiveAttributeName, getPlayersWithCurrentRole, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole, isGameSourceGroup, isGameSourceRole, getEligibleCupidTargets } from "@/modules/game/helpers/game.helper";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
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
    const clonedGame = createGame(game);
    if (!clonedGame.upcomingPlays.length) {
      clonedGame.currentPlay = null;
      return clonedGame;
    }
    clonedGame.currentPlay = clonedGame.upcomingPlays[0];
    clonedGame.upcomingPlays.shift();
    return clonedGame;
  }

  public async augmentCurrentGamePlay(game: GameWithCurrentPlay): Promise<GameWithCurrentPlay> {
    const clonedGame = createGameWithCurrentGamePlay(game);
    clonedGame.currentPlay = this.gamePlayAugmenterService.setGamePlayCanBeSkipped(clonedGame.currentPlay, clonedGame);
    clonedGame.currentPlay = await this.gamePlayAugmenterService.setGamePlayEligibleTargets(clonedGame.currentPlay, clonedGame);
    clonedGame.currentPlay = this.gamePlayAugmenterService.setGamePlaySourcePlayers(clonedGame.currentPlay, clonedGame);
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
    const isSheriffElectionTime = this.isSheriffElectionTime(game.options.roles.sheriff, game.turn, game.phase);
    const suitabilityPromises = NIGHT_GAME_PLAYS_PRIORITY_LIST.map(async eligiblePlay => this.isGamePlaySuitableForCurrentPhase(game, eligiblePlay as GamePlay));
    const suitabilityResults = await Promise.all(suitabilityPromises);
    const upcomingNightPlays = NIGHT_GAME_PLAYS_PRIORITY_LIST
      .filter((gamePlay, index) => suitabilityResults[index])
      .map(play => createGamePlay(play as GamePlay));
    return isSheriffElectionTime ? [createGamePlaySurvivorsElectSheriff(), ...upcomingNightPlays] : upcomingNightPlays;
  }

  private async removeObsoleteUpcomingPlays(game: Game): Promise<Game> {
    const clonedGame = createGame(game);
    const suitabilityPromises = clonedGame.upcomingPlays.map(async eligiblePlay => this.isGamePlaySuitableForCurrentPhase(game, eligiblePlay));
    const suitabilityResults = await Promise.all(suitabilityPromises);
    clonedGame.upcomingPlays = clonedGame.upcomingPlays.filter((gamePlay, index) => suitabilityResults[index]);
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

  private async isLoversGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    if (game instanceof CreateGameDto) {
      return false;
    }
    const inLovePlayers = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.IN_LOVE);
    return inLovePlayers.length > 0 && inLovePlayers.every(player => player.isAlive) && !await this.gameHistoryRecordService.hasGamePlayBeenMade(game._id, gamePlay);
  }

  private async isSurvivorsGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    if (gamePlay.cause !== GamePlayCauses.ANGEL_PRESENCE) {
      return true;
    }
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.ANGEL);
    }
    const angelPlayer = getPlayerWithCurrentRole(game, RoleNames.ANGEL);
    return !!angelPlayer && isPlayerAliveAndPowerful(angelPlayer, game) && !await this.gameHistoryRecordService.hasGamePlayBeenMade(game._id, gamePlay);
  }

  private async isGroupGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    const source = gamePlay.source.name as PlayerGroups;
    const specificGroupMethods: Record<PlayerGroups, (game: CreateGameDto | Game, gamePlay: GamePlay) => Promise<boolean> | boolean> = {
      [PlayerGroups.SURVIVORS]: async() => this.isSurvivorsGamePlaySuitableForCurrentPhase(game, gamePlay),
      [PlayerGroups.LOVERS]: async() => this.isLoversGamePlaySuitableForCurrentPhase(game, gamePlay),
      [PlayerGroups.CHARMED]: () => this.isPiedPiperGamePlaySuitableForCurrentPhase(game),
      [PlayerGroups.WEREWOLVES]: () => game instanceof CreateGameDto || getGroupOfPlayers(game, source).some(werewolf => werewolf.isAlive),
      [PlayerGroups.VILLAGERS]: () => false,
    };
    return specificGroupMethods[source](game, gamePlay);
  }
  
  private async isOneNightOnlyGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, gamePlay.source.name as RoleNames);
    }
    const player = getPlayerWithCurrentRole(game, gamePlay.source.name as RoleNames);
    if (!player || !isPlayerAliveAndPowerful(player, game)) {
      return false;
    }
    return !await this.gameHistoryRecordService.hasGamePlayBeenMadeByPlayer(game._id, gamePlay, player);
  }

  private isActorGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.ACTOR);
    }
    const actorPlayer = getPlayerWithCurrentRole(game, RoleNames.ACTOR);
    const notUsedActorGameAdditionalCards = game.additionalCards?.filter(({ recipient, isUsed }) => recipient === RoleNames.ACTOR && !isUsed) ?? [];
    return !!actorPlayer && isPlayerAliveAndPowerful(actorPlayer, game) && notUsedActorGameAdditionalCards.length > 0;
  }

  private async isWitchGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): Promise<boolean> {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.WITCH);
    }
    const witchPlayer = getPlayerWithCurrentRole(game, RoleNames.WITCH);
    if (!witchPlayer || !isPlayerAliveAndPowerful(witchPlayer, game)) {
      return false;
    }
    const [lifePotionRecords, deathPotionRecords] = await Promise.all([
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, WitchPotions.LIFE),
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, WitchPotions.DEATH),
    ]);
    const hasWitchUsedLifePotion = lifePotionRecords.length > 0;
    const hasWitchUsedDeathPotion = deathPotionRecords.length > 0;
    const { doSkipCallIfNoTarget } = game.options.roles;
    return !doSkipCallIfNoTarget || !hasWitchUsedLifePotion || !hasWitchUsedDeathPotion;
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
    const availableTargets = getEligibleWhiteWerewolfTargets(game);
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, RoleNames.WHITE_WEREWOLF);
    return shouldWhiteWerewolfBeCalledOnCurrentTurn && !!whiteWerewolfPlayer && isPlayerAliveAndPowerful(whiteWerewolfPlayer, game) &&
      (!doSkipCallIfNoTarget || !!availableTargets.length);
  }

  private isPiedPiperGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.PIED_PIPER);
    }
    const piedPiperPlayer = getPlayerWithCurrentRole(game, RoleNames.PIED_PIPER);
    return !!piedPiperPlayer && isPlayerAliveAndPowerful(piedPiperPlayer, game);
  }

  private isBigBadWolfGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.BIG_BAD_WOLF);
    }
    const { doSkipCallIfNoTarget } = game.options.roles;
    const availableTargets = getEligibleWerewolvesTargets(game);
    const bigBadWolfPlayer = getPlayerWithCurrentRole(game, RoleNames.BIG_BAD_WOLF);
    return !!bigBadWolfPlayer && isPlayerAliveAndPowerful(bigBadWolfPlayer, game) && (!doSkipCallIfNoTarget || !!availableTargets.length);
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

  private isCupidGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.CUPID);
    }
    const { doSkipCallIfNoTarget } = game.options.roles;
    const expectedPlayersToCharmCount = 2;
    const cupidPlayer = getPlayerWithCurrentRole(game, RoleNames.CUPID);
    const availableTargets = getEligibleCupidTargets(game);
    if (!cupidPlayer || !isPlayerAliveAndPowerful(cupidPlayer, game) ||
      doSkipCallIfNoTarget && availableTargets.length < expectedPlayersToCharmCount) {
      return false;
    }
    const inLovePlayers = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.IN_LOVE);
    return !inLovePlayers.length;
  }

  private async isRoleGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    const source = gamePlay.source.name as RoleNames;
    const player = game instanceof CreateGameDto ? getPlayerDtoWithRole(game, source) : getPlayerWithCurrentRole(game, source);
    if (!player) {
      return false;
    }
    const specificRoleMethods: Partial<Record<RoleNames, () => Promise<boolean> | boolean>> = {
      [RoleNames.CUPID]: () => this.isCupidGamePlaySuitableForCurrentPhase(game),
      [RoleNames.TWO_SISTERS]: () => this.isTwoSistersGamePlaySuitableForCurrentPhase(game),
      [RoleNames.THREE_BROTHERS]: () => this.isThreeBrothersGamePlaySuitableForCurrentPhase(game),
      [RoleNames.BIG_BAD_WOLF]: () => this.isBigBadWolfGamePlaySuitableForCurrentPhase(game),
      [RoleNames.PIED_PIPER]: () => this.isPiedPiperGamePlaySuitableForCurrentPhase(game),
      [RoleNames.WHITE_WEREWOLF]: () => this.isWhiteWerewolfGamePlaySuitableForCurrentPhase(game),
      [RoleNames.WITCH]: async() => this.isWitchGamePlaySuitableForCurrentPhase(game),
      [RoleNames.HUNTER]: () => player instanceof CreateGamePlayerDto || isPlayerPowerful(player, game as Game),
      [RoleNames.SCAPEGOAT]: () => player instanceof CreateGamePlayerDto || isPlayerPowerful(player, game as Game),
      [RoleNames.ACTOR]: () => this.isActorGamePlaySuitableForCurrentPhase(game),
    };
    if (specificRoleMethods[source] !== undefined) {
      return await specificRoleMethods[source]?.() === true;
    }
    if (gamePlay.occurrence === GamePlayOccurrences.ONE_NIGHT_ONLY) {
      return this.isOneNightOnlyGamePlaySuitableForCurrentPhase(game, gamePlay);
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