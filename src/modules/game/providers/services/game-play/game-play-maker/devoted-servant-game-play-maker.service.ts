import { Injectable } from "@nestjs/common";

import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { createGamePlaySheriffDelegates } from "@/modules/game/helpers/game-play/game-play.factory";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithActiveAttributeName, getPlayerWithCurrentRole, getPlayerWithIdOrThrow } from "@/modules/game/helpers/game.helpers";
import { addPlayerAttributeInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameAndSourceInGame, removePlayerAttributeByNameInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutators";
import { createStolenRoleByDevotedServantPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { canPlayerDelegateSheriffAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createCantFindPlayerWithIdUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class DevotedServantGamePlayMakerService {
  public devotedServantStealsRole(targetedPlayer: DeadPlayer, game: Game): Game {
    let clonedGame = createGame(game);
    let devotedServantPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.DEVOTED_SERVANT);
    if (!devotedServantPlayer) {
      return clonedGame;
    }
    const cantFindDevotedServantException = createCantFindPlayerWithIdUnexpectedException("devotedServantStealsRole", { gameId: game._id, playerId: devotedServantPlayer._id });
    clonedGame = removePlayerAttributeByNameAndSourceInGame(devotedServantPlayer._id, clonedGame, PlayerAttributeNames.CHARMED, RoleNames.PIED_PIPER);
    devotedServantPlayer = getPlayerWithIdOrThrow(devotedServantPlayer._id, clonedGame, cantFindDevotedServantException);
    clonedGame = this.swapTargetAndDevotedServantCurrentRoleAndSide(targetedPlayer, devotedServantPlayer, clonedGame);
    devotedServantPlayer = getPlayerWithIdOrThrow(devotedServantPlayer._id, clonedGame, cantFindDevotedServantException);
    clonedGame = this.makeDevotedServantDelegatesIfSheriff(devotedServantPlayer, clonedGame);
    clonedGame = this.applyTargetStolenRoleOutcomes(targetedPlayer, clonedGame);
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, createStolenRoleByDevotedServantPlayerAttribute());
  }

  private applyWildChildStolenRoleOutcome(game: Game): Game {
    const clonedGame = createGame(game);
    const worshipedPlayer = getPlayerWithActiveAttributeName(clonedGame, PlayerAttributeNames.WORSHIPED);
    if (!worshipedPlayer) {
      return clonedGame;
    }
    return removePlayerAttributeByNameInGame(worshipedPlayer._id, clonedGame, PlayerAttributeNames.WORSHIPED);
  }

  private applyTargetStolenRoleOutcomes(targetedPlayer: DeadPlayer, game: Game): Game {
    const roleOutcomesMethods: Partial<Record<RoleNames, (game: Game) => Game>> = { [RoleNames.WILD_CHILD]: () => this.applyWildChildStolenRoleOutcome(game) };
    const roleOutcomeMethod = roleOutcomesMethods[targetedPlayer.role.current];
    if (!roleOutcomeMethod) {
      return game;
    }
    return roleOutcomeMethod(game);
  }

  private swapTargetAndDevotedServantCurrentRoleAndSide(targetedPlayer: DeadPlayer, devotedServantPlayer: Player, game: Game): Game {
    let clonedGame = createGame(game);
    const devotedServantPlayerDataToUpdate: Partial<Player> = {
      role: {
        ...devotedServantPlayer.role,
        current: targetedPlayer.role.current,
        isRevealed: targetedPlayer.role.isRevealed,
      },
    };
    if (devotedServantPlayer.side.current !== RoleSides.WEREWOLVES) {
      devotedServantPlayerDataToUpdate.side = {
        ...devotedServantPlayer.side,
        current: targetedPlayer.side.original,
      };
    }
    const targetPlayerDataToUpdate: Partial<Player> = {
      role: {
        ...targetedPlayer.role,
        current: devotedServantPlayer.role.current,
      },
      side: {
        ...targetedPlayer.side,
        current: RoleSides.VILLAGERS,
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