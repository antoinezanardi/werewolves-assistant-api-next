import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import type { Types } from "mongoose";
import { createCantFindPlayerUnexpectedException, createPlayerIsDeadUnexpectedException } from "../../../../../shared/exception/helpers/unexpected-exception.factory";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../role/enums/role.enum";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES } from "../../../enums/player.enum";
import { createGamePlayHunterShoots, createGamePlayScapegoatBansVoting, createGamePlaySheriffDelegates } from "../../../helpers/game-play/game-play.factory";
import { getAliveVillagerSidedPlayers, getNearestAliveNeighbor, getPlayerWithCurrentRole, getPlayerWithIdOrThrow } from "../../../helpers/game.helper";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, prependUpcomingPlayInGame, updatePlayerInGame } from "../../../helpers/game.mutator";
import { createCantVoteByAllPlayerAttribute, createContaminatedByRustySwordKnightPlayerAttribute, createPowerlessByAncientPlayerAttribute } from "../../../helpers/player/player-attribute/player-attribute.factory";
import { createPlayerBrokenHeartByCupidDeath, createPlayerDeath, createPlayerReconsiderPardonByAllDeath } from "../../../helpers/player/player-death/player-death.factory";
import { doesPlayerHaveAttribute } from "../../../helpers/player/player.helper";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import type { PlayerDeath } from "../../../schemas/player/player-death.schema";
import type { Player } from "../../../schemas/player/player.schema";

@Injectable()
export class PlayerKillerService {
  public applyPlayerRoleRevelationOutcomes(revealedPlayer: Player, game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (revealedPlayer.role.current === ROLE_NAMES.IDIOT) {
      return addPlayerAttributeInGame(revealedPlayer._id, clonedGame, createCantVoteByAllPlayerAttribute());
    }
    return clonedGame;
  }

  public revealPlayerRole(playerToReveal: Player, game: Game): Game {
    let clonedGame = cloneDeep(game);
    let clonedPlayerToReveal = cloneDeep(playerToReveal);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("revealPlayerRole", { gameId: game._id, playerId: playerToReveal._id });
    clonedPlayerToReveal.role.isRevealed = true;
    clonedGame = updatePlayerInGame(playerToReveal._id, clonedPlayerToReveal, clonedGame);
    clonedPlayerToReveal = getPlayerWithIdOrThrow(playerToReveal._id, clonedGame, cantFindPlayerException);
    return this.applyPlayerRoleRevelationOutcomes(clonedPlayerToReveal, clonedGame);
  }

  public doesPlayerRoleMustBeRevealed(playerToReveal: Player, death: PlayerDeath): boolean {
    return !playerToReveal.role.isRevealed && playerToReveal.role.current === ROLE_NAMES.IDIOT && !doesPlayerHaveAttribute(playerToReveal, PLAYER_ATTRIBUTE_NAMES.POWERLESS) &&
      death.cause === PLAYER_DEATH_CAUSES.VOTE;
  }

  public getAncientLivesCountAgainstWerewolves(game: Game, gameHistoryRecords: GameHistoryRecord[]): number {
    const { livesCountAgainstWerewolves } = game.options.roles.ancient;
    const werewolvesEatAncientRecords = gameHistoryRecords.filter(({ play }) => {
      const { action, targets } = play;
      return action === GAME_PLAY_ACTIONS.EAT && targets?.find(({ player }) => player.role.current === ROLE_NAMES.ANCIENT);
    });
    const ancientProtectedFromWerewolvesRecords = gameHistoryRecords.filter(({ play }) => {
      const { action, targets } = play;
      const ancientTarget = targets?.find(({ player }) => player.role.current === ROLE_NAMES.ANCIENT);
      return action === GAME_PLAY_ACTIONS.PROTECT && ancientTarget || ancientTarget?.drankPotion === WITCH_POTIONS.LIFE;
    });
    return werewolvesEatAncientRecords.reduce((acc, werewolvesEatAncientRecord) => {
      const wasAncientProtectedFromWerewolves = !!ancientProtectedFromWerewolvesRecords.find(({ turn }) => turn === werewolvesEatAncientRecord.turn);
      if (!wasAncientProtectedFromWerewolves) {
        return acc - 1;
      }
      return acc;
    }, livesCountAgainstWerewolves);
  }

  public isAncientKillable(ancientPlayer: Player, game: Game, cause: PLAYER_DEATH_CAUSES, gameHistoryRecords: GameHistoryRecord[]): boolean {
    if (cause !== PLAYER_DEATH_CAUSES.EATEN) {
      return true;
    }
    const ancientLivesCountAgainstWerewolves = this.getAncientLivesCountAgainstWerewolves(game, gameHistoryRecords);
    return ancientLivesCountAgainstWerewolves - 1 <= 0;
  }

  public isIdiotKillable(idiotPlayer: Player, cause: PLAYER_DEATH_CAUSES): boolean {
    const isIdiotPowerless = doesPlayerHaveAttribute(idiotPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS);
    return idiotPlayer.role.isRevealed || cause !== PLAYER_DEATH_CAUSES.VOTE || isIdiotPowerless;
  }

