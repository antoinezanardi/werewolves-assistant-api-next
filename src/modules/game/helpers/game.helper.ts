
import type { Types } from "mongoose";

import type { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { GAME_PLAY_ACTIONS } from "@/modules/game/enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "@/modules/game/enums/player.enum";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameSource, GetNearestPlayerOptions } from "@/modules/game/types/game.type";
import { ROLE_NAMES, ROLE_SIDES } from "@/modules/role/enums/role.enum";

import { createCantFindPlayerUnexpectedException, createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

function getPlayerDtoWithRole(game: CreateGameDto, role: ROLE_NAMES): CreateGamePlayerDto | undefined {
  return game.players.find(player => player.role.name === role);
}

function getPlayerWithCurrentRole(game: Game, role: ROLE_NAMES): Player | undefined {
  return game.players.find(player => player.role.current === role);
}

function getPlayersWithCurrentRole(game: Game, role: ROLE_NAMES): Player[] {
  return game.players.filter(player => player.role.current === role);
}

function getPlayersWithCurrentSide(game: Game, side: ROLE_SIDES): Player[] {
  return game.players.filter(player => player.side.current === side);
}

function getPlayerWithId(game: Game, id: Types.ObjectId): Player | undefined {
  return game.players.find(({ _id }) => _id.toString() === id.toString());
}

function getPlayerWithIdOrThrow(playerId: Types.ObjectId, game: Game, exception: Error): Player {
  const player = getPlayerWithId(game, playerId);
  if (!player) {
    throw exception;
  }
  return player;
}

function getPlayerWithName(game: Game, playerName: string): Player | undefined {
  return game.players.find(({ name }) => name.toString() === playerName.toString());
}

function getPlayerWithNameOrThrow(playerName: string, game: Game, exception: Error): Player {
  const player = getPlayerWithName(game, playerName);
  if (!player) {
    throw exception;
  }
  return player;
}

function getAdditionalCardWithId(cards: GameAdditionalCard[] | undefined, id: Types.ObjectId): GameAdditionalCard | undefined {
  return cards?.find(({ _id }) => _id.toString() === id.toString());
}

function areAllWerewolvesAlive(game: Game): boolean {
  const werewolfPlayers = getPlayersWithCurrentSide(game, ROLE_SIDES.WEREWOLVES);
  return werewolfPlayers.length > 0 && werewolfPlayers.every(werewolf => werewolf.isAlive);
}

function areAllVillagersAlive(game: Game): boolean {
  const villagerPlayers = getPlayersWithCurrentSide(game, ROLE_SIDES.VILLAGERS);
  return villagerPlayers.length > 0 && villagerPlayers.every(villager => villager.isAlive);
}

function areAllPlayersDead(game: Game): boolean {
  return game.players.length > 0 && game.players.every(({ isAlive }) => !isAlive);
}

function getPlayerWithActiveAttributeName(game: Game, attributeName: PLAYER_ATTRIBUTE_NAMES): Player | undefined {
  return game.players.find(player => doesPlayerHaveActiveAttributeWithName(player, attributeName, game));
}

function getPlayersWithActiveAttributeName(game: Game, attribute: PLAYER_ATTRIBUTE_NAMES): Player[] {
  return game.players.filter(player => doesPlayerHaveActiveAttributeWithName(player, attribute, game));
}

function getAlivePlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive);
}

function getAliveVillagerSidedPlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === ROLE_SIDES.VILLAGERS);
}

function getAliveWerewolfSidedPlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === ROLE_SIDES.WEREWOLVES);
}

function getLeftToCharmByPiedPiperPlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && !doesPlayerHaveActiveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.CHARMED, game) &&
    player.role.current !== ROLE_NAMES.PIED_PIPER);
}

function getLeftToEatByWerewolvesPlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === ROLE_SIDES.VILLAGERS &&
    !doesPlayerHaveActiveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.EATEN, game));
}

function getLeftToEatByWhiteWerewolfPlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === ROLE_SIDES.WEREWOLVES && player.role.current !== ROLE_NAMES.WHITE_WEREWOLF);
}

