import { Injectable } from "@nestjs/common";

import type { GameSource } from "@/modules/game/types/game.types";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithIdOrThrow } from "@/modules/game/helpers/game.helpers";
import { updatePlayerInGame } from "@/modules/game/helpers/game.mutators";
import { createPowerlessByAccursedWolfFatherPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { doesPlayerHaveActiveAttributeWithName, doesPlayerHaveActiveAttributeWithNameAndSource, getActivePlayerAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createCantFindPlayerWithIdUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

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
    const phaseUpcomingPlays = await this.gamePlayService.getPhaseUpcomingPlays(clonedGame);
    clonedGame.upcomingPlays = [...clonedGame.upcomingPlays, ...phaseUpcomingPlays];
    return clonedGame;
  }

  public applyStartingGamePhaseOutcomes(game: Game): Game {
    const clonedGame = createGame(game);
    if (clonedGame.phase === GamePhases.NIGHT) {
      return this.applyStartingNightPlayerAttributesOutcomes(clonedGame);
    }
    return clonedGame;
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
    const notFoundPlayerException = createCantFindPlayerWithIdUnexpectedException("applyEndingNightPlayerAttributesOutcomesToPlayer", notFoundPlayerExceptionInterpolations);
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

  private isActingPlayerAttributeRelevantOnStartingNight(attribute: PlayerAttribute, game: Game): boolean {
    const { isPowerlessOnWerewolvesSide: isActorPowerlessOnWerewolvesSide } = game.options.roles.actor;
    const { source, name } = attribute;
    const irrelevantAttributeNames = [PlayerAttributeNames.ACTING, PlayerAttributeNames.POWERLESS];
    const stickyPowerlessSourceNames: GameSource[] = [RoleNames.ACTOR, RoleNames.ELDER];
    const isStickyPowerlessAttributeFromAccursedWolfFather = source === RoleNames.ACCURSED_WOLF_FATHER && isActorPowerlessOnWerewolvesSide;
    const isStickyPowerlessAttribute = name === PlayerAttributeNames.POWERLESS &&
      (stickyPowerlessSourceNames.includes(source) || isStickyPowerlessAttributeFromAccursedWolfFather);
    return !irrelevantAttributeNames.includes(name) || isStickyPowerlessAttribute;
  }

  private applyStartingNightActingPlayerOutcomes(actingPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const { isPowerlessOnWerewolvesSide: isActorPowerlessOnWerewolvesSide } = clonedGame.options.roles.actor;
    const attributes = actingPlayer.attributes.filter(attribute => this.isActingPlayerAttributeRelevantOnStartingNight(attribute, clonedGame));
    const isActorAlreadyPowerlessFromAccursedWolfFather = doesPlayerHaveActiveAttributeWithNameAndSource(
      actingPlayer,
      PlayerAttributeNames.POWERLESS,
      RoleNames.ACCURSED_WOLF_FATHER,
      clonedGame,
    );
    if (isActorPowerlessOnWerewolvesSide && !isActorAlreadyPowerlessFromAccursedWolfFather && actingPlayer.side.current === RoleSides.WEREWOLVES) {
      attributes.push(createPowerlessByAccursedWolfFatherPlayerAttribute());
    }
    const playerDataToUpdate: Partial<Player> = { role: { ...actingPlayer.role, current: RoleNames.ACTOR, isRevealed: false }, attributes };
    return updatePlayerInGame(actingPlayer._id, playerDataToUpdate, clonedGame);
  }

  private applyStartingNightPlayerAttributesOutcomes(game: Game): Game {
    let clonedGame = createGame(game);
    for (const player of clonedGame.players) {
      if (doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.ACTING, clonedGame)) {
        clonedGame = this.applyStartingNightActingPlayerOutcomes(player, clonedGame);
      }
    }
    return clonedGame;
  }
}