  public canPlayerBeEaten(eatenPlayer: Player, game: Game): boolean {
    const { isProtectedByGuard: isLittleGirlProtectedByGuard } = game.options.roles.littleGirl;
    const isPlayerSavedByWitch = doesPlayerHaveAttribute(eatenPlayer, PLAYER_ATTRIBUTE_NAMES.DRANK_LIFE_POTION);
    const isPlayerProtectedByGuard = doesPlayerHaveAttribute(eatenPlayer, PLAYER_ATTRIBUTE_NAMES.PROTECTED);
    return !isPlayerSavedByWitch && (!isPlayerProtectedByGuard || eatenPlayer.role.current === ROLE_NAMES.LITTLE_GIRL && !isLittleGirlProtectedByGuard);
  }

  public isPlayerKillable(player: Player, game: Game, cause: PLAYER_DEATH_CAUSES, gameHistoryRecords: GameHistoryRecord[]): boolean {
    if (cause === PLAYER_DEATH_CAUSES.EATEN && !this.canPlayerBeEaten(player, game)) {
      return false;
    }
    if (player.role.current === ROLE_NAMES.IDIOT) {
      return this.isIdiotKillable(player, cause);
    }
    if (player.role.current === ROLE_NAMES.ANCIENT) {
      return this.isAncientKillable(player, game, cause, gameHistoryRecords);
    }
    return true;
  }