function getGroupOfPlayers(game: Game, group: PLAYER_GROUPS): Player[] {
  if (group === PLAYER_GROUPS.ALL) {
    return game.players;
  }
  if (group === PLAYER_GROUPS.LOVERS) {
    return getPlayersWithActiveAttributeName(game, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
  }
  if (group === PLAYER_GROUPS.CHARMED) {
    return getPlayersWithActiveAttributeName(game, PLAYER_ATTRIBUTE_NAMES.CHARMED);
  }
  if (group === PLAYER_GROUPS.VILLAGERS) {
    return getPlayersWithCurrentSide(game, ROLE_SIDES.VILLAGERS);
  }
  return getPlayersWithCurrentSide(game, ROLE_SIDES.WEREWOLVES);
}

function isGameSourceRole(source: GameSource): source is ROLE_NAMES {
  return Object.values(ROLE_NAMES).includes(source as ROLE_NAMES);
}

function isGameSourceGroup(source: GameSource): source is PLAYER_GROUPS {
  return Object.values(PLAYER_GROUPS).includes(source as PLAYER_GROUPS);
}

function getNonexistentPlayerId(game: Game, candidateIds?: Types.ObjectId[]): Types.ObjectId | undefined {
  return candidateIds?.find(candidateId => !getPlayerWithId(game, candidateId));
}

function getNonexistentPlayer(game: Game, candidatePlayers?: Player[]): Player | undefined {
  return candidatePlayers?.find(candidatePlayer => !getPlayerWithId(game, candidatePlayer._id));
}

function getFoxSniffedPlayers(sniffedTargetId: Types.ObjectId, game: Game): Player[] {
  const cantFindPlayerException = createCantFindPlayerUnexpectedException("getFoxSniffedTargets", { gameId: game._id, playerId: sniffedTargetId });
  const sniffedTarget = getPlayerWithIdOrThrow(sniffedTargetId, game, cantFindPlayerException);
  const leftAliveNeighbor = getNearestAliveNeighbor(sniffedTarget._id, game, { direction: "left" });
  const rightAliveNeighbor = getNearestAliveNeighbor(sniffedTarget._id, game, { direction: "right" });
  const sniffedTargets = [leftAliveNeighbor, sniffedTarget, rightAliveNeighbor].filter((player): player is Player => !!player);
  return sniffedTargets.reduce<Player[]>((acc, target) => {
    if (!acc.some(uniqueTarget => uniqueTarget._id.toString() === target._id.toString())) {
      return [...acc, target];
    }
    return acc;
  }, []);
}

function getNearestAliveNeighbor(playerId: Types.ObjectId, game: Game, options: GetNearestPlayerOptions): Player | undefined {
  const alivePlayers = getAlivePlayers(game);
  alivePlayers.sort((a, b) => a.position - b.position);
  const cantFindPlayerException = createCantFindPlayerUnexpectedException("getNearestAliveNeighbor", { gameId: game._id, playerId });
  const player = getPlayerWithIdOrThrow(playerId, game, cantFindPlayerException);
  const indexHeading = options.direction === "left" ? -1 : 1;
  let currentIndex = player.position + indexHeading;
  let count = 0;
  while (count < alivePlayers.length) {
    if (currentIndex < 0) {
      currentIndex = alivePlayers.length - 1;
    } else if (currentIndex >= alivePlayers.length) {
      currentIndex = 0;
    }
    const checkingNeighbor = alivePlayers[currentIndex];
    if (checkingNeighbor.position !== player.position && (options.playerSide === undefined || checkingNeighbor.side.current === options.playerSide)) {
      return checkingNeighbor;
    }
    currentIndex += indexHeading;
    count++;
  }
}

function getExpectedPlayersToPlay(game: Game): Player[] {
  const { currentPlay } = game;
  const mustIncludeDeadPlayersGamePlayActions = [GAME_PLAY_ACTIONS.SHOOT, GAME_PLAY_ACTIONS.BAN_VOTING, GAME_PLAY_ACTIONS.DELEGATE];
  let expectedPlayersToPlay: Player[] = [];
  if (currentPlay === null) {
    throw createNoCurrentGamePlayUnexpectedException("getExpectedPlayersToPlay", { gameId: game._id });
  }
  if (isGameSourceGroup(currentPlay.source.name)) {
    expectedPlayersToPlay = getGroupOfPlayers(game, currentPlay.source.name);
  } else if (isGameSourceRole(currentPlay.source.name)) {
    expectedPlayersToPlay = getPlayersWithCurrentRole(game, currentPlay.source.name);
  } else {
    expectedPlayersToPlay = getPlayersWithActiveAttributeName(game, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
  }
  if (!mustIncludeDeadPlayersGamePlayActions.includes(currentPlay.action)) {
    expectedPlayersToPlay = expectedPlayersToPlay.filter(player => player.isAlive);
  }
  return expectedPlayersToPlay.map(player => createPlayer(player));
}

export {
  getPlayerDtoWithRole,
  getPlayerWithCurrentRole,
  getPlayersWithCurrentRole,
  getPlayersWithCurrentSide,
  getPlayerWithId,
  getPlayerWithIdOrThrow,
  getPlayerWithName,
  getPlayerWithNameOrThrow,
  getAdditionalCardWithId,
  areAllWerewolvesAlive,
  areAllVillagersAlive,
  areAllPlayersDead,
  getPlayerWithActiveAttributeName,
  getPlayersWithActiveAttributeName,
  getAlivePlayers,
  getAliveVillagerSidedPlayers,
  getAliveWerewolfSidedPlayers,
  getLeftToCharmByPiedPiperPlayers,
  getLeftToEatByWerewolvesPlayers,
  getLeftToEatByWhiteWerewolfPlayers,
  getGroupOfPlayers,
  isGameSourceRole,
  isGameSourceGroup,
  getNonexistentPlayerId,
  getNonexistentPlayer,
  getFoxSniffedPlayers,
  getNearestAliveNeighbor,
  getExpectedPlayersToPlay,
};