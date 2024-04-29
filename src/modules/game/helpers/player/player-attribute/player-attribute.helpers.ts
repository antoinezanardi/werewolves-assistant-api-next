import { isPlayerPowerful } from "@/modules/game/helpers/player/player.helpers";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameSource } from "@/modules/game/types/game.types";
import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";

function isPlayerAttributeActive({ activeAt }: PlayerAttribute, game: Game): boolean {
  return activeAt === undefined || activeAt.turn < game.turn ||
    activeAt.turn === game.turn && (activeAt.phaseName === game.phase.name || game.phase.name === "day");
}

function getPlayerAttributeWithName({ attributes }: Player, attributeName: PlayerAttributeName): PlayerAttribute | undefined {
  return attributes.find(({ name }) => name === attributeName);
}

function doesPlayerHaveAttributeWithName(player: Player, attributeName: PlayerAttributeName): boolean {
  return !!getPlayerAttributeWithName(player, attributeName);
}

function getActivePlayerAttributeWithName({ attributes }: Player, attributeName: PlayerAttributeName, game: Game): PlayerAttribute | undefined {
  return attributes.find(attribute => attribute.name === attributeName && isPlayerAttributeActive(attribute, game));
}

function doesPlayerHaveActiveAttributeWithName(player: Player, attributeName: PlayerAttributeName, game: Game): boolean {
  return !!getActivePlayerAttributeWithName(player, attributeName, game);
}

function getPlayerAttributeWithNameAndSource({ attributes }: Player, attributeName: PlayerAttributeName, attributeSource: GameSource): PlayerAttribute | undefined {
  return attributes.find(({ name, source }) => name === attributeName && source === attributeSource);
}

function doesPlayerHaveAttributeWithNameAndSource(player: Player, attributeName: PlayerAttributeName, attributeSource: GameSource): boolean {
  return !!getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
}

function doesPlayerHaveActiveAttributeWithNameAndSource(player: Player, attributeName: PlayerAttributeName, attributeSource: GameSource, game: Game): boolean {
  const attribute = getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);

  return !!attribute && isPlayerAttributeActive(attribute, game);
}

function canPlayerDelegateSheriffAttribute(player: Player, game: Game): boolean {
  return doesPlayerHaveActiveAttributeWithName(player, "sheriff", game) && (player.role.current !== "idiot" || !isPlayerPowerful(player, game));
}

export {
  isPlayerAttributeActive,
  getPlayerAttributeWithName,
  doesPlayerHaveAttributeWithName,
  getActivePlayerAttributeWithName,
  doesPlayerHaveActiveAttributeWithName,
  getPlayerAttributeWithNameAndSource,
  doesPlayerHaveAttributeWithNameAndSource,
  doesPlayerHaveActiveAttributeWithNameAndSource,
  canPlayerDelegateSheriffAttribute,
};