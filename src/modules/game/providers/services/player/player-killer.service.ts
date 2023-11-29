import { Injectable } from "@nestjs/common";
import type { Types } from "mongoose";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerDeathCauses, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlayHunterShoots, createGamePlayScapegoatBansVoting, createGamePlaySheriffDelegates, createGamePlaySurvivorsBuryDeadBodies } from "@/modules/game/helpers/game-play/game-play.factory";
import { createGame } from "@/modules/game/helpers/game.factory";
import { doesGameHaveCurrentOrUpcomingPlaySourceAndAction, getAliveVillagerSidedPlayers, getNearestAliveNeighbor, getPlayerWithCurrentRole, getPlayerWithIdOrThrow } from "@/modules/game/helpers/game.helper";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, prependUpcomingPlayInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutator";
import { createCantVoteBySurvivorsPlayerAttribute, createContaminatedByRustySwordKnightPlayerAttribute, createPowerlessByElderPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createPlayerBrokenHeartByCupidDeath, createPlayerDeath, createPlayerReconsiderPardonBySurvivorsDeath } from "@/modules/game/helpers/player/player-death/player-death.factory";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createCantFindPlayerUnexpectedException, createPlayerIsDeadUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class PlayerKillerService {
  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}
  
  public async killOrRevealPlayer(playerId: Types.ObjectId, game: Game, death: PlayerDeath): Promise<Game> {
    let clonedGame = createGame(game);
    let playerToKill = this.getPlayerToKillInGame(playerId, clonedGame);
    if (await this.isPlayerKillable(playerToKill, clonedGame, death.cause)) {
      clonedGame = this.killPlayer(playerToKill, clonedGame, death);
    }
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("killOrRevealPlayer", { gameId: game._id, playerId: playerToKill._id });
    playerToKill = getPlayerWithIdOrThrow(playerToKill._id, clonedGame, cantFindPlayerException);
    if (this.doesPlayerRoleMustBeRevealed(playerToKill, death, game)) {
      return this.revealPlayerRole(playerToKill, clonedGame);
    }
    return clonedGame;
  }

  public async isElderKillable(game: Game, elderPlayer: Player, cause: PlayerDeathCauses): Promise<boolean> {
    if (cause !== PlayerDeathCauses.EATEN) {
      return true;
    }
    const elderLivesCountAgainstWerewolves = await this.getElderLivesCountAgainstWerewolves(game, elderPlayer);
    return elderLivesCountAgainstWerewolves <= 0;
  }

  public async getElderLivesCountAgainstWerewolves(game: Game, elderPlayer: Player): Promise<number> {
    const { livesCountAgainstWerewolves } = game.options.roles.elder;
    const werewolvesEatElderRecords = await this.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords(game._id);
    const werewolvesEatElderOnPreviousTurnsRecords = werewolvesEatElderRecords.filter(({ turn }) => turn < game.turn);
    const elderProtectedFromWerewolvesRecords = await this.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords(game._id);
    const doesElderLooseALifeOnCurrentTurn = doesPlayerHaveActiveAttributeWithName(elderPlayer, PlayerAttributeNames.EATEN, game) && this.canPlayerBeEaten(elderPlayer, game);
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
    if (revealedPlayer.role.current === RoleNames.IDIOT) {
      return addPlayerAttributeInGame(revealedPlayer._id, clonedGame, createCantVoteBySurvivorsPlayerAttribute());
    }
    return clonedGame;
  }

  private revealPlayerRole(playerToReveal: Player, game: Game): Game {
    let clonedGame = createGame(game);
    let clonedPlayerToReveal = createPlayer(playerToReveal);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("revealPlayerRole", { gameId: game._id, playerId: playerToReveal._id });
    clonedPlayerToReveal.role.isRevealed = true;
    clonedGame = updatePlayerInGame(playerToReveal._id, clonedPlayerToReveal, clonedGame);
    clonedPlayerToReveal = getPlayerWithIdOrThrow(playerToReveal._id, clonedGame, cantFindPlayerException);
    return this.applyPlayerRoleRevelationOutcomes(clonedPlayerToReveal, clonedGame);
  }

  private doesPlayerRoleMustBeRevealed(playerToReveal: Player, death: PlayerDeath, game: Game): boolean {
    const doesIdiotRoleMustBeRevealed = isPlayerPowerful(playerToReveal, game) && death.cause === PlayerDeathCauses.VOTE;
    return !playerToReveal.role.isRevealed && (!playerToReveal.isAlive && game.options.roles.areRevealedOnDeath ||
      playerToReveal.role.current === RoleNames.IDIOT && doesIdiotRoleMustBeRevealed);
  }

  private removePlayerAttributesAfterDeath(player: Player): Player {
    const clonedPlayer = createPlayer(player);
    clonedPlayer.attributes = clonedPlayer.attributes.filter(({ doesRemainAfterDeath }) => doesRemainAfterDeath === true);
    return clonedPlayer;
  }

  private isIdiotKillable(idiotPlayer: Player, cause: PlayerDeathCauses, game: Game): boolean {
    const isIdiotPowerless = !isPlayerPowerful(idiotPlayer, game);
    return idiotPlayer.role.isRevealed || cause !== PlayerDeathCauses.VOTE || isIdiotPowerless;
  }

  private canPlayerBeEaten(eatenPlayer: Player, game: Game): boolean {
    const { isProtectedByGuard: isLittleGirlProtectedByGuard } = game.options.roles.littleGirl;
    const isPlayerSavedByWitch = doesPlayerHaveActiveAttributeWithName(eatenPlayer, PlayerAttributeNames.DRANK_LIFE_POTION, game);
    const isPlayerProtectedByGuard = doesPlayerHaveActiveAttributeWithName(eatenPlayer, PlayerAttributeNames.PROTECTED, game);
    return !isPlayerSavedByWitch && (!isPlayerProtectedByGuard || eatenPlayer.role.current === RoleNames.LITTLE_GIRL && !isLittleGirlProtectedByGuard);
  }

  private async isPlayerKillable(player: Player, game: Game, cause: PlayerDeathCauses): Promise<boolean> {
    if (cause === PlayerDeathCauses.EATEN && !this.canPlayerBeEaten(player, game)) {
      return false;
    }
    if (player.role.current === RoleNames.IDIOT) {
      return this.isIdiotKillable(player, cause, game);
    }
    if (player.role.current === RoleNames.ELDER) {
      return this.isElderKillable(game, player, cause);
    }
    return true;
  }

  private applyWorshipedPlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const wildChildPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.WILD_CHILD);
    if (!doesPlayerHaveActiveAttributeWithName(killedPlayer, PlayerAttributeNames.WORSHIPED, clonedGame) ||
      wildChildPlayer === undefined || !wildChildPlayer.isAlive || !isPlayerPowerful(wildChildPlayer, clonedGame)) {
      return clonedGame;
    }
    wildChildPlayer.side.current = RoleSides.WEREWOLVES;
    return updatePlayerInGame(wildChildPlayer._id, wildChildPlayer, clonedGame);
  }

  private applyInLovePlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const otherLoverFinder = (player: Player): boolean => doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game) &&
      player.isAlive && !player._id.equals(killedPlayer._id);
    const otherPlayerInLove = clonedGame.players.find(otherLoverFinder);
    if (!doesPlayerHaveActiveAttributeWithName(killedPlayer, PlayerAttributeNames.IN_LOVE, clonedGame) || !otherPlayerInLove) {
      return clonedGame;
    }
    return this.killPlayer(otherPlayerInLove, clonedGame, createPlayerBrokenHeartByCupidDeath());
  }

  private applySheriffPlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    if (!doesPlayerHaveActiveAttributeWithName(killedPlayer, PlayerAttributeNames.SHERIFF, game) ||
      killedPlayer.role.current === RoleNames.IDIOT && isPlayerPowerful(killedPlayer, clonedGame)) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlaySheriffDelegates(), clonedGame);
  }

  private applyPlayerAttributesDeathOutcomes(killedPlayer: Player, game: Game): Game {
    let clonedGame = createGame(game);
    let clonedKilledPlayer = createPlayer(killedPlayer);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("applyPlayerAttributesDeathOutcomes", { gameId: game._id, playerId: killedPlayer._id });
    if (doesPlayerHaveActiveAttributeWithName(killedPlayer, PlayerAttributeNames.SHERIFF, clonedGame)) {
      clonedGame = this.applySheriffPlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
      clonedKilledPlayer = getPlayerWithIdOrThrow(clonedKilledPlayer._id, clonedGame, cantFindPlayerException);
    }
    if (doesPlayerHaveActiveAttributeWithName(killedPlayer, PlayerAttributeNames.IN_LOVE, clonedGame)) {
      clonedGame = this.applyInLovePlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
      clonedKilledPlayer = getPlayerWithIdOrThrow(clonedKilledPlayer._id, clonedGame, cantFindPlayerException);
    }
    if (doesPlayerHaveActiveAttributeWithName(clonedKilledPlayer, PlayerAttributeNames.WORSHIPED, clonedGame)) {
      clonedGame = this.applyWorshipedPlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
    }
    return clonedGame;
  }

  private applyRustySwordKnightDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    const clonedGame = createGame(game);
    const leftAliveWerewolfNeighbor = getNearestAliveNeighbor(killedPlayer._id, clonedGame, { direction: "left", playerSide: RoleSides.WEREWOLVES });
    if (killedPlayer.role.current !== RoleNames.RUSTY_SWORD_KNIGHT || !isPlayerPowerful(killedPlayer, clonedGame) ||
      death.cause !== PlayerDeathCauses.EATEN || !leftAliveWerewolfNeighbor) {
      return clonedGame;
    }
    return addPlayerAttributeInGame(leftAliveWerewolfNeighbor._id, clonedGame, createContaminatedByRustySwordKnightPlayerAttribute());
  }

  private applyScapegoatDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    const clonedGame = createGame(game);
    if (killedPlayer.role.current !== RoleNames.SCAPEGOAT || !isPlayerPowerful(killedPlayer, clonedGame) || death.cause !== PlayerDeathCauses.VOTE_SCAPEGOATED) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlayScapegoatBansVoting(), clonedGame);
  }

  private applyElderDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    let clonedGame = createGame(game);
    const elderRevengeDeathCauses: PlayerDeathCauses[] = [PlayerDeathCauses.VOTE, PlayerDeathCauses.SHOT, PlayerDeathCauses.DEATH_POTION];
    const { idiot: idiotOptions, elder: elderOptions } = clonedGame.options.roles;
    if (killedPlayer.role.current !== RoleNames.ELDER || !isPlayerPowerful(killedPlayer, game)) {
      return clonedGame;
    }
    if (elderRevengeDeathCauses.includes(death.cause) && elderOptions.doesTakeHisRevenge) {
      const aliveVillagerSidedPlayersIds = getAliveVillagerSidedPlayers(clonedGame).map(({ _id }) => _id);
      clonedGame = addPlayersAttributeInGame(aliveVillagerSidedPlayersIds, clonedGame, createPowerlessByElderPlayerAttribute());
    }
    const idiotPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.IDIOT);
    if (idiotPlayer?.isAlive === true && idiotPlayer.role.isRevealed && idiotOptions.doesDieOnElderDeath) {
      return this.killPlayer(idiotPlayer, clonedGame, createPlayerReconsiderPardonBySurvivorsDeath());
    }
    return clonedGame;
  }

  private applyHunterDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    if (killedPlayer.role.current !== RoleNames.HUNTER || !isPlayerPowerful(killedPlayer, game)) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlayHunterShoots(), clonedGame);
  }

  private applyPlayerRoleDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    const clonedGame = createGame(game);
    if (killedPlayer.role.current === RoleNames.HUNTER) {
      return this.applyHunterDeathOutcomes(killedPlayer, clonedGame);
    }
    if (killedPlayer.role.current === RoleNames.ELDER) {
      return this.applyElderDeathOutcomes(killedPlayer, clonedGame, death);
    }
    if (killedPlayer.role.current === RoleNames.SCAPEGOAT) {
      return this.applyScapegoatDeathOutcomes(killedPlayer, clonedGame, death);
    }
    if (killedPlayer.role.current === RoleNames.RUSTY_SWORD_KNIGHT) {
      return this.applyRustySwordKnightDeathOutcomes(killedPlayer, clonedGame, death);
    }
    return clonedGame;
  }

  private applyPlayerDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    let clonedGame = createGame(game);
    let clonedPlayerToKill = createPlayer(killedPlayer);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("applyPlayerDeathOutcomes", { gameId: game._id, playerId: killedPlayer._id });
    clonedGame = this.applyPlayerRoleDeathOutcomes(clonedPlayerToKill, clonedGame, death);
    clonedPlayerToKill = getPlayerWithIdOrThrow(clonedPlayerToKill._id, clonedGame, cantFindPlayerException);
    clonedGame = this.applyPlayerAttributesDeathOutcomes(clonedPlayerToKill, clonedGame);
    if (!doesGameHaveCurrentOrUpcomingPlaySourceAndAction(clonedGame, PlayerGroups.SURVIVORS, GamePlayActions.BURY_DEAD_BODIES)) {
      clonedGame = prependUpcomingPlayInGame(createGamePlaySurvivorsBuryDeadBodies(), clonedGame);
    }
    return clonedGame;
  }

  private killPlayer(playerToKill: Player, game: Game, death: PlayerDeath): Game {
    let clonedGame = createGame(game);
    let clonedPlayerToKill = createPlayer(playerToKill);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("killPlayer", { gameId: game._id, playerId: playerToKill._id });
    clonedPlayerToKill.isAlive = false;
    clonedPlayerToKill.death = createPlayerDeath(death);
    clonedGame = updatePlayerInGame(clonedPlayerToKill._id, clonedPlayerToKill, clonedGame);
    clonedPlayerToKill = getPlayerWithIdOrThrow(clonedPlayerToKill._id, clonedGame, cantFindPlayerException);
    clonedGame = this.applyPlayerDeathOutcomes(clonedPlayerToKill, clonedGame, death);
    clonedPlayerToKill = getPlayerWithIdOrThrow(clonedPlayerToKill._id, clonedGame, cantFindPlayerException);
    return updatePlayerInGame(clonedPlayerToKill._id, this.removePlayerAttributesAfterDeath(clonedPlayerToKill), clonedGame);
  }

  private getPlayerToKillInGame(playerId: Types.ObjectId, game: Game): Player {
    const exceptionInterpolations = { gameId: game._id, playerId };
    const playerToKill = getPlayerWithIdOrThrow(playerId, game, createCantFindPlayerUnexpectedException("getPlayerToKillInGame", exceptionInterpolations));
    if (!playerToKill.isAlive) {
      throw createPlayerIsDeadUnexpectedException("getPlayerToKillInGame", exceptionInterpolations);
    }
    return playerToKill;
  }
}