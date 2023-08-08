import { Injectable } from "@nestjs/common";
import { GAME_PHASES } from "../../../enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../enums/player.enum";
import { createGame } from "../../../helpers/game.factory";
import { doesPlayerHaveAttributeWithName, getPlayerAttributeWithName } from "../../../helpers/player/player-attribute/player-attribute.helper";
import { createPlayer } from "../../../helpers/player/player.factory";
import type { Game } from "../../../schemas/game.schema";
import type { Player } from "../../../schemas/player/player.schema";
import { GamePlayService } from "../game-play/game-play.service";
import { PlayerAttributeService } from "../player/player-attribute.service";

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
    clonedGame.phase = clonedGame.phase === GAME_PHASES.NIGHT ? GAME_PHASES.DAY : GAME_PHASES.NIGHT;
    const upcomingNightPlays = await this.gamePlayService.getUpcomingNightPlays(clonedGame);
    const upcomingDayPlays = this.gamePlayService.getUpcomingDayPlays();
    const phaseUpcomingPlays = clonedGame.phase === GAME_PHASES.NIGHT ? upcomingNightPlays : upcomingDayPlays;
    clonedGame.upcomingPlays = [...clonedGame.upcomingPlays, ...phaseUpcomingPlays];
    return clonedGame;
  }

  private async applyEndingDayPlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    const clonedPlayer = createPlayer(player);
    if (doesPlayerHaveAttributeWithName(clonedPlayer, PLAYER_ATTRIBUTE_NAMES.CONTAMINATED)) {
      clonedGame = await this.playerAttributeService.applyContaminatedAttributeOutcomes(clonedPlayer, clonedGame);
    }
    return clonedGame;
  }

  private async applyEndingNightPlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    let clonedGame = createGame(game);
    const clonedPlayer = createPlayer(player);
    const eatenAttribute = getPlayerAttributeWithName(clonedPlayer, PLAYER_ATTRIBUTE_NAMES.EATEN);
    if (eatenAttribute) {
      clonedGame = await this.playerAttributeService.applyEatenAttributeOutcomes(clonedPlayer, clonedGame, eatenAttribute);
    }
    if (doesPlayerHaveAttributeWithName(clonedPlayer, PLAYER_ATTRIBUTE_NAMES.DRANK_DEATH_POTION)) {
      clonedGame = await this.playerAttributeService.applyDrankDeathPotionAttributeOutcomes(clonedPlayer, clonedGame);
    }
    return clonedGame;
  }
  
  private async applyEndingGamePhasePlayerAttributesOutcomesToPlayer(player: Player, game: Game): Promise<Game> {
    const clonedGame = createGame(game);
    const clonedPlayer = createPlayer(player);
    if (clonedGame.phase === GAME_PHASES.NIGHT) {
      return this.applyEndingNightPlayerAttributesOutcomesToPlayer(clonedPlayer, clonedGame);
    }
    return this.applyEndingDayPlayerAttributesOutcomesToPlayer(clonedPlayer, clonedGame);
  }
}