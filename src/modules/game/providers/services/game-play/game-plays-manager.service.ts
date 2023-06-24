import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { gamePlaysNightOrder } from "../../../constants/game.constant";
import { CreateGamePlayerDto } from "../../../dto/create-game/create-game-player/create-game-player.dto";
import { CreateGameDto } from "../../../dto/create-game/create-game.dto";
import { GAME_PLAY_CAUSES } from "../../../enums/game-play.enum";
import type { GAME_PHASES } from "../../../enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../enums/player.enum";
import { createGamePlay, createGamePlayAllElectSheriff } from "../../../helpers/game-play/game-play.factory";
import { areAllWerewolvesAlive, getGroupOfPlayers, getPlayerDtoWithRole, getPlayersWithAttribute, getPlayersWithCurrentRole, getPlayerWithAttribute, getPlayerWithCurrentRole, isGameSourceGroup, isGameSourceRole } from "../../../helpers/game.helper";
import { canPiedPiperCharm, isPlayerAliveAndPowerful, isPlayerPowerful } from "../../../helpers/player/player.helper";
import type { SheriffGameOptions } from "../../../schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import type { GamePlay } from "../../../schemas/game-play.schema";
import type { Game } from "../../../schemas/game.schema";

@Injectable()
export class GamePlaysManagerService {
  public removeObsoleteUpcomingPlays(game: Game): Game {
    const clonedGame = cloneDeep(game);
    clonedGame.upcomingPlays = clonedGame.upcomingPlays.filter(upcomingPlay => this.isGamePlaySuitableForCurrentPhase(clonedGame, upcomingPlay));
    return clonedGame;
  }

  public proceedToNextGamePlay(game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (!clonedGame.upcomingPlays.length) {
      return clonedGame;
    }
    clonedGame.currentPlay = clonedGame.upcomingPlays[0];
    clonedGame.upcomingPlays.shift();
    return clonedGame;
  }

  public getUpcomingNightPlays(game: CreateGameDto | Game): GamePlay[] {
    const isFirstNight = game.turn === 1;
    const eligibleNightPlays = gamePlaysNightOrder.filter(play => isFirstNight || play.isFirstNightOnly !== true);
    const isSheriffElectionTime = this.isSheriffElectionTime(game.options.roles.sheriff, game.turn, game.phase);
    const upcomingNightPlays: GamePlay[] = isSheriffElectionTime ? [createGamePlayAllElectSheriff()] : [];
    return eligibleNightPlays.reduce((acc: GamePlay[], gamePlay) => {
      if (this.isGamePlaySuitableForCurrentPhase(game, gamePlay)) {
        return [...acc, createGamePlay(gamePlay)];
      }
      return acc;
    }, upcomingNightPlays);
  }

  private isSheriffElectionTime(sheriffGameOptions: SheriffGameOptions, currentTurn: number, currentPhase: GAME_PHASES): boolean {
    const { electedAt, isEnabled } = sheriffGameOptions;
    return isEnabled && electedAt.turn === currentTurn && electedAt.phase === currentPhase;
  }

