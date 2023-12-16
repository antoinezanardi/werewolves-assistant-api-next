import { Injectable } from "@nestjs/common";

import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { createGamePlaySheriffDelegates } from "@/modules/game/helpers/game-play/game-play.factory";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithCurrentRole, getPlayerWithIdOrThrow } from "@/modules/game/helpers/game.helper";
import { addPlayerAttributeInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameAndSourceInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutator";
import { createStolenRoleByDevotedServantPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { canPlayerDelegateSheriffAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createCantFindPlayerUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class DevotedServantGamePlayMakerService {
  public devotedServantStealsRole(targetedPlayer: DeadPlayer, game: Game): Game {
    let clonedGame = createGame(game);
    let devotedServantPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.DEVOTED_SERVANT);
    if (!devotedServantPlayer) {
      return clonedGame;
    }
    const cantFindDevotedServantException = createCantFindPlayerUnexpectedException("devotedServantStealsRole", { gameId: game._id, playerId: devotedServantPlayer._id });
    clonedGame = removePlayerAttributeByNameAndSourceInGame(devotedServantPlayer._id, clonedGame, PlayerAttributeNames.CHARMED, RoleNames.PIED_PIPER);
    devotedServantPlayer = getPlayerWithIdOrThrow(devotedServantPlayer._id, clonedGame, cantFindDevotedServantException);
    clonedGame = this.swapTargetAndDevotedServantCurrentRoleAndSide(targetedPlayer, devotedServantPlayer, clonedGame);
    devotedServantPlayer = getPlayerWithIdOrThrow(devotedServantPlayer._id, clonedGame, cantFindDevotedServantException);
    clonedGame = this.makeDevotedServantDelegatesIfSheriff(devotedServantPlayer, clonedGame);
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, createStolenRoleByDevotedServantPlayerAttribute());
  }

  private swapTargetAndDevotedServantCurrentRoleAndSide(targetedPlayer: DeadPlayer, devotedServantPlayer: Player, game: Game): Game {
    let clonedGame = createGame(game);
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

  private makeDevotedServantDelegatesIfSheriff(devotedServantPlayer: Player, game: Game): Game {
    const clonedGame = createGame(game);
    if (!canPlayerDelegateSheriffAttribute(devotedServantPlayer, clonedGame)) {
      return clonedGame;
    }
    return prependUpcomingPlayInGame(createGamePlaySheriffDelegates(), clonedGame);
  }
}