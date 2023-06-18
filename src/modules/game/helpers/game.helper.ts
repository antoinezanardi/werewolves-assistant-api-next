import { cloneDeep } from "lodash";
import type { Types } from "mongoose";
import { createCantFindPlayerUnexpectedException } from "../../../shared/exception/helpers/unexpected-exception.factory";
import { ROLE_NAMES, ROLE_SIDES } from "../../role/enums/role.enum";
import type { CreateGamePlayerDto } from "../dto/create-game/create-game-player/create-game-player.dto";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../enums/player.enum";
import type { GameAdditionalCard } from "../schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "../schemas/game.schema";
import type { Player } from "../schemas/player/player.schema";
import type { GameSource, GetNearestPlayerOptions } from "../types/game.type";
import { doesPlayerHaveAttribute } from "./player/player.helper";

function getPlayerDtoWithRole(players: CreateGamePlayerDto[], role: ROLE_NAMES): CreateGamePlayerDto | undefined {
  return cloneDeep(players.find(player => player.role.name === role));
}

function getPlayerWithCurrentRole(players: Player[], role: ROLE_NAMES): Player | undefined {
  return cloneDeep(players.find(player => player.role.current === role));
}

function getPlayersWithCurrentRole(players: Player[], role: ROLE_NAMES): Player[] {
  return cloneDeep(players.filter(player => player.role.current === role));
}

function getPlayersWithCurrentSide(players: Player[], side: ROLE_SIDES): Player[] {
  return cloneDeep(players.filter(player => player.side.current === side));
}

function getPlayerWithId(players: Player[], id: Types.ObjectId): Player | undefined {
  return cloneDeep(players.find(({ _id }) => _id.toString() === id.toString()));
}

function getPlayerWithIdOrThrow(playerId: Types.ObjectId, game: Game, exception: Error): Player {
  const player = getPlayerWithId(game.players, playerId);
  if (!player) {
    throw exception;
  }
  return cloneDeep(player);
}

function getAdditionalCardWithId(cards: GameAdditionalCard[] | undefined, id: Types.ObjectId): GameAdditionalCard | undefined {
  return cloneDeep(cards?.find(({ _id }) => _id.toString() === id.toString()));
}

function areAllWerewolvesAlive(players: Player[]): boolean {
  const werewolfPlayers = getPlayersWithCurrentSide(players, ROLE_SIDES.WEREWOLVES);
  return werewolfPlayers.length > 0 && werewolfPlayers.every(werewolf => werewolf.isAlive);
}

function areAllVillagersAlive(players: Player[]): boolean {
  const villagerPlayers = getPlayersWithCurrentSide(players, ROLE_SIDES.VILLAGERS);
  return villagerPlayers.length > 0 && villagerPlayers.every(villager => villager.isAlive);
}

function areAllPlayersDead(players: Player[]): boolean {
  return players.length > 0 && players.every(({ isAlive }) => !isAlive);
}

function getPlayerWithAttribute(players: Player[], attribute: PLAYER_ATTRIBUTE_NAMES): Player | undefined {
  return cloneDeep(players.find(player => doesPlayerHaveAttribute(player, attribute)));
}

function getPlayersWithAttribute(players: Player[], attribute: PLAYER_ATTRIBUTE_NAMES): Player[] {
  return cloneDeep(players.filter(player => doesPlayerHaveAttribute(player, attribute)));
}

function getAlivePlayers(players: Player[]): Player[] {
  return cloneDeep(players.filter(player => player.isAlive));
}

function getAliveVillagerSidedPlayers(players: Player[]): Player[] {
  return cloneDeep(players.filter(player => player.isAlive && player.side.current === ROLE_SIDES.VILLAGERS));
}

function getAliveWerewolfSidedPlayers(players: Player[]): Player[] {
  return cloneDeep(players.filter(player => player.isAlive && player.side.current === ROLE_SIDES.WEREWOLVES));
}

function getLeftToCharmByPiedPiperPlayers(players: Player[]): Player[] {
  return cloneDeep(players.filter(player => player.isAlive && !doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.CHARMED) && player.role.current !== ROLE_NAMES.PIED_PIPER));
}

function getGroupOfPlayers(players: Player[], group: PLAYER_GROUPS): Player[] {
  if (group === PLAYER_GROUPS.ALL) {
    return cloneDeep(players);
  }
  if (group === PLAYER_GROUPS.LOVERS) {
    return cloneDeep(getPlayersWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.IN_LOVE));
  }
  if (group === PLAYER_GROUPS.CHARMED) {
    return cloneDeep(getPlayersWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.CHARMED));
  }
  if (group === PLAYER_GROUPS.VILLAGERS) {
    return cloneDeep(getPlayersWithCurrentSide(players, ROLE_SIDES.VILLAGERS));
  }
  return cloneDeep(getPlayersWithCurrentSide(players, ROLE_SIDES.WEREWOLVES));
}

function isGameSourceRole(source: GameSource): source is ROLE_NAMES {
  return Object.values(ROLE_NAMES).includes(source as ROLE_NAMES);
}

function isGameSourceGroup(source: GameSource): source is PLAYER_GROUPS {
  return Object.values(PLAYER_GROUPS).includes(source as PLAYER_GROUPS);
}

function getNonexistentPlayerId(players: Player[], candidateIds?: Types.ObjectId[]): Types.ObjectId | undefined {
  return candidateIds?.find(candidateId => !getPlayerWithId(players, candidateId));
}

function getNonexistentPlayer(players: Player[], candidatePlayers?: Player[]): Player | undefined {
  return cloneDeep(candidatePlayers?.find(candidatePlayer => !getPlayerWithId(players, candidatePlayer._id)));
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
  const alivePlayers = getAlivePlayers(game.players);
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
    if (checkingNeighbor.position !== player.position && (!options.playerSide || checkingNeighbor.side.current === options.playerSide)) {
      return cloneDeep(checkingNeighbor);
    }
    currentIndex += indexHeading;
    count++;
  }
}

export {
  getPlayerDtoWithRole,
  getPlayerWithCurrentRole,
  getPlayersWithCurrentRole,
  getPlayersWithCurrentSide,
  getPlayerWithId,
  getPlayerWithIdOrThrow,
  getAdditionalCardWithId,
  areAllWerewolvesAlive,
  areAllVillagersAlive,
  areAllPlayersDead,
  getPlayerWithAttribute,
  getPlayersWithAttribute,
  getAlivePlayers,
  getAliveVillagerSidedPlayers,
  getAliveWerewolfSidedPlayers,
  getLeftToCharmByPiedPiperPlayers,
  getGroupOfPlayers,
  isGameSourceRole,
  isGameSourceGroup,
  getNonexistentPlayerId,
  getNonexistentPlayer,
  getFoxSniffedPlayers,
  getNearestAliveNeighbor,
};