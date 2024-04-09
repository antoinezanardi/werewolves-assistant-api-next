import { Injectable } from "@nestjs/common";

import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithIdOrThrow } from "@/modules/game/helpers/game.helpers";
import { updatePlayerInGame } from "@/modules/game/helpers/game.mutators";
import { createPowerlessByAccursedWolfFatherPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { doesPlayerHaveActiveAttributeWithName, doesPlayerHaveActiveAttributeWithNameAndSource, getActivePlayerAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameSource } from "@/modules/game/types/game.types";
import { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";

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
    clonedGame.phase = clonedGame.phase === "night" ? "day" : "night";
    if (clonedGame.phase === "night") {
      clonedGame.turn++;
    }
    const phaseUpcomingPlays = await this.gamePlayService.getPhaseUpcomingPlays(clonedGame);
    clonedGame.upcomingPlays = [...clonedGame.upcomingPlays, ...phaseUpcomingPlays];
    return clonedGame;
  }

  public applyStartingGamePhaseOutcomes(game: Game): Game {
    const clonedGame = createGame(game);
    if (clonedGame.phase === "night") {
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
    if (doesPlayerHaveActiveAttributeWithName(clonedPlayer, "contaminated", clonedGame)) {
      clonedGame = await this.playerAttributeService.applyContaminatedAttributeOutcomes(clonedPlayer, clonedGame);
    }
    return clonedGame;
  }

  private async applyEndingNightPlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    let clonedPlayer = createPlayer(player);
    const eatenAttribute = getActivePlayerAttributeWithName(clonedPlayer, "eaten", clonedGame);
    const notFoundPlayerExceptionInterpolations = { gameId: clonedGame._id, playerId: clonedPlayer._id };
    const notFoundPlayerException = createCantFindPlayerWithIdUnexpectedException("applyEndingNightPlayerAttributesOutcomesToPlayer", notFoundPlayerExceptionInterpolations);
    if (eatenAttribute) {
      clonedGame = await this.playerAttributeService.applyEatenAttributeOutcomes(clonedPlayer, clonedGame, eatenAttribute);
    }
    clonedPlayer = getPlayerWithIdOrThrow(clonedPlayer._id, clonedGame, notFoundPlayerException);
    if (doesPlayerHaveActiveAttributeWithName(clonedPlayer, "drank-death-potion", clonedGame)) {
      clonedGame = await this.playerAttributeService.applyDrankDeathPotionAttributeOutcomes(clonedPlayer, clonedGame);
    }
    return clonedGame;
  }

  private async applyEndingGamePhasePlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    const clonedGame = createGame(game);
    const clonedPlayer = createPlayer(player);
    if (clonedGame.phase === "night") {
      return this.applyEndingNightPlayerAttributesOutcomesToPlayer(clonedPlayer, clonedGame);
    }
    return this.applyEndingDayPlayerAttributesOutcomesToPlayer(clonedPlayer, clonedGame);
  }

  private isActingPlayerAttributeRelevantOnStartingNight(attribute: PlayerAttribute, game: Game): boolean {
    const { isPowerlessOnWerewolvesSide: isActorPowerlessOnWerewolvesSide } = game.options.roles.actor;
    const { source, name } = attribute;
    const irrelevantAttributeNames: PlayerAttributeName[] = ["acting", "powerless"];
    const stickyPowerlessSourceNames: GameSource[] = ["actor", "elder"];
    const isStickyPowerlessAttributeFromAccursedWolfFather = source === "accursed-wolf-father" && isActorPowerlessOnWerewolvesSide;
    const isStickyPowerlessAttribute = name === "powerless" &&
      (stickyPowerlessSourceNames.includes(source) || isStickyPowerlessAttributeFromAccursedWolfFather);
    return !irrelevantAttributeNames.includes(name) || isStickyPowerlessAttribute;
  }

  private applyStartingNightActingPlayerOutcomes(actingPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    const { isPowerlessOnWerewolvesSide: isActorPowerlessOnWerewolvesSide } = clonedGame.options.roles.actor;
    const attributes = actingPlayer.attributes.filter(attribute => this.isActingPlayerAttributeRelevantOnStartingNight(attribute, clonedGame));
    const isActorAlreadyPowerlessFromAccursedWolfFather = doesPlayerHaveActiveAttributeWithNameAndSource(
      actingPlayer,
      "powerless",
      "accursed-wolf-father",
      clonedGame,
    );
    if (isActorPowerlessOnWerewolvesSide && !isActorAlreadyPowerlessFromAccursedWolfFather && actingPlayer.side.current === "werewolves") {
      attributes.push(createPowerlessByAccursedWolfFatherPlayerAttribute());
    }
    const playerDataToUpdate: Partial<Player> = { role: { ...actingPlayer.role, current: "actor", isRevealed: false }, attributes };
    return updatePlayerInGame(actingPlayer._id, playerDataToUpdate, clonedGame);
  }

  private applyStartingNightPlayerAttributesOutcomes(game: Game): Game {
    let clonedGame = createGame(game);
    for (const player of clonedGame.players) {
      if (doesPlayerHaveActiveAttributeWithName(player, "acting", clonedGame)) {
        clonedGame = this.applyStartingNightActingPlayerOutcomes(player, clonedGame);
      }
    }
    return clonedGame;
  }
}