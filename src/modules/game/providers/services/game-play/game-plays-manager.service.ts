import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { gamePlaysNightOrder } from "../../../constants/game.constant";
import { CreateGamePlayerDto } from "../../../dto/create-game/create-game-player/create-game-player.dto";
import { CreateGameDto } from "../../../dto/create-game/create-game.dto";
import type { GAME_PHASES } from "../../../enums/game.enum";
import { PLAYER_GROUPS } from "../../../enums/player.enum";
import { createGamePlayAllElectSheriff } from "../../../helpers/game-play/game-play.factory";
import { areAllWerewolvesAlive, getGroupOfPlayers, getPlayerDtoWithRole, getPlayersWithCurrentRole, getPlayerWithCurrentRole, isGameSourceGroup, isGameSourceRole } from "../../../helpers/game.helper";
import { canPiedPiperCharm, isPlayerAliveAndPowerful } from "../../../helpers/player/player.helper";
import type { SheriffGameOptions } from "../../../schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import { GamePlay } from "../../../schemas/game-play.schema";
import type { Game } from "../../../schemas/game.schema";
import type { GameSource } from "../../../types/game.type";

@Injectable()
export class GamePlaysManagerService {
  public getUpcomingNightPlays(game: CreateGameDto | Game): GamePlay[] {
    const isFirstNight = game.turn === 1;
    const eligibleNightPlays = gamePlaysNightOrder.filter(play => isFirstNight || play.isFirstNightOnly !== true);
    const isSheriffElectionTime = this.isSheriffElectionTime(game.options.roles.sheriff, game.turn, game.phase);
    const upcomingNightPlays: GamePlay[] = isSheriffElectionTime ? [createGamePlayAllElectSheriff()] : [];
    return plainToInstance(GamePlay, eligibleNightPlays.reduce((acc: GamePlay[], gamePlay) => {
      const { source, action } = gamePlay;
      return this.isSourcePlayableForNight(game, source) ? [...acc, { source, action }] : acc;
    }, upcomingNightPlays));
  }

  private isSheriffElectionTime(sheriffGameOptions: SheriffGameOptions, currentTurn: number, currentPhase: GAME_PHASES): boolean {
    const { electedAt, isEnabled } = sheriffGameOptions;
    return isEnabled && electedAt.turn === currentTurn && electedAt.phase === currentPhase;
  }

