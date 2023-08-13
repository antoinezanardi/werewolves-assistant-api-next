import type { Types } from "mongoose";
import type { PLAYER_ATTRIBUTE_NAMES } from "../enums/player.enum";
import type { GamePlay } from "../schemas/game-play/game-play.schema";
import type { Game } from "../schemas/game.schema";
import type { PlayerAttribute } from "../schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "../schemas/player/player.schema";
import { createGame } from "./game.factory";
import { getPlayerWithId } from "./game.helper";
import { createPlayerAttribute } from "./player/player-attribute/player-attribute.factory";
import { createPlayer } from "./player/player.factory";

function updatePlayerInGame(playerId: Types.ObjectId, playerDataToUpdate: Partial<Player>, game: Game): Game {
  const clonedGame = createGame(game);
  const playerIdx = clonedGame.players.findIndex(player => player._id.toString() === playerId.toString());
  if (playerIdx !== -1) {
    const clonedPlayer = createPlayer(clonedGame.players[playerIdx]);
    clonedGame.players.splice(playerIdx, 1, createPlayer(Object.assign(clonedPlayer, playerDataToUpdate)));
  }
  return clonedGame;
}

function addPlayerAttributeInGame(playerId: Types.ObjectId, game: Game, attribute: PlayerAttribute): Game {
  const clonedGame = createGame(game);
  const player = getPlayerWithId(clonedGame.players, playerId);
  if (!player) {
    return clonedGame;
  }
  player.attributes.push(createPlayerAttribute(attribute));
  return updatePlayerInGame(playerId, player, clonedGame);
}

function addPlayersAttributeInGame(playerIds: Types.ObjectId[], game: Game, attribute: PlayerAttribute): Game {
  const clonedGame = createGame(game);
  clonedGame.players = clonedGame.players.map(player => {
    if (playerIds.includes(player._id)) {
      player.attributes.push(createPlayerAttribute(attribute));
    }
    return player;
  });
  return clonedGame;
}

function removePlayerAttributeByNameInGame(playerId: Types.ObjectId, game: Game, attributeName: PLAYER_ATTRIBUTE_NAMES): Game {
  const clonedGame = createGame(game);
  const player = getPlayerWithId(clonedGame.players, playerId);
  if (!player) {
    return clonedGame;
  }
  player.attributes = player.attributes.filter(({ name }) => name !== attributeName);
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

export {
  updatePlayerInGame,
  addPlayerAttributeInGame,
  addPlayersAttributeInGame,
  removePlayerAttributeByNameInGame,
  prependUpcomingPlayInGame,
  appendUpcomingPlayInGame,
};