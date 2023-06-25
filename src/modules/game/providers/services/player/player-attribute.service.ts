import { cloneDeep } from "lodash";
import { isPlayerAttributeActive } from "../../../helpers/player/player-attribute/player-attribute.helper";
import type { Game } from "../../../schemas/game.schema";
import type { PlayerAttribute } from "../../../schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "../../../schemas/player/player.schema";

export class PlayerAttributeService {
  // public applyEatenAttributeOutcomes(player: Player, game: Game): Game

  // public applyDrankDeathPotionAttributeOutcomes(player: Player, game: Game): Game

  // public applyContaminatedAttributeOutcomes(player: Player, game: Game): Game

  public decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes(game: Game): Game {
    const clonedGame = cloneDeep(game);
    clonedGame.players = clonedGame.players.map(player => this.decreaseRemainingPhasesAndRemoveObsoleteAttributes(player, clonedGame));
    return clonedGame;
  }

  private decreaseAttributeRemainingPhase(attribute: PlayerAttribute, game: Game): PlayerAttribute {
    const clonedAttribute = cloneDeep(attribute);
    if (clonedAttribute.remainingPhases !== undefined && isPlayerAttributeActive(clonedAttribute, game)) {
      clonedAttribute.remainingPhases--;
    }
    return clonedAttribute;
  }
  
  private decreaseRemainingPhasesAndRemoveObsoleteAttributes(player: Player, game: Game): Player {
    const clonedPlayer = cloneDeep(player);
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