import { PLAYER_ATTRIBUTE_NAMES } from "@/modules/game/enums/player.enum";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { ROLE_SIDES } from "@/modules/role/enums/role.enum";

function canPiedPiperCharm(piedPiperPlayer: Player, game: Game): boolean {
  const { isPowerlessIfInfected } = game.options.roles.piedPiper;
  return isPlayerAliveAndPowerful(piedPiperPlayer, game) && (!isPowerlessIfInfected || piedPiperPlayer.side.current === ROLE_SIDES.VILLAGERS);
}

function isPlayerPowerful(player: Player, game: Game): boolean {
  return !doesPlayerHaveActiveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS, game);
}

function isPlayerAliveAndPowerful(player: Player, game: Game): boolean {
  return player.isAlive && isPlayerPowerful(player, game);
}

function isPlayerOnWerewolvesSide(player: Player): boolean {
  return player.side.current === ROLE_SIDES.WEREWOLVES;
}

function isPlayerOnVillagersSide(player: Player): boolean {
  return player.side.current === ROLE_SIDES.VILLAGERS;
}

export {
  canPiedPiperCharm,
  isPlayerPowerful,
  isPlayerAliveAndPowerful,
  isPlayerOnWerewolvesSide,
  isPlayerOnVillagersSide,
};