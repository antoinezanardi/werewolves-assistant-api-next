import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

function isPlayerPowerful(player: Player, game: Game): boolean {
  return !doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.POWERLESS, game);
}

function isPlayerAliveAndPowerful(player: Player, game: Game): boolean {
  return player.isAlive && isPlayerPowerful(player, game);
}

function isPlayerOnWerewolvesSide(player: Player): boolean {
  return player.side.current === RoleSides.WEREWOLVES;
}

function isPlayerOnVillagersSide(player: Player): boolean {
  return player.side.current === RoleSides.VILLAGERS;
}

function isPlayerPowerlessOnWerewolvesSide(player: Player, game: Game): boolean {
  const { prejudicedManipulator, piedPiper, actor } = game.options.roles;
  const { current: roleName } = player.role;
  return roleName === RoleNames.PREJUDICED_MANIPULATOR && prejudicedManipulator.isPowerlessOnWerewolvesSide ||
      roleName === RoleNames.PIED_PIPER && piedPiper.isPowerlessOnWerewolvesSide ||
      roleName === RoleNames.ACTOR && actor.isPowerlessOnWerewolvesSide;
}

export {
  isPlayerPowerful,
  isPlayerAliveAndPowerful,
  isPlayerOnWerewolvesSide,
  isPlayerOnVillagersSide,
  isPlayerPowerlessOnWerewolvesSide,
};