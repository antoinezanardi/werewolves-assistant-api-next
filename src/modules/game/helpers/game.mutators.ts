import type { Types } from "mongoose";

import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";
import type { GameSource } from "@/modules/game/types/game.types";
import { createGameAdditionalCard } from "@/modules/game/helpers/game-additional-card/game-additional-card.factory";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithId } from "@/modules/game/helpers/game.helpers";
import { createPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

function updatePlayerInGame(playerId: Types.ObjectId, playerDataToUpdate: Partial<Player>, game: Game): Game {
  const clonedGame = createGame(game);
  const playerIdx = clonedGame.players.findIndex(player => player._id.equals(playerId));
  if (playerIdx !== -1) {
    const clonedPlayer = createPlayer(clonedGame.players[playerIdx]);
    clonedGame.players.splice(playerIdx, 1, createPlayer(Object.assign(clonedPlayer, playerDataToUpdate)));
  }
  return clonedGame;
}

function addPlayerAttributeInGame(playerId: Types.ObjectId, game: Game, attribute: PlayerAttribute): Game {
  const clonedGame = createGame(game);
  const player = getPlayerWithId(clonedGame, playerId);
  if (!player) {
    return clonedGame;
  }
  player.attributes.push(createPlayerAttribute(attribute));
  return updatePlayerInGame(playerId, player, clonedGame);
}

function addPlayersAttributeInGame(playerIds: Types.ObjectId[], game: Game, attribute: PlayerAttribute): Game {
  const clonedGame = createGame(game);
  clonedGame.players = clonedGame.players.map(player => {
    if (playerIds.find(playerId => playerId.equals(player._id))) {
      player.attributes.push(createPlayerAttribute(attribute));
    }
    return player;
  });
  return clonedGame;
}

function removePlayerAttributeByNameInGame(playerId: Types.ObjectId, game: Game, attributeName: PlayerAttributeName): Game {
  const clonedGame = createGame(game);
  const player = getPlayerWithId(clonedGame, playerId);
  if (!player) {
    return clonedGame;
  }
  player.attributes = player.attributes.filter(({ name }) => name !== attributeName);
  return updatePlayerInGame(playerId, player, clonedGame);
}

function removePlayerAttributeByNameAndSourceInGame(playerId: Types.ObjectId, game: Game, attributeName: PlayerAttributeName, attributeSource: GameSource): Game {
  const clonedGame = createGame(game);
  const player = getPlayerWithId(clonedGame, playerId);
  if (!player) {
    return clonedGame;
  }
  player.attributes = player.attributes.filter(({ name, source }) => name !== attributeName || source !== attributeSource);
  return updatePlayerInGame(playerId, player, clonedGame);
}

function prependUpcomingPlayInGame(gamePlay: GamePlay, game: Game): Game {
  const clonedGame = createGame(game);
  clonedGame.upcomingPlays.unshift(gamePlay);
  return clonedGame;
}

function appendUpcomingPlayInGame(gamePlay: GamePlay, game: Game): Game {
  const clonedGame = createGame(game);
  clonedGame.upcomingPlays.push(gamePlay);
  return clonedGame;
}

function updateAdditionalCardInGame(cardId: Types.ObjectId, cardDataToUpdate: Partial<GameAdditionalCard>, game: Game): Game {
  const clonedGame = createGame(game);
  if (!clonedGame.additionalCards) {
    return clonedGame;
  }
  const cardIdx = clonedGame.additionalCards.findIndex(card => card._id.equals(cardId));
  if (cardIdx !== -1) {
    const clonedCard = createGameAdditionalCard(clonedGame.additionalCards[cardIdx]);
    clonedGame.additionalCards.splice(cardIdx, 1, createGameAdditionalCard(Object.assign(clonedCard, cardDataToUpdate)));
  }
  return clonedGame;
}

export {
  updatePlayerInGame,
  addPlayerAttributeInGame,
  addPlayersAttributeInGame,
  removePlayerAttributeByNameInGame,
  removePlayerAttributeByNameAndSourceInGame,
  prependUpcomingPlayInGame,
  appendUpcomingPlayInGame,
  updateAdditionalCardInGame,
};