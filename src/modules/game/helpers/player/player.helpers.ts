import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

function isPlayerPowerful(player: Player, game: Game): boolean {
  return !doesPlayerHaveActiveAttributeWithName(player, "powerless", game);
}

function isPlayerAliveAndPowerful(player: Player, game: Game): boolean {
  return player.isAlive && isPlayerPowerful(player, game);
}

function isPlayerOnWerewolvesSide(player: Player): boolean {
  return player.side.current === "werewolves";
}

function isPlayerOnVillagersSide(player: Player): boolean {
  return player.side.current === "villagers";
}

function isPlayerPowerlessOnWerewolvesSide(player: Player, game: Game): boolean {
  const { prejudicedManipulator, piedPiper, actor } = game.options.roles;
  const { current: roleName } = player.role;
  return roleName === "prejudiced-manipulator" && prejudicedManipulator.isPowerlessOnWerewolvesSide ||
      roleName === "pied-piper" && piedPiper.isPowerlessOnWerewolvesSide ||
      roleName === "actor" && actor.isPowerlessOnWerewolvesSide;
}

export {
  isPlayerPowerful,
  isPlayerAliveAndPowerful,
  isPlayerOnWerewolvesSide,
  isPlayerOnVillagersSide,
  isPlayerPowerlessOnWerewolvesSide,
};