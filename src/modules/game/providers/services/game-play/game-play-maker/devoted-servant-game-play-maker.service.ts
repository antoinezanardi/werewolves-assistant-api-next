import { Injectable } from "@nestjs/common";

import { createStolenRoleByDevotedServantPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { addPlayerAttributeInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutator";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

@Injectable()
export class DevotedServantGamePlayMakerService {
  public swapTargetAndDevotedServantCurrentRoleAndSide(targetedPlayer: Player, game: Game): Game {
    let clonedGame = createGame(game);
    const devotedServantPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.DEVOTED_SERVANT);
    if (!devotedServantPlayer) {
      return clonedGame;
    }
    const devotedServantPlayerDataToUpdate: Partial<Player> = {
      role: {
        ...devotedServantPlayer.role,
        current: targetedPlayer.role.current,
        isRevealed: targetedPlayer.role.isRevealed,
      },
      side: {
        ...devotedServantPlayer.side,
        current: targetedPlayer.side.current,
      },
    };
    const targetPlayerDataToUpdate: Partial<Player> = {
      role: {
        ...targetedPlayer.role,
        current: devotedServantPlayer.role.current,
      },
      side: {
        ...targetedPlayer.side,
        current: devotedServantPlayer.side.current,
      },
    };
    clonedGame = updatePlayerInGame(devotedServantPlayer._id, devotedServantPlayerDataToUpdate, clonedGame);
    return updatePlayerInGame(targetedPlayer._id, targetPlayerDataToUpdate, clonedGame);
  }

  public devotedServantStealsRole(targetedPlayer: Player, game: Game): Game {
    let clonedGame = createGame(game);
    clonedGame = this.swapTargetAndDevotedServantCurrentRoleAndSide(targetedPlayer, clonedGame);
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, createStolenRoleByDevotedServantPlayerAttribute());
  }
}