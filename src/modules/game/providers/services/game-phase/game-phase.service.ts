import { Injectable } from "@nestjs/common";

import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getNearestAliveNeighbor, getPlayerWithIdOrThrow } from "@/modules/game/helpers/game.helper";
import { addPlayerAttributeInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutator";
import { createGrowledByBearTamerPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { doesPlayerHaveActiveAttributeWithName, getActivePlayerAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helper";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createCantFindPlayerUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePhaseService {
  public constructor(
    private readonly playerAttributeService: PlayerAttributeService,
    private readonly gamePlayService: GamePlayService,
  ) {}

  public async applyEndingGamePhaseOutcomes(game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    clonedGame = await this.applyEndingGamePhasePlayerAttributesOutcomesToPlayers(clonedGame);
    return clonedGame;
  }

  public async switchPhaseAndAppendGamePhaseUpcomingPlays(game: Game): Promise<Game> {
    const clonedGame = createGame(game);
    clonedGame.phase = clonedGame.phase === GamePhases.NIGHT ? GamePhases.DAY : GamePhases.NIGHT;
    if (clonedGame.phase === GamePhases.NIGHT) {
      clonedGame.turn++;
    }
    const upcomingNightPlays = await this.gamePlayService.getUpcomingNightPlays(clonedGame);
    const upcomingDayPlays = this.gamePlayService.getUpcomingDayPlays(clonedGame);
    const phaseUpcomingPlays = clonedGame.phase === GamePhases.NIGHT ? upcomingNightPlays : upcomingDayPlays;
    clonedGame.upcomingPlays = [...clonedGame.upcomingPlays, ...phaseUpcomingPlays];
    return clonedGame;
  }

  public applyStartingGamePhaseOutcomes(game: Game): Game {
    const clonedGame = createGame(game);
    if (clonedGame.phase === GamePhases.DAY) {
      return this.applyStartingDayPlayerRoleOutcomesToPlayers(clonedGame);
    }
    return this.applyStartingNightPlayerRoleOutcomes(clonedGame);
  }

  private async applyEndingGamePhasePlayerAttributesOutcomesToPlayers(game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    for (const player of clonedGame.players) {
      clonedGame = await this.applyEndingGamePhasePlayerAttributesOutcomesToPlayer(player, clonedGame);
    }
    return clonedGame;
  }

  private async applyEndingDayPlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    const clonedPlayer = createPlayer(player);
    if (doesPlayerHaveActiveAttributeWithName(clonedPlayer, PlayerAttributeNames.CONTAMINATED, clonedGame)) {
      clonedGame = await this.playerAttributeService.applyContaminatedAttributeOutcomes(clonedPlayer, clonedGame);
    }
    return clonedGame;
  }

  private async applyEndingNightPlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    let clonedPlayer = createPlayer(player);
    const eatenAttribute = getActivePlayerAttributeWithName(clonedPlayer, PlayerAttributeNames.EATEN, clonedGame);
    const notFoundPlayerExceptionInterpolations = { gameId: clonedGame._id, playerId: clonedPlayer._id };
    const notFoundPlayerException = createCantFindPlayerUnexpectedException("applyEndingNightPlayerAttributesOutcomesToPlayer", notFoundPlayerExceptionInterpolations);
    if (eatenAttribute) {
      clonedGame = await this.playerAttributeService.applyEatenAttributeOutcomes(clonedPlayer, clonedGame, eatenAttribute);
    }
    clonedPlayer = getPlayerWithIdOrThrow(clonedPlayer._id, clonedGame, notFoundPlayerException);
    if (doesPlayerHaveActiveAttributeWithName(clonedPlayer, PlayerAttributeNames.DRANK_DEATH_POTION, clonedGame)) {
      clonedGame = await this.playerAttributeService.applyDrankDeathPotionAttributeOutcomes(clonedPlayer, clonedGame);
    }
    return clonedGame;
  }
  
  private async applyEndingGamePhasePlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    const clonedGame = createGame(game);
    const clonedPlayer = createPlayer(player);
    if (clonedGame.phase === GamePhases.NIGHT) {
      return this.applyEndingNightPlayerAttributesOutcomesToPlayer(clonedPlayer, clonedGame);
    }
    return this.applyEndingDayPlayerAttributesOutcomesToPlayer(clonedPlayer, clonedGame);
  }

  private applyStartingDayBearTamerRoleOutcomes(bearTamerPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const leftAliveNeighbor = getNearestAliveNeighbor(bearTamerPlayer._id, clonedGame, { direction: "left" });
    const rightAliveNeighbor = getNearestAliveNeighbor(bearTamerPlayer._id, clonedGame, { direction: "right" });
    const doesBearTamerHaveWerewolfSidedNeighbor = leftAliveNeighbor?.side.current === RoleSides.WEREWOLVES || rightAliveNeighbor?.side.current === RoleSides.WEREWOLVES;
    const { doesGrowlIfInfected } = clonedGame.options.roles.bearTamer;
    const isBearTamerInfected = bearTamerPlayer.side.current === RoleSides.WEREWOLVES;
    if (doesGrowlIfInfected && isBearTamerInfected || doesBearTamerHaveWerewolfSidedNeighbor) {
      const growledByBearTamerPlayerAttribute = createGrowledByBearTamerPlayerAttribute();
      return addPlayerAttributeInGame(bearTamerPlayer._id, clonedGame, growledByBearTamerPlayerAttribute);
    }
    return clonedGame;
  }

  private applyStartingDayPlayerRoleOutcomesToPlayers(game: Game): Game {
    let clonedGame = createGame(game);
    for (const player of clonedGame.players) {
      if (player.role.current === RoleNames.BEAR_TAMER && isPlayerAliveAndPowerful(player, clonedGame)) {
        clonedGame = this.applyStartingDayBearTamerRoleOutcomes(player, clonedGame);
      }
    }
    return clonedGame;
  }

  private applyStartingNightActorRoleOutcomes(actorPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const attributes = actorPlayer.attributes.filter(({ name, source }) => name !== PlayerAttributeNames.POWERLESS || source === RoleNames.ACCURSED_WOLF_FATHER);
    const playerDataToUpdate: Partial<Player> = { role: { ...actorPlayer.role, current: RoleNames.ACTOR, isRevealed: false }, attributes };
    return updatePlayerInGame(actorPlayer._id, playerDataToUpdate, clonedGame);
  }

  private applyStartingNightPlayerRoleOutcomes(game: Game): Game {
    let clonedGame = createGame(game);
    for (const player of clonedGame.players) {
      if (player.role.original === RoleNames.ACTOR && player.isAlive) {
        clonedGame = this.applyStartingNightActorRoleOutcomes(player, clonedGame);
      }
    }
    return clonedGame;
  }
}