  private isLoversGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.CUPID);
    }
    const cupidPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.CUPID);
    if (!cupidPlayer) {
      return false;
    }
    const inLovePlayers = getPlayersWithAttribute(game.players, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
    return !inLovePlayers.length && isPlayerAliveAndPowerful(cupidPlayer) || inLovePlayers.length > 0 && inLovePlayers.every(player => player.isAlive);
  }

  private isAllGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): boolean {
    if (gamePlay.cause !== GAME_PLAY_CAUSES.ANGEL_PRESENCE) {
      return true;
    }
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.ANGEL);
    }
    const angelPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.ANGEL);
    return !!angelPlayer && isPlayerAliveAndPowerful(angelPlayer);
  }

  private isGroupGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): boolean {
    const source = gamePlay.source as PLAYER_GROUPS;
    const specificGroupMethods: Record<PLAYER_GROUPS, (game: CreateGameDto | Game, gamePlay: GamePlay) => boolean> = {
      [PLAYER_GROUPS.ALL]: this.isAllGamePlaySuitableForCurrentPhase,
      [PLAYER_GROUPS.LOVERS]: this.isLoversGamePlaySuitableForCurrentPhase,
      [PLAYER_GROUPS.CHARMED]: this.isPiedPiperGamePlaySuitableForCurrentPhase,
      [PLAYER_GROUPS.WEREWOLVES]: () => game instanceof CreateGameDto || getGroupOfPlayers(game.players, source).some(werewolf => isPlayerAliveAndPowerful(werewolf)),
      [PLAYER_GROUPS.VILLAGERS]: () => false,
    };
    return specificGroupMethods[source](game, gamePlay);
  }

  private isWhiteWerewolfGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.whiteWerewolf;
    const shouldWhiteWerewolfBeCalled = wakingUpInterval > 0;
    if (game instanceof CreateGameDto) {
      return shouldWhiteWerewolfBeCalled && !!getPlayerDtoWithRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    }
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    return shouldWhiteWerewolfBeCalled && !!whiteWerewolfPlayer && isPlayerAliveAndPowerful(whiteWerewolfPlayer);
  }

  private isPiedPiperGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.PIED_PIPER);
    }
    const { isPowerlessIfInfected } = game.options.roles.piedPiper;
    const piedPiperPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.PIED_PIPER);
    return !!piedPiperPlayer && canPiedPiperCharm(piedPiperPlayer, isPowerlessIfInfected);
  }

  private isBigBadWolfGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.BIG_BAD_WOLF);
    }
    const { isPowerlessIfWerewolfDies } = game.options.roles.bigBadWolf;
    const bigBadWolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.BIG_BAD_WOLF);
    return !!bigBadWolfPlayer && isPlayerAliveAndPowerful(bigBadWolfPlayer) && (!isPowerlessIfWerewolfDies || areAllWerewolvesAlive(game.players));
  }

  private isThreeBrothersGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.threeBrothers;
    const shouldThreeBrothersBeCalled = wakingUpInterval > 0;
    if (game instanceof CreateGameDto) {
      return shouldThreeBrothersBeCalled && !!getPlayerDtoWithRole(game.players, ROLE_NAMES.THREE_BROTHERS);
    }
    const threeBrothersPlayers = getPlayersWithCurrentRole(game.players, ROLE_NAMES.THREE_BROTHERS);
    const minimumBrotherCountToCall = 2;
    return shouldThreeBrothersBeCalled && threeBrothersPlayers.filter(brother => brother.isAlive).length >= minimumBrotherCountToCall;
  }

  private isTwoSistersGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.twoSisters;
    const shouldTwoSistersBeCalled = wakingUpInterval > 0;
    if (game instanceof CreateGameDto) {
      return shouldTwoSistersBeCalled && !!getPlayerDtoWithRole(game.players, ROLE_NAMES.TWO_SISTERS);
    }
    const twoSistersPlayers = getPlayersWithCurrentRole(game.players, ROLE_NAMES.TWO_SISTERS);
    return shouldTwoSistersBeCalled && twoSistersPlayers.length > 0 && twoSistersPlayers.every(sister => sister.isAlive);
  }

  private isRoleGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): boolean {
    const source = gamePlay.source as ROLE_NAMES;
    const player = game instanceof CreateGameDto ? getPlayerDtoWithRole(game.players, source) : getPlayerWithCurrentRole(game.players, source);
    if (!player) {
      return false;
    }
    const specificRoleMethods: Partial<Record<ROLE_NAMES, (game: CreateGameDto | Game, gamePlay?: GamePlay) => boolean>> = {
      [ROLE_NAMES.TWO_SISTERS]: this.isTwoSistersGamePlaySuitableForCurrentPhase,
      [ROLE_NAMES.THREE_BROTHERS]: this.isThreeBrothersGamePlaySuitableForCurrentPhase,
      [ROLE_NAMES.BIG_BAD_WOLF]: this.isBigBadWolfGamePlaySuitableForCurrentPhase,
      [ROLE_NAMES.PIED_PIPER]: this.isPiedPiperGamePlaySuitableForCurrentPhase,
      [ROLE_NAMES.WHITE_WEREWOLF]: this.isWhiteWerewolfGamePlaySuitableForCurrentPhase,
      [ROLE_NAMES.HUNTER]: () => player instanceof CreateGamePlayerDto || isPlayerPowerful(player),
      [ROLE_NAMES.SCAPEGOAT]: () => player instanceof CreateGamePlayerDto || isPlayerPowerful(player),
    };
    if (specificRoleMethods[source] !== undefined) {
      return specificRoleMethods[source]?.(game, gamePlay) === true;
    }
    return player instanceof CreateGamePlayerDto || isPlayerAliveAndPowerful(player);
  }

  private isSheriffGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game): boolean {
    if (!game.options.roles.sheriff.isEnabled) {
      return false;
    }
    if (game instanceof CreateGameDto) {
      return true;
    }
    const sheriffPlayer = getPlayerWithAttribute(game.players, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
    return !!sheriffPlayer;
  }

  private isGamePlaySuitableForCurrentPhase(game: CreateGameDto | Game, gamePlay: GamePlay): boolean {
    if (isGameSourceRole(gamePlay.source)) {
      return this.isRoleGamePlaySuitableForCurrentPhase(game, gamePlay);
    } else if (isGameSourceGroup(gamePlay.source)) {
      return this.isGroupGamePlaySuitableForCurrentPhase(game, gamePlay);
    }
    return this.isSheriffGamePlaySuitableForCurrentPhase(game);
  }
}