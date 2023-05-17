import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import type { Types } from "mongoose";
import { UNEXPECTED_EXCEPTION_REASONS, UNEXPECTED_EXCEPTION_SCOPES } from "../../../../../shared/exception/enums/unexpected-exception.enum";
import type { ExceptionInterpolations } from "../../../../../shared/exception/types/exception.type";
import { UnexpectedException } from "../../../../../shared/exception/types/unexpected-exception.type";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES } from "../../../enums/player.enum";
import { getPlayerWithId } from "../../../helpers/game.helper";
import { doesPlayerHaveAttribute } from "../../../helpers/player/player.helper";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import type { Player } from "../../../schemas/player/player.schema";

@Injectable()
export class PlayerKillerService {

  public getAncientLivesCountAgainstWerewolves(game: Game, gameHistoryRecords: GameHistoryRecord[]): number {
    const { livesCountAgainstWerewolves } = game.options.roles.ancient;
    return livesCountAgainstWerewolves;
  }

  public isAncientKillable(ancientPlayer: Player, game: Game, cause: PLAYER_DEATH_CAUSES, gameHistoryRecords: GameHistoryRecord[]): boolean {
    if (cause !== PLAYER_DEATH_CAUSES.EATEN) {
      return true;
    }
    const ancientLivesCountAgainstWerewolves = this.getAncientLivesCountAgainstWerewolves(game, gameHistoryRecords);
    return ancientLivesCountAgainstWerewolves - 1 === 0;
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

  public getPlayerToKillInGame(playerId: Types.ObjectId, game: Game): Player {
    const playerToKill = getPlayerWithId(game.players, playerId);
    if (!playerToKill) {
      const interpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: playerId.toString() };
      throw new UnexpectedException(UNEXPECTED_EXCEPTION_SCOPES.KILL_PLAYER, UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, interpolations);
    }
    if (!playerToKill.isAlive) {
      const interpolations: ExceptionInterpolations = { playerId: playerId.toString() };
      throw new UnexpectedException(UNEXPECTED_EXCEPTION_SCOPES.KILL_PLAYER, UNEXPECTED_EXCEPTION_REASONS.PLAYER_IS_DEAD, interpolations);
    }
    return playerToKill;
  }

  public killPlayer(playerId: Types.ObjectId, game: Game, cause: PLAYER_DEATH_CAUSES, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const playerToKill = this.getPlayerToKillInGame(playerId, clonedGame);
    return clonedGame;
  }
}