  public applyWorshipedPlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const wildChildPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.WILD_CHILD);
    if (!doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.WORSHIPED) ||
      wildChildPlayer === undefined || !wildChildPlayer.isAlive || doesPlayerHaveAttribute(wildChildPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS)) {
      return clonedGame;
    }
    wildChildPlayer.side.current = ROLE_SIDES.WEREWOLVES;
    return updatePlayerInGame(wildChildPlayer._id, wildChildPlayer, clonedGame);
  }

  public applyInLovePlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const otherLoverFinder = (player: Player): boolean => doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.IN_LOVE) && player.isAlive && player._id !== killedPlayer._id;
    const otherPlayerInLove = clonedGame.players.find(otherLoverFinder);
    if (!doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.IN_LOVE) || !otherPlayerInLove) {
      return clonedGame;
    }
    return this.killPlayer(otherPlayerInLove, clonedGame, createPlayerBrokenHeartByCupidDeath());
  }

  public applySheriffPlayerDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (!doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.SHERIFF) ||
      killedPlayer.role.current === ROLE_NAMES.IDIOT && !doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS)) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlaySheriffDelegates(), clonedGame);
  }

  public applyPlayerAttributesDeathOutcomes(killedPlayer: Player, game: Game): Game {
    let clonedGame = cloneDeep(game);
    let clonedKilledPlayer = cloneDeep(killedPlayer);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("applyPlayerAttributesDeathOutcomes", { gameId: game._id, playerId: killedPlayer._id });
    if (doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.SHERIFF)) {
      clonedGame = this.applySheriffPlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
      clonedKilledPlayer = getPlayerWithIdOrThrow(clonedKilledPlayer._id, clonedGame, cantFindPlayerException);
    }
    if (doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.IN_LOVE)) {
      clonedGame = this.applyInLovePlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
      clonedKilledPlayer = getPlayerWithIdOrThrow(clonedKilledPlayer._id, clonedGame, cantFindPlayerException);
    }
    if (doesPlayerHaveAttribute(clonedKilledPlayer, PLAYER_ATTRIBUTE_NAMES.WORSHIPED)) {
      clonedGame = this.applyWorshipedPlayerDeathOutcomes(clonedKilledPlayer, clonedGame);
    }
    return clonedGame;
  }

  public applyRustySwordKnightDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    const clonedGame = cloneDeep(game);
    if (killedPlayer.role.current !== ROLE_NAMES.RUSTY_SWORD_KNIGHT || doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS) ||
      death.cause !== PLAYER_DEATH_CAUSES.EATEN) {
      return clonedGame;
    }
    const leftAliveWerewolfNeighbor = getNearestAliveNeighbor(killedPlayer._id, clonedGame, { direction: "left", playerSide: ROLE_SIDES.WEREWOLVES });
    if (!leftAliveWerewolfNeighbor) {
      return clonedGame;
    }
    return addPlayerAttributeInGame(leftAliveWerewolfNeighbor._id, clonedGame, createContaminatedByRustySwordKnightPlayerAttribute());
  }

  public applyScapegoatDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    const clonedGame = cloneDeep(game);
    if (killedPlayer.role.current !== ROLE_NAMES.SCAPEGOAT || doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS) ||
      death.cause !== PLAYER_DEATH_CAUSES.VOTE_SCAPEGOATED) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlayScapegoatBansVoting(), clonedGame);
  }

  public applyAncientDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    let clonedGame = cloneDeep(game);
    const ancientRevengeDeathCauses: PLAYER_DEATH_CAUSES[] = [PLAYER_DEATH_CAUSES.VOTE, PLAYER_DEATH_CAUSES.SHOT, PLAYER_DEATH_CAUSES.DEATH_POTION];
    const { idiot: idiotOptions, ancient: ancientOptions } = clonedGame.options.roles;
    if (killedPlayer.role.current !== ROLE_NAMES.ANCIENT || doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS)) {
      return clonedGame;
    }
    if (ancientRevengeDeathCauses.includes(death.cause) && ancientOptions.doesTakeHisRevenge) {
      const aliveVillagerSidedPlayersIds = getAliveVillagerSidedPlayers(clonedGame.players).map(({ _id }) => _id);
      clonedGame = addPlayersAttributeInGame(aliveVillagerSidedPlayersIds, clonedGame, createPowerlessByAncientPlayerAttribute());
    }
    const idiotPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.IDIOT);
    if (idiotPlayer?.isAlive === true && idiotPlayer.role.isRevealed && idiotOptions.doesDieOnAncientDeath) {
      return this.killPlayer(idiotPlayer, clonedGame, createPlayerReconsiderPardonByAllDeath());
    }
    return clonedGame;
  }

  public applyHunterDeathOutcomes(killedPlayer: Player, game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (killedPlayer.role.current !== ROLE_NAMES.HUNTER || doesPlayerHaveAttribute(killedPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS)) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlayHunterShoots(), clonedGame);
  }

  public applyPlayerRoleDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    const clonedGame = cloneDeep(game);
    if (killedPlayer.role.current === ROLE_NAMES.HUNTER) {
      return this.applyHunterDeathOutcomes(killedPlayer, clonedGame);
    }
    if (killedPlayer.role.current === ROLE_NAMES.ANCIENT) {
      return this.applyAncientDeathOutcomes(killedPlayer, clonedGame, death);
    }
    if (killedPlayer.role.current === ROLE_NAMES.SCAPEGOAT) {
      return this.applyScapegoatDeathOutcomes(killedPlayer, clonedGame, death);
    }
    if (killedPlayer.role.current === ROLE_NAMES.RUSTY_SWORD_KNIGHT) {
      return this.applyRustySwordKnightDeathOutcomes(killedPlayer, clonedGame, death);
    }
    return clonedGame;
  }

  public applyPlayerDeathOutcomes(killedPlayer: Player, game: Game, death: PlayerDeath): Game {
    let clonedGame = cloneDeep(game);
    let clonedPlayerToKill = cloneDeep(killedPlayer);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("killPlayer", { gameId: game._id, playerId: killedPlayer._id });
    clonedGame = this.applyPlayerRoleDeathOutcomes(clonedPlayerToKill, clonedGame, death);
    clonedPlayerToKill = getPlayerWithIdOrThrow(clonedPlayerToKill._id, clonedGame, cantFindPlayerException);
    return this.applyPlayerAttributesDeathOutcomes(clonedPlayerToKill, clonedGame);
  }

  public killPlayer(playerToKill: Player, game: Game, death: PlayerDeath): Game {
    let clonedGame = cloneDeep(game);
    let clonedPlayerToKill = cloneDeep(playerToKill);
    const cantFindPlayerException = createCantFindPlayerUnexpectedException("killPlayer", { gameId: game._id, playerId: playerToKill._id });
    clonedPlayerToKill.isAlive = false;
    clonedPlayerToKill.role.isRevealed = true;
    clonedPlayerToKill.death = createPlayerDeath(death);
    clonedGame = updatePlayerInGame(clonedPlayerToKill._id, playerToKill, clonedGame);
    clonedPlayerToKill = getPlayerWithIdOrThrow(playerToKill._id, clonedGame, cantFindPlayerException);
    clonedGame = this.applyPlayerDeathOutcomes(clonedPlayerToKill, clonedGame, death);
    clonedPlayerToKill = getPlayerWithIdOrThrow(playerToKill._id, clonedGame, cantFindPlayerException);
    return updatePlayerInGame(clonedPlayerToKill._id, { attributes: [] }, clonedGame);
  }

  public getPlayerToKillInGame(playerId: Types.ObjectId, game: Game): Player {
    const exceptionInterpolations = { gameId: game._id, playerId };
    const playerToKill = getPlayerWithIdOrThrow(playerId, game, createCantFindPlayerUnexpectedException("getPlayerToKillInGame", exceptionInterpolations));
    if (!playerToKill.isAlive) {
      throw createPlayerIsDeadUnexpectedException("getPlayerToKillInGame", exceptionInterpolations);
    }
    return cloneDeep(playerToKill);
  }

  public killOrRevealPlayer(playerId: Types.ObjectId, game: Game, death: PlayerDeath, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const playerToKill = this.getPlayerToKillInGame(playerId, clonedGame);
    if (this.isPlayerKillable(playerToKill, clonedGame, death.cause, gameHistoryRecords)) {
      return this.killPlayer(playerToKill, clonedGame, death);
    }
    if (this.doesPlayerRoleMustBeRevealed(playerToKill, death)) {
      return this.revealPlayerRole(playerToKill, clonedGame);
    }
    return clonedGame;
  }
}