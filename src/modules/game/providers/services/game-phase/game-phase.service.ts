import { Injectable } from "@nestjs/common";

import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { createGame } from "@/modules/game/helpers/game.factory";
import { doesPlayerHaveActiveAttributeWithName, getActivePlayerAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

@Injectable()
export class GamePhaseService {
  public constructor(
    private readonly playerAttributeService: PlayerAttributeService,
    private readonly gamePlayService: GamePlayService,
  ) {}

  public async applyEndingGamePhasePlayerAttributesOutcomesToPlayers(game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    for (const player of clonedGame.players) {
      clonedGame = await this.applyEndingGamePhasePlayerAttributesOutcomesToPlayer(player, clonedGame);
    }
    return clonedGame;
  }

  public async switchPhaseAndAppendGamePhaseUpcomingPlays(game: Game): Promise<Game> {
    const clonedGame = createGame(game);
    clonedGame.phase = clonedGame.phase === GamePhases.NIGHT ? GamePhases.DAY : GamePhases.NIGHT;
    if (clonedGame.phase === GamePhases.NIGHT) {
      clonedGame.turn++;
    }
    const upcomingNightPlays = await this.gamePlayService.getUpcomingNightPlays(clonedGame);
    const upcomingDayPlays = this.gamePlayService.getUpcomingDayPlays();
    const phaseUpcomingPlays = clonedGame.phase === GamePhases.NIGHT ? upcomingNightPlays : upcomingDayPlays;
    clonedGame.upcomingPlays = [...clonedGame.upcomingPlays, ...phaseUpcomingPlays];
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
    const clonedPlayer = createPlayer(player);
    const eatenAttribute = getActivePlayerAttributeWithName(clonedPlayer, PlayerAttributeNames.EATEN, clonedGame);
    if (eatenAttribute) {
      clonedGame = await this.playerAttributeService.applyEatenAttributeOutcomes(clonedPlayer, clonedGame, eatenAttribute);
    }
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
}