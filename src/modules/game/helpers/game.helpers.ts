import type { Types } from "mongoose";

import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import type { RoleName, RoleSide } from "@/modules/role/types/role.types";
import { PLAYER_GROUPS } from "@/modules/game/constants/player/player.constants";
import type { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GamePlayAction } from "@/modules/game/types/game-play/game-play.types";
import type { GameSource, GetNearestPlayerOptions } from "@/modules/game/types/game.types";
import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";
import type { PlayerGroup } from "@/modules/game/types/player/player.types";

import { createCantFindPlayerWithIdUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

function getPlayerDtoWithRole(game: CreateGameDto, role: RoleName): CreateGamePlayerDto | undefined {
  return game.players.find(player => player.role.name === role);
}

function getPlayerWithCurrentRole(game: Game, role: RoleName): Player | undefined {
  return game.players.find(player => player.role.current === role);
}

function getPlayersWithCurrentRole(game: Game, role: RoleName): Player[] {
  return game.players.filter(player => player.role.current === role);
}

function getPlayersWithCurrentSide(game: Game, side: RoleSide): Player[] {
  return game.players.filter(player => player.side.current === side);
}

function getPlayerWithId(game: Game, id: Types.ObjectId): Player | undefined {
  return game.players.find(({ _id }) => _id.equals(id));
}

function getPlayerWithIdOrThrow(playerId: Types.ObjectId, game: Game, exception: Error): Player {
  const player = getPlayerWithId(game, playerId);
  if (!player) {
    throw exception;
  }
  return player;
}

function getPlayersWithIds(ids: Types.ObjectId[], game: Game): Player[] {
  return game.players.filter(({ _id }) => ids.some(id => id.equals(_id)));
}

function getPlayerWithName(game: Game, playerName: string): Player | undefined {
  return game.players.find(({ name }) => name === playerName);
}

function getPlayerWithNameOrThrow(playerName: string, game: Game, exception: Error): Player {
  const player = getPlayerWithName(game, playerName);
  if (!player) {
    throw exception;
  }
  return player;
}

function getAdditionalCardWithId(cards: GameAdditionalCard[] | undefined, id: Types.ObjectId): GameAdditionalCard | undefined {
  return cards?.find(({ _id }) => _id.equals(id));
}

function areAllWerewolvesAlive(game: Game): boolean {
  const werewolfPlayers = getPlayersWithCurrentSide(game, "werewolves");

  return werewolfPlayers.length > 0 && werewolfPlayers.every(werewolf => werewolf.isAlive);
}

function areAllVillagersAlive(game: Game): boolean {
  const villagerPlayers = getPlayersWithCurrentSide(game, "villagers");

  return villagerPlayers.length > 0 && villagerPlayers.every(villager => villager.isAlive);
}

function areAllPlayersDead(game: Game): boolean {
  return game.players.length > 0 && game.players.every(({ isAlive }) => !isAlive);
}

function getPlayerWithActiveAttributeName(game: Game, attributeName: PlayerAttributeName): Player | undefined {
  return game.players.find(player => doesPlayerHaveActiveAttributeWithName(player, attributeName, game));
}

function getPlayersWithActiveAttributeName(game: Game, attribute: PlayerAttributeName): Player[] {
  return game.players.filter(player => doesPlayerHaveActiveAttributeWithName(player, attribute, game));
}

function getAlivePlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive);
}

function getAliveVillagerSidedPlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === "villagers");
}

function getAliveWerewolfSidedPlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === "werewolves");
}

function getEligiblePiedPiperTargets(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && !doesPlayerHaveActiveAttributeWithName(player, "charmed", game) &&
    player.role.current !== "pied-piper");
}

function getEligibleWerewolvesTargets(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === "villagers" &&
    !doesPlayerHaveActiveAttributeWithName(player, "eaten", game));
}

function getEligibleWhiteWerewolfTargets(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && player.side.current === "werewolves" && player.role.current !== "white-werewolf");
}

function getEligibleCupidTargets(game: Game): Player[] {
  const { mustWinWithLovers: mustCupidWinWithLovers } = game.options.roles.cupid;
  const alivePlayers = getAlivePlayers(game);

  return mustCupidWinWithLovers ? alivePlayers.filter(player => player.role.current !== "cupid") : alivePlayers;
}

function getGroupOfPlayers(game: Game, group: PlayerGroup): Player[] {
  if (group === "survivors") {
    return game.players.filter(({ isAlive }) => isAlive);
  }
  if (group === "lovers") {
    return getPlayersWithActiveAttributeName(game, "in-love");
  }
  if (group === "charmed") {
    return getPlayersWithActiveAttributeName(game, "charmed");
  }
  if (group === "villagers") {
    return getPlayersWithCurrentSide(game, "villagers");
  }
  return getPlayersWithCurrentSide(game, "werewolves");
}

