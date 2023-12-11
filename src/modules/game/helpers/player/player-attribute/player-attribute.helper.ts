import { GamePhases } from "@/modules/game/enums/game.enum";
import type { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameSource } from "@/modules/game/types/game.type";

function isPlayerAttributeActive({ activeAt }: PlayerAttribute, game: Game): boolean {
  return activeAt === undefined || activeAt.turn < game.turn ||
    activeAt.turn === game.turn && (activeAt.phase === game.phase || game.phase === GamePhases.DAY);
}

function getPlayerAttributeWithName({ attributes }: Player, attributeName: PlayerAttributeNames): PlayerAttribute | undefined {
  return attributes.find(({ name }) => name === attributeName);
}

function doesPlayerHaveAttributeWithName(player: Player, attributeName: PlayerAttributeNames): boolean {
  return !!getPlayerAttributeWithName(player, attributeName);
}

function getActivePlayerAttributeWithName({ attributes }: Player, attributeName: PlayerAttributeNames, game: Game): PlayerAttribute | undefined {
  return attributes.find(attribute => attribute.name === attributeName && isPlayerAttributeActive(attribute, game));
}

function doesPlayerHaveActiveAttributeWithName(player: Player, attributeName: PlayerAttributeNames, game: Game): boolean {
  return !!getActivePlayerAttributeWithName(player, attributeName, game);
}

function getPlayerAttributeWithNameAndSource({ attributes }: Player, attributeName: PlayerAttributeNames, attributeSource: GameSource): PlayerAttribute | undefined {
  return attributes.find(({ name, source }) => name === attributeName && source === attributeSource);
}

function doesPlayerHaveAttributeWithNameAndSource(player: Player, attributeName: PlayerAttributeNames, attributeSource: GameSource): boolean {
  return !!getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
}

function doesPlayerHaveActiveAttributeWithNameAndSource(player: Player, attributeName: PlayerAttributeNames, attributeSource: GameSource, game: Game): boolean {
  const attribute = getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
  return !!attribute && isPlayerAttributeActive(attribute, game);
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
};