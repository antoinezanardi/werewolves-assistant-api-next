import { Injectable } from "@nestjs/common";

import { createGame } from "@/modules/game/helpers/game.factory";
import { createPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { isPlayerAttributeActive } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createPlayerDiseaseByRustySwordKnightDeath, createPlayerDeathPotionByWitchDeath, createPlayerEatenByWerewolvesDeath } from "@/modules/game/helpers/player/player-death/player-death.factory";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

@Injectable()
export class PlayerAttributeService {
  public constructor(private readonly playerKillerService: PlayerKillerService) {}

  public async applyEatenAttributeOutcomes(player: Player, game: Game, attribute: PlayerAttribute): Promise<Game> {
    const death = createPlayerEatenByWerewolvesDeath({ source: attribute.source });
    return this.playerKillerService.killOrRevealPlayer(player._id, game, death);
  }

  public async applyDrankDeathPotionAttributeOutcomes(player: Player, game: Game): Promise<Game> {
    const death = createPlayerDeathPotionByWitchDeath();
    return this.playerKillerService.killOrRevealPlayer(player._id, game, death);
  }

  public async applyContaminatedAttributeOutcomes(player: Player, game: Game): Promise<Game> {
    const death = createPlayerDiseaseByRustySwordKnightDeath();
    return this.playerKillerService.killOrRevealPlayer(player._id, game, death);
  }

  public decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes(game: Game): Game {
    const clonedGame = createGame(game);
    clonedGame.players = clonedGame.players.map(player => this.decreaseRemainingPhasesAndRemoveObsoleteAttributes(player, clonedGame));
    return clonedGame;
  }

  private decreaseAttributeRemainingPhase(attribute: PlayerAttribute, game: Game): PlayerAttribute {
    const clonedAttribute = createPlayerAttribute(attribute);
    if (clonedAttribute.remainingPhases !== undefined && isPlayerAttributeActive(clonedAttribute, game)) {
      clonedAttribute.remainingPhases--;
    }
    return clonedAttribute;
  }
  
  private decreaseRemainingPhasesAndRemoveObsoleteAttributes(player: Player, game: Game): Player {
    const clonedPlayer = createPlayer(player);
    if (!clonedPlayer.isAlive) {
      return clonedPlayer;
    }
    clonedPlayer.attributes = player.attributes.reduce<PlayerAttribute[]>((acc, attribute) => {
      const decreasedAttribute = this.decreaseAttributeRemainingPhase(attribute, game);
      if (decreasedAttribute.remainingPhases === undefined || decreasedAttribute.remainingPhases > 0) {
        return [...acc, decreasedAttribute];
      }
      return acc;
    }, []);
    return clonedPlayer;
  }
}