import { isInNightOrTwilightPhase } from "@/modules/game/helpers/game-phase/game-phase.helpers";
import { Injectable } from "@nestjs/common";

import { createAngelGameVictory, createLoversGameVictory, createNoneGameVictory, createPiedPiperGameVictory, createPrejudicedManipulatorGameVictory, createVillagersGameVictory, createWerewolvesGameVictory, createWhiteWerewolfGameVictory } from "@/modules/game/helpers/game-victory/game-victory.factory";
import { areAllPlayersDead, doesGameHaveCurrentOrUpcomingPlaySourceAndAction, getEligiblePiedPiperTargets, getPlayersWithActiveAttributeName, getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helpers";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helpers";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import type { Game } from "@/modules/game/schemas/game.schema";

import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GameVictoryService {
  public isGameOver(game: Game): boolean {
    const { currentPlay } = game;
    if (!currentPlay) {
      throw createNoCurrentGamePlayUnexpectedException("isGameOver", { gameId: game._id });
    }
    const isHunterShootPlayIncoming = doesGameHaveCurrentOrUpcomingPlaySourceAndAction(game, "hunter", "shoot");
    const isSurvivorsBuryDeadBodiesPlayIncoming = doesGameHaveCurrentOrUpcomingPlaySourceAndAction(game, "survivors", "bury-dead-bodies");
    const gameVictoryData = this.generateGameVictoryData(game);

    return areAllPlayersDead(game) || !isHunterShootPlayIncoming && !isSurvivorsBuryDeadBodiesPlayIncoming && !!gameVictoryData;
  }

  public generateGameVictoryData(game: Game): GameVictory | undefined {
    if (areAllPlayersDead(game)) {
      return createNoneGameVictory();
    }
    const victoryWinConditions: { doesWin: boolean; victoryFactoryMethod: (game: Game) => GameVictory }[] = [
      { doesWin: this.doesAngelWin(game), victoryFactoryMethod: createAngelGameVictory },
      { doesWin: this.doLoversWin(game), victoryFactoryMethod: createLoversGameVictory },
      { doesWin: this.doesPiedPiperWin(game), victoryFactoryMethod: createPiedPiperGameVictory },
      { doesWin: this.doesWhiteWerewolfWin(game), victoryFactoryMethod: createWhiteWerewolfGameVictory },
      { doesWin: this.doesPrejudicedManipulatorWin(game), victoryFactoryMethod: createPrejudicedManipulatorGameVictory },
      { doesWin: this.doWerewolvesWin(game), victoryFactoryMethod: createWerewolvesGameVictory },
      { doesWin: this.doVillagersWin(game), victoryFactoryMethod: createVillagersGameVictory },
    ];
    const victoryCondition = victoryWinConditions.find(({ doesWin }) => doesWin);

    return victoryCondition?.victoryFactoryMethod(game);
  }

  private doWerewolvesWin(game: Game): boolean {
    const werewolvesSidedPlayers = getPlayersWithCurrentSide(game, "werewolves");

    return werewolvesSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === "villagers" && isAlive);
  }

  private doVillagersWin(game: Game): boolean {
    const villagersSidedPlayers = getPlayersWithCurrentSide(game, "villagers");

    return villagersSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === "werewolves" && isAlive);
  }

  private doLoversWin(game: Game): boolean {
    const { mustWinWithLovers: mustCupidWinWithLovers } = game.options.roles.cupid;
    const lovers = getPlayersWithActiveAttributeName(game, "in-love");

    return lovers.length > 0 && game.players.every(player => {
      const isPlayerCupid = player.role.current === "cupid";
      const isPlayerInLove = doesPlayerHaveActiveAttributeWithName(player, "in-love", game);

      return isPlayerInLove && player.isAlive || !isPlayerInLove && !player.isAlive || isPlayerCupid && mustCupidWinWithLovers;
    });
  }

  private doesWhiteWerewolfWin(game: Game): boolean {
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, "white-werewolf");

    return !!whiteWerewolfPlayer && game.players.every(({ role, isAlive }) => role.current === "white-werewolf" && isAlive || role.current !== "white-werewolf" && !isAlive);
  }

  private doesPiedPiperWin(game: Game): boolean {
    const { isPowerlessOnWerewolvesSide } = game.options.roles.piedPiper;
    const piedPiperPlayer = getPlayerWithCurrentRole(game, "pied-piper");
    const leftToCharmPlayers = getEligiblePiedPiperTargets(game);

    return !!piedPiperPlayer && isPlayerAliveAndPowerful(piedPiperPlayer, game) && !leftToCharmPlayers.length &&
      (!isPowerlessOnWerewolvesSide || piedPiperPlayer.side.current === "villagers");
  }

  private doesAngelWin(game: Game): boolean {
    const angelPlayer = getPlayerWithCurrentRole(game, "angel");
    const { turn } = game;
    if (!angelPlayer?.death || angelPlayer.isAlive || !isPlayerPowerful(angelPlayer, game) || turn > 1) {
      return false;
    }
    const { cause: deathCause } = angelPlayer.death;

    return deathCause === "eaten" || deathCause === "vote" && isInNightOrTwilightPhase(game);
  }

  private doesPrejudicedManipulatorWin(game: Game): boolean {
    const prejudicedManipulatorPlayer = getPlayerWithCurrentRole(game, "prejudiced-manipulator");
    if (!prejudicedManipulatorPlayer || !isPlayerAliveAndPowerful(prejudicedManipulatorPlayer, game)) {
      return false;
    }
    const playersNotInPrejudicedManipulatorGroup = game.players.filter(({ group }) => group !== prejudicedManipulatorPlayer.group);

    return playersNotInPrejudicedManipulatorGroup.every(({ isAlive }) => !isAlive);
  }
}