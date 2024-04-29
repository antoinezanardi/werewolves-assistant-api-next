import { Injectable } from "@nestjs/common";
import type { Types } from "mongoose";

import { createGamePlayHunterShoots, createGamePlayScapegoatBansVoting, createGamePlaySheriffDelegates, createGamePlaySurvivorsBuryDeadBodies } from "@/modules/game/helpers/game-play/game-play.factory";
import { createGame } from "@/modules/game/helpers/game.factory";
import { doesGameHaveUpcomingPlaySourceAndAction, getAliveVillagerSidedPlayers, getNearestAliveNeighbor, getPlayerWithCurrentRole, getPlayerWithIdOrThrow } from "@/modules/game/helpers/game.helpers";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, prependUpcomingPlayInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutators";
import { createCantVoteBySurvivorsPlayerAttribute, createContaminatedByRustySwordKnightPlayerAttribute, createPowerlessByActorPlayerAttribute, createPowerlessByElderPlayerAttribute, createPowerlessByWerewolvesPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { canPlayerDelegateSheriffAttribute, doesPlayerHaveActiveAttributeWithName, doesPlayerHaveActiveAttributeWithNameAndSource } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { createPlayerBrokenHeartByCupidDeath, createPlayerDeath, createPlayerReconsiderPardonBySurvivorsDeath } from "@/modules/game/helpers/player/player-death/player-death.factory";
import { createDeadPlayer, createPlayer } from "@/modules/game/helpers/player/player.factory";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helpers";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { PlayerDeathCause } from "@/modules/game/types/player/player-death/player-death.types";
import { RoleName } from "@/modules/role/types/role.types";

import { createCantFindPlayerWithIdUnexpectedException, createPlayerIsDeadUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class PlayerKillerService {
  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public async killOrRevealPlayer(playerId: Types.ObjectId, game: Game, death: PlayerDeath): Promise<Game> {
    const clonedGame = createGame(game);
    const playerToKill = this.getPlayerToKillOrRevealInGame(playerId, clonedGame);
    if (await this.isPlayerKillable(playerToKill, clonedGame, death.cause)) {
      return this.killPlayer(playerToKill, clonedGame, death);
    }
    if (this.doesPlayerRoleMustBeRevealed(playerToKill, death, game)) {
      return this.revealPlayerRole(playerToKill, clonedGame);
    }
    return clonedGame;
  }

  public async isElderKillable(game: Game, elderPlayer: Player, cause: PlayerDeathCause): Promise<boolean> {
    if (cause !== "eaten") {
      return true;
    }
    const elderLivesCountAgainstWerewolves = await this.getElderLivesCountAgainstWerewolves(game, elderPlayer);

    return elderLivesCountAgainstWerewolves <= 0;
  }

  public applyPlayerDeathOutcomes(deadPlayer: DeadPlayer, game: Game): Game {
    let clonedGame = createGame(game);
    let clonedDeadPlayer = createDeadPlayer(deadPlayer);
    const cantFindPlayerException = createCantFindPlayerWithIdUnexpectedException("applyPlayerDeathOutcomes", { gameId: game._id, playerId: deadPlayer._id });
    clonedGame = this.applyPlayerRoleDeathOutcomes(clonedDeadPlayer, clonedGame);
    clonedDeadPlayer = getPlayerWithIdOrThrow(clonedDeadPlayer._id, clonedGame, cantFindPlayerException) as DeadPlayer;
    clonedGame = this.applyPlayerSideDeathOutcomes(clonedDeadPlayer, clonedGame);
    clonedDeadPlayer = getPlayerWithIdOrThrow(clonedDeadPlayer._id, clonedGame, cantFindPlayerException) as DeadPlayer;
    clonedGame = this.applyPlayerAttributesDeathOutcomes(clonedDeadPlayer, clonedGame);

    return updatePlayerInGame(clonedDeadPlayer._id, this.removePlayerAttributesAfterDeath(clonedDeadPlayer), clonedGame);
  }

  public revealPlayerRole(playerToReveal: Player, game: Game): Game {
    let clonedGame = createGame(game);
    let clonedPlayerToReveal = createPlayer(playerToReveal);
    const cantFindPlayerException = createCantFindPlayerWithIdUnexpectedException("revealPlayerRole", { gameId: game._id, playerId: playerToReveal._id });
    clonedPlayerToReveal.role.isRevealed = true;
    clonedGame = updatePlayerInGame(playerToReveal._id, clonedPlayerToReveal, clonedGame);
    clonedPlayerToReveal = getPlayerWithIdOrThrow(playerToReveal._id, clonedGame, cantFindPlayerException);

    return this.applyPlayerRoleRevelationOutcomes(clonedPlayerToReveal, clonedGame);
  }

  private async getElderLivesCountAgainstWerewolves(game: Game, elderPlayer: Player): Promise<number> {
    const { livesCountAgainstWerewolves } = game.options.roles.elder;
    const werewolvesEatElderRecords = await this.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords(game._id, elderPlayer._id);
    const werewolvesEatElderOnPreviousTurnsRecords = werewolvesEatElderRecords.filter(({ turn }) => turn < game.turn);
    const elderProtectedFromWerewolvesRecords = await this.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords(game._id, elderPlayer._id);
    const doesElderLooseALifeOnCurrentTurn = doesPlayerHaveActiveAttributeWithName(elderPlayer, "eaten", game) && this.canPlayerBeEaten(elderPlayer, game);

    return werewolvesEatElderOnPreviousTurnsRecords.reduce((acc, werewolvesEatElderRecord) => {
      const wasElderProtectedFromWerewolves = !!elderProtectedFromWerewolvesRecords.find(({ turn }) => turn === werewolvesEatElderRecord.turn);
      if (!wasElderProtectedFromWerewolves) {
        return acc - 1;
      }
      return acc;
    }, doesElderLooseALifeOnCurrentTurn ? livesCountAgainstWerewolves - 1 : livesCountAgainstWerewolves);
  }

  private applyPlayerRoleRevelationOutcomes(revealedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    if (revealedPlayer.role.current === "idiot") {
      return addPlayerAttributeInGame(revealedPlayer._id, clonedGame, createCantVoteBySurvivorsPlayerAttribute());
    }
    return clonedGame;
  }

  private doesPlayerRoleMustBeRevealed(playerToReveal: Player, death: PlayerDeath, game: Game): boolean {
    const doesIdiotRoleMustBeRevealed = isPlayerPowerful(playerToReveal, game) && death.cause === "vote";

    return !playerToReveal.role.isRevealed && (!playerToReveal.isAlive && game.options.roles.areRevealedOnDeath ||
      playerToReveal.role.current === "idiot" && doesIdiotRoleMustBeRevealed);
  }

  private removePlayerAttributesAfterDeath(player: Player): Player {
    const clonedPlayer = createPlayer(player);
    clonedPlayer.attributes = clonedPlayer.attributes.filter(({ doesRemainAfterDeath }) => doesRemainAfterDeath === true);

    return clonedPlayer;
  }

  private isIdiotKillable(idiotPlayer: Player, deathCause: PlayerDeathCause, game: Game): boolean {
    const isIdiotPowerless = !isPlayerPowerful(idiotPlayer, game);

    return idiotPlayer.role.isRevealed || deathCause !== "vote" || isIdiotPowerless;
  }

  private canPlayerBeEaten(eatenPlayer: Player, game: Game): boolean {
    const { isProtectedByDefender: isLittleGirlProtectedByDefender } = game.options.roles.littleGirl;
    const isPlayerSavedByWitch = doesPlayerHaveActiveAttributeWithName(eatenPlayer, "drank-life-potion", game);
    const isPlayerProtectedByDefender = doesPlayerHaveActiveAttributeWithName(eatenPlayer, "protected", game);

    return !isPlayerSavedByWitch && (!isPlayerProtectedByDefender || eatenPlayer.role.current === "little-girl" && !isLittleGirlProtectedByDefender);
  }

  private async isPlayerKillable(player: Player, game: Game, cause: PlayerDeathCause): Promise<boolean> {
    if (cause === "eaten" && !this.canPlayerBeEaten(player, game)) {
      return false;
    }
    if (player.role.current === "idiot") {
      return this.isIdiotKillable(player, cause, game);
    }
    if (player.role.current === "elder") {
      return this.isElderKillable(game, player, cause);
    }
    return true;
  }

  private applyWorshipedPlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const { roles } = clonedGame.options;
    const wildChildPlayer = getPlayerWithCurrentRole(clonedGame, "wild-child");
    if (!doesPlayerHaveActiveAttributeWithName(killedPlayer, "worshiped", clonedGame) ||
      wildChildPlayer === undefined || !isPlayerAliveAndPowerful(wildChildPlayer, clonedGame)) {
      return clonedGame;
    }
    wildChildPlayer.side.current = "werewolves";
    if (wildChildPlayer.role.original === "actor" && roles.actor.isPowerlessOnWerewolvesSide) {
      wildChildPlayer.attributes.push(createPowerlessByActorPlayerAttribute());
    }
    return updatePlayerInGame(wildChildPlayer._id, wildChildPlayer, clonedGame);
  }

  private applyInLovePlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const otherLoverFinder = (player: Player): boolean => doesPlayerHaveActiveAttributeWithName(player, "in-love", game) &&
      player.isAlive && !player._id.equals(killedPlayer._id);
    const otherPlayerInLove = clonedGame.players.find(otherLoverFinder);
    if (!doesPlayerHaveActiveAttributeWithName(killedPlayer, "in-love", clonedGame) || !otherPlayerInLove) {
      return clonedGame;
    }
    return this.killPlayer(otherPlayerInLove, clonedGame, createPlayerBrokenHeartByCupidDeath());
  }

  private applySheriffPlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    if (!canPlayerDelegateSheriffAttribute(killedPlayer, clonedGame)) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlaySheriffDelegates(), clonedGame);
  }

  private applyPlayerAttributesDeathOutcomes(killedPlayer: Player, game: Game): Game {
    let clonedGame = createGame(game);
    let clonedKilledPlayer = createPlayer(killedPlayer);
    const cantFindPlayerException = createCantFindPlayerWithIdUnexpectedException("applyPlayerAttributesDeathOutcomes", { gameId: game._id, playerId: killedPlayer._id });
    if (doesPlayerHaveActiveAttributeWithName(killedPlayer, "sheriff", clonedGame)) {
      clonedGame = this.applySheriffPlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
      clonedKilledPlayer = getPlayerWithIdOrThrow(clonedKilledPlayer._id, clonedGame, cantFindPlayerException);
    }
    if (doesPlayerHaveActiveAttributeWithName(killedPlayer, "in-love", clonedGame)) {
      clonedGame = this.applyInLovePlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
      clonedKilledPlayer = getPlayerWithIdOrThrow(clonedKilledPlayer._id, clonedGame, cantFindPlayerException);
    }
    if (doesPlayerHaveActiveAttributeWithName(clonedKilledPlayer, "worshiped", clonedGame)) {
      clonedGame = this.applyWorshipedPlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
    }
    return clonedGame;
  }

  private applyPlayerSideDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const bigBadWolfPlayer = getPlayerWithCurrentRole(clonedGame, "big-bad-wolf");
    const { isPowerlessIfWerewolfDies } = game.options.roles.bigBadWolf;
    if (killedPlayer.side.current !== "werewolves" || !bigBadWolfPlayer ||
      !isPowerlessIfWerewolfDies || killedPlayer.role.current === "big-bad-wolf" ||
      doesPlayerHaveActiveAttributeWithNameAndSource(bigBadWolfPlayer, "powerless", "werewolves", clonedGame)) {
      return clonedGame;
    }
    return addPlayerAttributeInGame(bigBadWolfPlayer._id, clonedGame, createPowerlessByWerewolvesPlayerAttribute());
  }

  private applyRustySwordKnightDeathOutcomes(killedPlayer: DeadPlayer, game: Game): Game {
    const clonedGame = createGame(game);
    const { death } = killedPlayer;
    const leftAliveWerewolfNeighbor = getNearestAliveNeighbor(killedPlayer._id, clonedGame, { direction: "left", playerSide: "werewolves" });
    if (killedPlayer.role.current !== "rusty-sword-knight" || !isPlayerPowerful(killedPlayer, clonedGame) ||
      death.cause !== "eaten" || !leftAliveWerewolfNeighbor) {
      return clonedGame;
    }
    return addPlayerAttributeInGame(leftAliveWerewolfNeighbor._id, clonedGame, createContaminatedByRustySwordKnightPlayerAttribute());
  }

  private applyScapegoatDeathOutcomes(killedPlayer: DeadPlayer, game: Game): Game {
    const clonedGame = createGame(game);
    const { death } = killedPlayer;
    if (killedPlayer.role.current !== "scapegoat" || !isPlayerPowerful(killedPlayer, clonedGame) || death.cause !== "vote-scapegoated") {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlayScapegoatBansVoting(), clonedGame);
  }

  private applyElderDeathOutcomes(killedPlayer: DeadPlayer, game: Game): Game {
    let clonedGame = createGame(game);
    const { death } = killedPlayer;
    const elderRevengeDeathCauses: PlayerDeathCause[] = ["vote", "shot", "death-potion"];
    const { idiot: idiotOptions, elder: elderOptions } = clonedGame.options.roles;
    if (killedPlayer.role.current !== "elder" || !isPlayerPowerful(killedPlayer, game)) {
      return clonedGame;
    }
    if (elderRevengeDeathCauses.includes(death.cause) && elderOptions.doesTakeHisRevenge) {
      const aliveVillagerSidedPlayersIds = getAliveVillagerSidedPlayers(clonedGame).map(({ _id }) => _id);
      clonedGame = addPlayersAttributeInGame(aliveVillagerSidedPlayersIds, clonedGame, createPowerlessByElderPlayerAttribute());
    }
    const idiotPlayer = getPlayerWithCurrentRole(clonedGame, "idiot");
    if (idiotPlayer?.isAlive === true && idiotPlayer.role.isRevealed && idiotOptions.doesDieOnElderDeath) {
      return this.killPlayer(idiotPlayer, clonedGame, createPlayerReconsiderPardonBySurvivorsDeath());
    }
    return clonedGame;
  }

  private applyHunterDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    if (killedPlayer.role.current !== "hunter" || !isPlayerPowerful(killedPlayer, game)) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlayHunterShoots(), clonedGame);
  }

  private applyPlayerRoleDeathOutcomes(killedPlayer: DeadPlayer, game: Game): Game {
    const clonedGame = createGame(game);
    const roleDeathOutcomesMethods: Partial<Record<RoleName, (killedPlayer: DeadPlayer, game: Game) => Game>> = {
      "hunter": () => this.applyHunterDeathOutcomes(killedPlayer, clonedGame),
      "elder": () => this.applyElderDeathOutcomes(killedPlayer, clonedGame),
      "scapegoat": () => this.applyScapegoatDeathOutcomes(killedPlayer, clonedGame),
      "rusty-sword-knight": () => this.applyRustySwordKnightDeathOutcomes(killedPlayer, clonedGame),
    };
    const roleDeathOutcomesMethod = roleDeathOutcomesMethods[killedPlayer.role.current];
    if (roleDeathOutcomesMethod) {
      return roleDeathOutcomesMethod(killedPlayer, clonedGame);
    }
    return clonedGame;
  }

  private killPlayer(playerToKill: Player, game: Game, death: PlayerDeath): Game {
    let clonedGame = createGame(game);
    const clonedPlayerToKill = createPlayer(playerToKill);
    clonedPlayerToKill.isAlive = false;
    clonedPlayerToKill.death = createPlayerDeath(death);
    clonedGame = updatePlayerInGame(clonedPlayerToKill._id, clonedPlayerToKill, clonedGame);
    if (!doesGameHaveUpcomingPlaySourceAndAction(clonedGame, "survivors", "bury-dead-bodies")) {
      clonedGame = prependUpcomingPlayInGame(createGamePlaySurvivorsBuryDeadBodies(), clonedGame);
    }
    return clonedGame;
  }

  private getPlayerToKillOrRevealInGame(playerId: Types.ObjectId, game: Game): Player {
    const exceptionInterpolations = { gameId: game._id, playerId };
    const playerToKill = getPlayerWithIdOrThrow(playerId, game, createCantFindPlayerWithIdUnexpectedException("getPlayerToKillOrRevealInGame", exceptionInterpolations));
    if (!playerToKill.isAlive) {
      throw createPlayerIsDeadUnexpectedException("getPlayerToKillOrRevealInGame", exceptionInterpolations);
    }
    return playerToKill;
  }
}