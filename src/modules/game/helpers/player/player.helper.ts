import { ROLE_SIDES } from "../../../role/enums/role.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../enums/player.enum";
import type { Player } from "../../schemas/player/player.schema";

function doesPlayerHaveAttribute({ attributes }: Player, attributeName: PLAYER_ATTRIBUTE_NAMES): boolean {
  return attributes.findIndex(({ name }) => name === attributeName) !== -1;
}

function canPiedPiperCharm(piedPiperPlayer: Player, isPowerlessIfInfected: boolean): boolean {
  return isPlayerAliveAndPowerful(piedPiperPlayer) && (!isPowerlessIfInfected || piedPiperPlayer.side.current === ROLE_SIDES.VILLAGERS);
}

function isPlayerPowerful(player: Player): boolean {
  return !doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS);
}

function isPlayerAliveAndPowerful(player: Player): boolean {
  return player.isAlive && isPlayerPowerful(player);
}

function isPlayerOnWerewolvesSide(player: Player): boolean {
  return player.side.current === ROLE_SIDES.WEREWOLVES;
}

function isPlayerOnVillagersSide(player: Player): boolean {
  return player.side.current === ROLE_SIDES.VILLAGERS;
}

export {
  doesPlayerHaveAttribute,
  canPiedPiperCharm,
  isPlayerPowerful,
  isPlayerAliveAndPowerful,
  isPlayerOnWerewolvesSide,
  isPlayerOnVillagersSide,
};