function isGameSourceRole(source: GameSource): source is RoleName {
  return ROLE_NAMES.includes(source as RoleName);
}

function isGameSourceGroup(source: GameSource): source is PlayerGroup {
  return PLAYER_GROUPS.includes(source as PlayerGroup);
}

function getNonexistentPlayerId(game: Game, candidateIds?: Types.ObjectId[]): Types.ObjectId | undefined {
  return candidateIds?.find(candidateId => !getPlayerWithId(game, candidateId));
}

function getNonexistentPlayer(game: Game, candidatePlayers?: Player[]): Player | undefined {
  return candidatePlayers?.find(candidatePlayer => !getPlayerWithId(game, candidatePlayer._id));
}

function getNearestAliveNeighborInSortedPlayers(seekingNeighborPlayer: Player, sortedPlayers: Player[], options: GetNearestPlayerOptions): Player | undefined {
  const indexHeading = options.direction === "left" ? -1 : 1;
  const seekingNeighborPlayerIndex = sortedPlayers.findIndex(({ _id }) => _id.equals(seekingNeighborPlayer._id));
  let currentIndex = seekingNeighborPlayerIndex + indexHeading;
  let count = 0;
  while (count < sortedPlayers.length - 1) {
    if (currentIndex < 0) {
      currentIndex = sortedPlayers.length - 1;
    } else if (currentIndex >= sortedPlayers.length) {
      currentIndex = 0;
    }
    const checkingNeighbor = sortedPlayers[currentIndex];
    if (checkingNeighbor.isAlive && (options.playerSide === undefined || checkingNeighbor.side.current === options.playerSide)) {
      return checkingNeighbor;
    }
    currentIndex += indexHeading;
    count++;
  }
}

function getNearestAliveNeighbor(playerId: Types.ObjectId, game: Game, options: GetNearestPlayerOptions): Player | undefined {
  const cantFindPlayerException = createCantFindPlayerWithIdUnexpectedException("getNearestAliveNeighbor", { gameId: game._id, playerId });
  const player = getPlayerWithIdOrThrow(playerId, game, cantFindPlayerException);
  const sortedPlayers = game.players.toSorted((a, b) => a.position - b.position);

  return getNearestAliveNeighborInSortedPlayers(player, sortedPlayers, options);
}

function getFoxSniffedPlayers(sniffedTargetId: Types.ObjectId, game: Game): Player[] {
  const cantFindPlayerException = createCantFindPlayerWithIdUnexpectedException("getFoxSniffedTargets", { gameId: game._id, playerId: sniffedTargetId });
  const sniffedTarget = getPlayerWithIdOrThrow(sniffedTargetId, game, cantFindPlayerException);
  const leftAliveNeighbor = getNearestAliveNeighbor(sniffedTarget._id, game, { direction: "left" });
  const rightAliveNeighbor = getNearestAliveNeighbor(sniffedTarget._id, game, { direction: "right" });
  const sniffedTargets = [leftAliveNeighbor, sniffedTarget, rightAliveNeighbor].filter((player): player is Player => !!player);

  return sniffedTargets.reduce<Player[]>((acc, target) => {
    if (!acc.some(uniqueTarget => uniqueTarget._id.equals(target._id))) {
      return [...acc, target];
    }
    return acc;
  }, []);
}

function getAllowedToVotePlayers(game: Game): Player[] {
  return game.players.filter(player => player.isAlive && !doesPlayerHaveActiveAttributeWithName(player, "cant-vote", game));
}

function doesGameHaveUpcomingPlaySourceAndAction(game: Game, source: GameSource, action: GamePlayAction): boolean {
  const { upcomingPlays } = game;

  return upcomingPlays.some(play => play.source.name === source && play.action === action);
}

function doesGameHaveCurrentOrUpcomingPlaySourceAndAction(game: Game, source: GameSource, action: GamePlayAction): boolean {
  const { currentPlay, upcomingPlays } = game;
  const gamePlays = currentPlay ? [currentPlay, ...upcomingPlays] : upcomingPlays;

  return gamePlays.some(play => play.source.name === source && play.action === action);
}

export {
  getPlayerDtoWithRole,
  getPlayerWithCurrentRole,
  getPlayersWithCurrentRole,
  getPlayersWithCurrentSide,
  getPlayerWithId,
  getPlayerWithIdOrThrow,
  getPlayersWithIds,
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
  getEligiblePiedPiperTargets,
  getEligibleWerewolvesTargets,
  getEligibleWhiteWerewolfTargets,
  getEligibleCupidTargets,
  getGroupOfPlayers,
  isGameSourceRole,
  isGameSourceGroup,
  getNonexistentPlayerId,
  getNonexistentPlayer,
  getFoxSniffedPlayers,
  getNearestAliveNeighbor,
  getAllowedToVotePlayers,
  doesGameHaveUpcomingPlaySourceAndAction,
  doesGameHaveCurrentOrUpcomingPlaySourceAndAction,
};