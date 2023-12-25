import { Injectable } from "@nestjs/common";

import { createAngelGameVictory, createLoversGameVictory, createNoneGameVictory, createPiedPiperGameVictory, createPrejudicedManipulatorGameVictory, createVillagersGameVictory, createWerewolvesGameVictory, createWhiteWerewolfGameVictory } from "@/modules/game/helpers/game-victory/game-victory.factory";
import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerDeathCauses, PlayerGroups } from "@/modules/game/enums/player.enum";
import { areAllPlayersDead, doesGameHaveCurrentOrUpcomingPlaySourceAndAction, getEligiblePiedPiperTargets, getPlayersWithActiveAttributeName, getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GameVictoryService {
  public isGameOver(game: Game): boolean {
    const { currentPlay } = game;
    if (!currentPlay) {
      throw createNoCurrentGamePlayUnexpectedException("isGameOver", { gameId: game._id });
    }
    const isHunterShootPlayIncoming = doesGameHaveCurrentOrUpcomingPlaySourceAndAction(game, RoleNames.HUNTER, GamePlayActions.SHOOT);
    const isSurvivorsBuryDeadBodiesPlayIncoming = doesGameHaveCurrentOrUpcomingPlaySourceAndAction(game, PlayerGroups.SURVIVORS, GamePlayActions.BURY_DEAD_BODIES);
    const gameVictoryData = this.generateGameVictoryData(game);
    return areAllPlayersDead(game) || !isHunterShootPlayIncoming && !isSurvivorsBuryDeadBodiesPlayIncoming && !!gameVictoryData;
  }

  public generateGameVictoryData(game: Game): GameVictory | undefined {
    if (areAllPlayersDead(game)) {
      return createNoneGameVictory();
    }
    const victoryWinConditions: { winCondition: (game: Game) => boolean; victoryFactoryMethod: (game: Game) => GameVictory }[] = [
      { winCondition: this.doesAngelWin, victoryFactoryMethod: createAngelGameVictory },
      { winCondition: this.doLoversWin, victoryFactoryMethod: createLoversGameVictory },
      { winCondition: this.doesPiedPiperWin, victoryFactoryMethod: createPiedPiperGameVictory },
      { winCondition: this.doesWhiteWerewolfWin, victoryFactoryMethod: createWhiteWerewolfGameVictory },
      { winCondition: this.doesPrejudicedManipulatorWin, victoryFactoryMethod: createPrejudicedManipulatorGameVictory },
      { winCondition: this.doWerewolvesWin, victoryFactoryMethod: createWerewolvesGameVictory },
      { winCondition: this.doVillagersWin, victoryFactoryMethod: createVillagersGameVictory },
    ];
    const victoryCondition = victoryWinConditions.find(({ winCondition }) => winCondition(game));
    return victoryCondition?.victoryFactoryMethod(game);
  }

  private doWerewolvesWin(game: Game): boolean {
    const werewolvesSidedPlayers = getPlayersWithCurrentSide(game, RoleSides.WEREWOLVES);
    return werewolvesSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === RoleSides.VILLAGERS && isAlive);
  }

  private doVillagersWin(game: Game): boolean {
    const villagersSidedPlayers = getPlayersWithCurrentSide(game, RoleSides.VILLAGERS);
    return villagersSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === RoleSides.WEREWOLVES && isAlive);
  }

  private doLoversWin(game: Game): boolean {
    const { mustWinWithLovers: mustCupidWinWithLovers } = game.options.roles.cupid;
    const lovers = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.IN_LOVE);
    return lovers.length > 0 && game.players.every(player => {
      const isPlayerCupid = player.role.current === RoleNames.CUPID;
      const isPlayerInLove = doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game);
      return isPlayerInLove && player.isAlive || !isPlayerInLove && !player.isAlive || isPlayerCupid && mustCupidWinWithLovers;
    });
  }

  private doesWhiteWerewolfWin(game: Game): boolean {
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, RoleNames.WHITE_WEREWOLF);
    return !!whiteWerewolfPlayer && game.players.every(({ role, isAlive }) =>
      role.current === RoleNames.WHITE_WEREWOLF && isAlive || role.current !== RoleNames.WHITE_WEREWOLF && !isAlive);
  }

  private doesPiedPiperWin(game: Game): boolean {
    const { isPowerlessOnWerewolvesSide } = game.options.roles.piedPiper;
    const piedPiperPlayer = getPlayerWithCurrentRole(game, RoleNames.PIED_PIPER);
    const leftToCharmPlayers = getEligiblePiedPiperTargets(game);
    return !!piedPiperPlayer && isPlayerAliveAndPowerful(piedPiperPlayer, game) && !leftToCharmPlayers.length &&
      (!isPowerlessOnWerewolvesSide || piedPiperPlayer.side.current === RoleSides.VILLAGERS);
  }

  private doesAngelWin(game: Game): boolean {
    const angelPlayer = getPlayerWithCurrentRole(game, RoleNames.ANGEL);
    const { turn, phase } = game;
    if (!angelPlayer?.death || angelPlayer.isAlive || !isPlayerPowerful(angelPlayer, game) || turn > 1) {
      return false;
    }
    const { cause: deathCause } = angelPlayer.death;
    return deathCause === PlayerDeathCauses.EATEN || deathCause === PlayerDeathCauses.VOTE && phase === GamePhases.NIGHT;
  }

  private doesPrejudicedManipulatorWin(game: Game): boolean {
    const prejudicedManipulatorPlayer = getPlayerWithCurrentRole(game, RoleNames.PREJUDICED_MANIPULATOR);
    if (!prejudicedManipulatorPlayer || !isPlayerAliveAndPowerful(prejudicedManipulatorPlayer, game)) {
      return false;
    }
    const playersNotInPrejudicedManipulatorGroup = game.players.filter(({ group }) => group !== prejudicedManipulatorPlayer.group);
    return playersNotInPrejudicedManipulatorGroup.every(({ isAlive }) => !isAlive);
  }
}