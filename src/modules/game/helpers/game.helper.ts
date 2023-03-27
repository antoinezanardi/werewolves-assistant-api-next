import { ROLE_NAMES, ROLE_SIDES } from "../../role/enums/role.enum";
import type { CreateGamePlayerDto } from "../dto/create-game/create-game-player/create-game-player.dto";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../enums/player.enum";
import type { Player } from "../schemas/player/player.schema";
import type { GameSource } from "../types/game.type";
import { doesPlayerHaveAttribute } from "./player/player.helper";

function getPlayerDtoWithRole(players: CreateGamePlayerDto[], role: ROLE_NAMES): CreateGamePlayerDto | undefined {
  return players.find(player => player.role.name === role);
}

function getPlayerWithCurrentRole(players: Player[], role: ROLE_NAMES): Player | undefined {
  return players.find(player => player.role.current === role);
}

function getPlayersWithCurrentRole(players: Player[], role: ROLE_NAMES): Player[] {
  return players.filter(player => player.role.current === role);
}

function getPlayersWithCurrentSide(players: Player[], side: ROLE_SIDES): Player[] {
  return players.filter(player => player.side.current === side);
}

function areAllWerewolvesAlive(players: Player[]): boolean {
  const werewolfPlayers = getPlayersWithCurrentSide(players, ROLE_SIDES.WEREWOLVES);
  return werewolfPlayers.length > 0 && werewolfPlayers.every(werewolf => werewolf.isAlive);
}

function areAllVillagersAlive(players: Player[]): boolean {
  const villagerPlayers = getPlayersWithCurrentSide(players, ROLE_SIDES.VILLAGERS);
  return villagerPlayers.length > 0 && villagerPlayers.every(villager => villager.isAlive);
}

function getPlayersWithAttribute(players: Player[], attribute: PLAYER_ATTRIBUTE_NAMES): Player[] {
  return players.filter(player => doesPlayerHaveAttribute(player, attribute));
}

function getGroupOfPlayers(players: Player[], group: PLAYER_GROUPS): Player[] {
  if (group === PLAYER_GROUPS.ALL) {
    return players;
  } else if (group === PLAYER_GROUPS.LOVERS) {
    return getPlayersWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
  } else if (group === PLAYER_GROUPS.CHARMED) {
    return getPlayersWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.CHARMED);
  } else if (group === PLAYER_GROUPS.VILLAGERS) {
    return getPlayersWithCurrentSide(players, ROLE_SIDES.VILLAGERS);
  }
  return getPlayersWithCurrentSide(players, ROLE_SIDES.WEREWOLVES);
}

function isGameSourceRole(source: GameSource): source is ROLE_NAMES {
  return Object.values(ROLE_NAMES).includes(source as ROLE_NAMES);
}

function isGameSourceGroup(source: GameSource): source is PLAYER_GROUPS {
  return Object.values(PLAYER_GROUPS).includes(source as PLAYER_GROUPS);
}

export {
  getPlayerDtoWithRole,
  getPlayerWithCurrentRole,
  getPlayersWithCurrentRole,
  getPlayersWithCurrentSide,
  areAllWerewolvesAlive,
  areAllVillagersAlive,
  getPlayersWithAttribute,
  getGroupOfPlayers,
  isGameSourceRole,
  isGameSourceGroup,
};