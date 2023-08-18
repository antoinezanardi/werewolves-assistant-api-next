import { GAME_PHASES } from "../../../enums/game.enum";
import type { PLAYER_ATTRIBUTE_NAMES } from "../../../enums/player.enum";
import type { Game } from "../../../schemas/game.schema";
import type { PlayerAttribute } from "../../../schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "../../../schemas/player/player.schema";
import type { GameSource } from "../../../types/game.type";

function isPlayerAttributeActive({ activeAt }: PlayerAttribute, game: Game): boolean {
  return activeAt === undefined || activeAt.turn < game.turn ||
    activeAt.turn === game.turn && (activeAt.phase === game.phase || game.phase === GAME_PHASES.DAY);
}

function getPlayerAttributeWithName({ attributes }: Player, attributeName: PLAYER_ATTRIBUTE_NAMES): PlayerAttribute | undefined {
  return attributes.find(({ name }) => name === attributeName);
}

function doesPlayerHaveAttributeWithName(player: Player, attributeName: PLAYER_ATTRIBUTE_NAMES): boolean {
  return !!getPlayerAttributeWithName(player, attributeName);
}

function getActivePlayerAttributeWithName({ attributes }: Player, attributeName: PLAYER_ATTRIBUTE_NAMES, game: Game): PlayerAttribute | undefined {
  return attributes.find(attribute => attribute.name === attributeName && isPlayerAttributeActive(attribute, game));
}

function doesPlayerHaveActiveAttributeWithName(player: Player, attributeName: PLAYER_ATTRIBUTE_NAMES, game: Game): boolean {
  return !!getActivePlayerAttributeWithName(player, attributeName, game);
}

function getPlayerAttributeWithNameAndSource({ attributes }: Player, attributeName: PLAYER_ATTRIBUTE_NAMES, attributeSource: GameSource): PlayerAttribute | undefined {
  return attributes.find(({ name, source }) => name === attributeName && source === attributeSource);
}

function doesPlayerHaveAttributeWithNameAndSource(player: Player, attributeName: PLAYER_ATTRIBUTE_NAMES, attributeSource: GameSource): boolean {
  return !!getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
}

export {
  isPlayerAttributeActive,
  getPlayerAttributeWithName,
  doesPlayerHaveAttributeWithName,
  getActivePlayerAttributeWithName,
  doesPlayerHaveActiveAttributeWithName,
  getPlayerAttributeWithNameAndSource,
  doesPlayerHaveAttributeWithNameAndSource,
};