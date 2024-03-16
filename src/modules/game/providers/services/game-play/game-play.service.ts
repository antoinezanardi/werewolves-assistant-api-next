import { Injectable } from "@nestjs/common";

import { DAY_GAME_PLAYS_PRIORITY_LIST, NIGHT_GAME_PLAYS_PRIORITY_LIST } from "@/modules/game/constants/game.constant";
import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { GamePlayActions, GamePlayCauses, GamePlayOccurrences, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlay, createGamePlaySurvivorsElectSheriff } from "@/modules/game/helpers/game-play/game-play.factory";
import { areGamePlaysEqual, canSurvivorsVote, findPlayPriorityIndex } from "@/modules/game/helpers/game-play/game-play.helper";
import { createGame, createGameWithCurrentGamePlay } from "@/modules/game/helpers/game.factory";
import { getEligibleCupidTargets, getEligibleWerewolvesTargets, getEligibleWhiteWerewolfTargets, getGroupOfPlayers, getNearestAliveNeighbor, getPlayerDtoWithRole, getPlayersWithActiveAttributeName, getPlayersWithCurrentRole, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole, isGameSourceGroup, isGameSourceRole } from "@/modules/game/helpers/game.helper";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createNoGamePlayPriorityUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePlayService {
  private readonly specificRoleGamePlaySuitabilityMethods: Partial<Record<RoleNames, (game: CreateGameDto | Game) => Promise<boolean> | boolean>> = {
    [RoleNames.CUPID]: (game: Game) => this.isCupidGamePlaySuitableForCurrentPhase(game),
    [RoleNames.TWO_SISTERS]: (game: Game) => this.isTwoSistersGamePlaySuitableForCurrentPhase(game),
    [RoleNames.THREE_BROTHERS]: (game: Game) => this.isThreeBrothersGamePlaySuitableForCurrentPhase(game),
    [RoleNames.BIG_BAD_WOLF]: (game: Game) => this.isBigBadWolfGamePlaySuitableForCurrentPhase(game),
    [RoleNames.PIED_PIPER]: (game: Game) => this.isPiedPiperGamePlaySuitableForCurrentPhase(game),
    [RoleNames.WHITE_WEREWOLF]: (game: Game) => this.isWhiteWerewolfGamePlaySuitableForCurrentPhase(game),
    [RoleNames.WITCH]: async(game: Game) => this.isWitchGamePlaySuitableForCurrentPhase(game),
    [RoleNames.ACTOR]: (game: Game) => this.isActorGamePlaySuitableForCurrentPhase(game),
    [RoleNames.BEAR_TAMER]: async(game: Game) => this.isBearTamerGamePlaySuitableForCurrentPhase(game),
    [RoleNames.ACCURSED_WOLF_FATHER]: async(game: Game) => this.isAccursedWolfFatherGamePlaySuitableForCurrentPhase(game),
    [RoleNames.STUTTERING_JUDGE]: async(game: Game) => this.isStutteringJudgeGamePlaySuitableForCurrentPhase(game),
  };

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
    clonedGame.currentPlay = await this.gamePlayAugmenterService.setGamePlaySourceInteractions(clonedGame.currentPlay, clonedGame);
    clonedGame.currentPlay = this.gamePlayAugmenterService.setGamePlaySourcePlayers(clonedGame.currentPlay, clonedGame);
    return clonedGame;
  }

  public async getPhaseUpcomingPlays(game: CreateGameDto | Game): Promise<GamePlay[]> {
    const isSheriffElectionTime = this.isSheriffElectionTime(game.options.roles.sheriff, game.turn, game.phase);
    const phaseGamePlaysPriorityList = game.phase === GamePhases.NIGHT ? NIGHT_GAME_PLAYS_PRIORITY_LIST : DAY_GAME_PLAYS_PRIORITY_LIST;
    const suitabilityPromises = phaseGamePlaysPriorityList.map(async eligiblePlay => this.isGamePlaySuitableForCurrentPhase(game, eligiblePlay as GamePlay));
    const suitabilityResults = await Promise.all(suitabilityPromises);
    const upcomingNightPlays = phaseGamePlaysPriorityList
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
      const { type, source, action, cause } = play;
      return areGamePlaysEqual({ type, source, action, cause, occurrence }, upcomingPlay);
    });
    const isInUpcomingPlays = game.upcomingPlays.some(gamePlay => areGamePlaysEqual(gamePlay, upcomingPlay));
    const isCurrentPlay = !!currentPlay && areGamePlaysEqual(currentPlay, upcomingPlay);
    return !isInUpcomingPlays && !isAlreadyPlayed && !isCurrentPlay;
  }

  private async getNewUpcomingPlaysForCurrentPhase(game: Game): Promise<GamePlay[]> {
    const { _id, turn, phase } = game;
    const currentPhaseUpcomingPlays = await this.getPhaseUpcomingPlays(game);
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

  private async isStutteringJudgeGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): Promise<boolean> {
    if (game instanceof CreateGameDto) {
      return false;
    }
    const stutteringJudgePlayer = getPlayerWithCurrentRole(game, RoleNames.STUTTERING_JUDGE);
    if (!stutteringJudgePlayer || !isPlayerAliveAndPowerful(stutteringJudgePlayer, game)) {
      return false;
    }
    const { voteRequestsCount } = game.options.roles.stutteringJudge;
    const judgeGamePlayRecords = await this.gameHistoryRecordService.getGameHistoryStutteringJudgeRequestsAnotherVoteRecords(game._id, stutteringJudgePlayer._id);
    return judgeGamePlayRecords.length < voteRequestsCount;
  }

  private async isAccursedWolfFatherGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): Promise<boolean> {
    const { doSkipCallIfNoTarget: doesSkipCallIfNoTarget } = game.options.roles;
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game, RoleNames.ACCURSED_WOLF_FATHER);
    }
    const accursedWolfFatherPlayer = getPlayerWithCurrentRole(game, RoleNames.ACCURSED_WOLF_FATHER);
    if (!accursedWolfFatherPlayer || !isPlayerAliveAndPowerful(accursedWolfFatherPlayer, game)) {
      return false;
    }
    const lastAccursedWolfFatherGamePlayRecord = await this.gameHistoryRecordService.getLastGameHistoryAccursedWolfFatherInfectsRecord(game._id, accursedWolfFatherPlayer._id);
    return !doesSkipCallIfNoTarget || !lastAccursedWolfFatherGamePlayRecord;
  }

  private async isBearTamerGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): Promise<boolean> {
    if (game instanceof CreateGameDto) {
      return false;
    }
    const bearTamerPlayer = getPlayerWithCurrentRole(game, RoleNames.BEAR_TAMER);
    if (!bearTamerPlayer || !isPlayerAliveAndPowerful(bearTamerPlayer, game)) {
      return false;
    }
    const leftAliveNeighbor = getNearestAliveNeighbor(bearTamerPlayer._id, game, { direction: "left" });
    const rightAliveNeighbor = getNearestAliveNeighbor(bearTamerPlayer._id, game, { direction: "right" });
    const doesBearTamerHaveWerewolfSidedNeighbor = leftAliveNeighbor?.side.current === RoleSides.WEREWOLVES || rightAliveNeighbor?.side.current === RoleSides.WEREWOLVES;
    const { doesGrowlOnWerewolvesSide } = game.options.roles.bearTamer;
    const isBearTamerInfected = bearTamerPlayer.side.current === RoleSides.WEREWOLVES;
    const lastVoteGamePlay = await this.gameHistoryRecordService.getLastGameHistorySurvivorsVoteRecord(game._id);
    const didGamePhaseHaveSurvivorsVote = lastVoteGamePlay?.turn === game.turn && lastVoteGamePlay.phase === game.phase;
    return !didGamePhaseHaveSurvivorsVote && (doesGrowlOnWerewolvesSide && isBearTamerInfected || doesBearTamerHaveWerewolfSidedNeighbor);
  }

  private async isSurvivorsGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): Promise<boolean> {
    if (gamePlay.action !== GamePlayActions.VOTE) {
      return true;
    }
    if (gamePlay.cause !== GamePlayCauses.ANGEL_PRESENCE) {
      return game instanceof CreateGameDto ? true : canSurvivorsVote(game);
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
    if ([RoleNames.HUNTER, RoleNames.SCAPEGOAT].includes(source)) {
      return player instanceof CreateGamePlayerDto || isPlayerPowerful(player, game as Game);
    }
    if (this.specificRoleGamePlaySuitabilityMethods[source] !== undefined) {
      return await this.specificRoleGamePlaySuitabilityMethods[source]?.(game) === true;
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