  private areLoversPlayableForNight(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.CUPID);
    }
    const cupidPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.CUPID);
    return !!cupidPlayer && isPlayerAliveAndPowerful(cupidPlayer);
  }

  private areAllPlayableForNight(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.ANGEL);
    }
    const angelPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.ANGEL);
    return !!angelPlayer && isPlayerAliveAndPowerful(angelPlayer);
  }

  private isGroupPlayableForNight(game: CreateGameDto | Game, source: PLAYER_GROUPS): boolean {
    const specificGroupMethods: Partial<Record<PLAYER_GROUPS, (game: CreateGameDto | Game) => boolean>> = {
      [PLAYER_GROUPS.ALL]: this.areAllPlayableForNight,
      [PLAYER_GROUPS.LOVERS]: this.areLoversPlayableForNight,
      [PLAYER_GROUPS.CHARMED]: this.isPiedPiperPlayableForNight,
    };
    if (specificGroupMethods[source] !== undefined) {
      return specificGroupMethods[source]?.(game) === true;
    } else if (game instanceof CreateGameDto) {
      return true;
    }
    const players = getGroupOfPlayers(game.players, source);
    return players.some(player => isPlayerAliveAndPowerful(player));
  }

  private isWhiteWerewolfPlayableForNight(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.whiteWerewolf;
    const shouldWhiteWerewolfBeCalled = wakingUpInterval > 0;
    if (game instanceof CreateGameDto) {
      return shouldWhiteWerewolfBeCalled && !!getPlayerDtoWithRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    }
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    return shouldWhiteWerewolfBeCalled && !!whiteWerewolfPlayer && isPlayerAliveAndPowerful(whiteWerewolfPlayer);
  }

  private isPiedPiperPlayableForNight(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.PIED_PIPER);
    }
    const { isPowerlessIfInfected } = game.options.roles.piedPiper;
    const piedPiperPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.PIED_PIPER);
    return !!piedPiperPlayer && canPiedPiperCharm(piedPiperPlayer, isPowerlessIfInfected);
  }

  private isBigBadWolfPlayableForNight(game: CreateGameDto | Game): boolean {
    if (game instanceof CreateGameDto) {
      return !!getPlayerDtoWithRole(game.players, ROLE_NAMES.BIG_BAD_WOLF);
    }
    const { isPowerlessIfWerewolfDies } = game.options.roles.bigBadWolf;
    const bigBadWolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.BIG_BAD_WOLF);
    return !!bigBadWolfPlayer && isPlayerAliveAndPowerful(bigBadWolfPlayer) && (!isPowerlessIfWerewolfDies || areAllWerewolvesAlive(game.players));
  }

  private areThreeBrothersPlayableForNight(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.threeBrothers;
    const shouldThreeBrothersBeCalled = wakingUpInterval > 0;
    if (game instanceof CreateGameDto) {
      return shouldThreeBrothersBeCalled && !!getPlayerDtoWithRole(game.players, ROLE_NAMES.THREE_BROTHERS);
    }
    const threeBrothersPlayers = getPlayersWithCurrentRole(game.players, ROLE_NAMES.THREE_BROTHERS);
    const minimumBrotherCountToCall = 2;
    return shouldThreeBrothersBeCalled && threeBrothersPlayers.filter(brother => brother.isAlive).length >= minimumBrotherCountToCall;
  }

  private areTwoSistersPlayableForNight(game: CreateGameDto | Game): boolean {
    const { wakingUpInterval } = game.options.roles.twoSisters;
    const shouldTwoSistersBeCalled = wakingUpInterval > 0;
    if (game instanceof CreateGameDto) {
      return shouldTwoSistersBeCalled && !!getPlayerDtoWithRole(game.players, ROLE_NAMES.TWO_SISTERS);
    }
    const twoSistersPlayers = getPlayersWithCurrentRole(game.players, ROLE_NAMES.TWO_SISTERS);
    return shouldTwoSistersBeCalled && twoSistersPlayers.length > 0 && twoSistersPlayers.every(sister => sister.isAlive);
  }

  private isRolePlayableForNight(game: CreateGameDto | Game, source: ROLE_NAMES): boolean {
    const player = game instanceof CreateGameDto ? getPlayerDtoWithRole(game.players, source) : getPlayerWithCurrentRole(game.players, source);
    if (!player) {
      return false;
    }
    const specificRoleMethods: Partial<Record<ROLE_NAMES, (game: CreateGameDto | Game) => boolean>> = {
      [ROLE_NAMES.TWO_SISTERS]: this.areTwoSistersPlayableForNight,
      [ROLE_NAMES.THREE_BROTHERS]: this.areThreeBrothersPlayableForNight,
      [ROLE_NAMES.BIG_BAD_WOLF]: this.isBigBadWolfPlayableForNight,
      [ROLE_NAMES.PIED_PIPER]: this.isPiedPiperPlayableForNight,
      [ROLE_NAMES.WHITE_WEREWOLF]: this.isWhiteWerewolfPlayableForNight,
    };
    if (specificRoleMethods[source] !== undefined) {
      return specificRoleMethods[source]?.(game) === true;
    }
    return player instanceof CreateGamePlayerDto || isPlayerAliveAndPowerful(player);
  }

  private isSourcePlayableForNight(game: CreateGameDto | Game, source: GameSource): boolean {
    if (isGameSourceRole(source)) {
      return this.isRolePlayableForNight(game, source);
    } else if (isGameSourceGroup(source)) {
      return this.isGroupPlayableForNight(game, source);
    }
    return false;
  }
}