import { ROLE_SIDES } from "../../../role/enums/role.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../enums/player.enum";
import type { Game } from "../../schemas/game.schema";
import type { Player } from "../../schemas/player/player.schema";
import { doesPlayerHaveActiveAttributeWithName } from "./player-attribute/player-attribute.helper";

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