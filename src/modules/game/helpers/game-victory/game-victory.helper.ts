import { plainToInstance } from "class-transformer";
import { createNoCurrentGamePlayUnexpectedException } from "../../../../shared/exception/helpers/unexpected-exception.factory";
import { plainToInstanceDefaultOptions } from "../../../../shared/validation/constants/validation.constant";
import { ROLE_NAMES, ROLE_SIDES } from "../../../role/enums/role.enum";
import { GAME_PLAY_ACTIONS } from "../../enums/game-play.enum";
import { GAME_VICTORY_TYPES } from "../../enums/game-victory.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES } from "../../enums/player.enum";
import { GameVictory } from "../../schemas/game-victory/game-victory.schema";
import type { Game } from "../../schemas/game.schema";
import type { Player } from "../../schemas/player/player.schema";
import { areAllPlayersDead, getLeftToCharmByPiedPiperPlayers, getPlayersWithAttribute, getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "../game.helper";
import { doesPlayerHaveAttributeWithName } from "../player/player-attribute/player-attribute.helper";
import { isPlayerAliveAndPowerful } from "../player/player.helper";

function doWerewolvesWin(players: Player[]): boolean {
  const werewolvesSidedPlayers = getPlayersWithCurrentSide(players, ROLE_SIDES.WEREWOLVES);
  return werewolvesSidedPlayers.length > 0 && !players.some(({ side, isAlive }) => side.current === ROLE_SIDES.VILLAGERS && isAlive);
}

function doVillagersWin(players: Player[]): boolean {
  const villagersSidedPlayers = getPlayersWithCurrentSide(players, ROLE_SIDES.VILLAGERS);
  return villagersSidedPlayers.length > 0 && !players.some(({ side, isAlive }) => side.current === ROLE_SIDES.WEREWOLVES && isAlive);
}

function doLoversWin(players: Player[]): boolean {
  const lovers = getPlayersWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
  return lovers.length > 0 && players.every(player => {
    const isPlayerInLove = doesPlayerHaveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
    return isPlayerInLove && player.isAlive || !isPlayerInLove && !player.isAlive;
  });
}

function doesWhiteWerewolfWin(players: Player[]): boolean {
  const whiteWerewolfPlayer = getPlayerWithCurrentRole(players, ROLE_NAMES.WHITE_WEREWOLF);
  return !!whiteWerewolfPlayer && players.every(({ role, isAlive }) =>
    role.current === ROLE_NAMES.WHITE_WEREWOLF && isAlive || role.current !== ROLE_NAMES.WHITE_WEREWOLF && !isAlive);
}

function doesPiedPiperWin(game: Game): boolean {
  const { isPowerlessIfInfected } = game.options.roles.piedPiper;
  const piedPiperPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.PIED_PIPER);
  const leftToCharmPlayers = getLeftToCharmByPiedPiperPlayers(game.players);
  return !!piedPiperPlayer && isPlayerAliveAndPowerful(piedPiperPlayer) && !leftToCharmPlayers.length &&
    (!isPowerlessIfInfected || piedPiperPlayer.side.current === ROLE_SIDES.VILLAGERS);
}

function doesAngelWin(game: Game): boolean {
  const angelPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.ANGEL);
  if (!angelPlayer?.death || angelPlayer.isAlive || doesPlayerHaveAttributeWithName(angelPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS) || game.turn > 1) {
    return false;
  }
  return [PLAYER_DEATH_CAUSES.VOTE, PLAYER_DEATH_CAUSES.EATEN].includes(angelPlayer.death.cause);
}

function isGameOver(game: Game): boolean {
  const { players, upcomingPlays, currentPlay } = game;
  if (!currentPlay) {
    throw createNoCurrentGamePlayUnexpectedException("isGameOver", { gameId: game._id });
  }
  const isShootPlayIncoming = !!upcomingPlays.find(({ action, source }) => action === GAME_PLAY_ACTIONS.SHOOT && source === ROLE_NAMES.HUNTER);
  return areAllPlayersDead(players) || currentPlay.action !== GAME_PLAY_ACTIONS.SHOOT && !isShootPlayIncoming &&
    (doWerewolvesWin(players) || doVillagersWin(players) ||
    doLoversWin(players) || doesWhiteWerewolfWin(players) || doesPiedPiperWin(game) || doesAngelWin(game));
}

function generateGameVictoryData(game: Game): GameVictory | undefined {
  if (areAllPlayersDead(game.players)) {
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.NONE }, plainToInstanceDefaultOptions);
  }
  if (doesAngelWin(game)) {
    const angelPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.ANGEL);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.ANGEL, winners: [angelPlayer] }, plainToInstanceDefaultOptions);
  }
  if (doLoversWin(game.players)) {
    const inLovePlayers = getPlayersWithAttribute(game.players, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.LOVERS, winners: inLovePlayers }, plainToInstanceDefaultOptions);
  }
  if (doesPiedPiperWin(game)) {
    const piedPiperPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.PIED_PIPER);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.PIED_PIPER, winners: [piedPiperPlayer] }, plainToInstanceDefaultOptions);
  }
  if (doesWhiteWerewolfWin(game.players)) {
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.WHITE_WEREWOLF, winners: [whiteWerewolfPlayer] }, plainToInstanceDefaultOptions);
  }
  if (doWerewolvesWin(game.players)) {
    const werewolvesSidePlayers = getPlayersWithCurrentSide(game.players, ROLE_SIDES.WEREWOLVES);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.WEREWOLVES, winners: werewolvesSidePlayers }, plainToInstanceDefaultOptions);
  }
  if (doVillagersWin(game.players)) {
    const villagersSidePlayers = getPlayersWithCurrentSide(game.players, ROLE_SIDES.VILLAGERS);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.VILLAGERS, winners: villagersSidePlayers }, plainToInstanceDefaultOptions);
  }
}

export {
  doWerewolvesWin,
  doVillagersWin,
  doLoversWin,
  doesWhiteWerewolfWin,
  doesPiedPiperWin,
  doesAngelWin,
  isGameOver,
  generateGameVictoryData,
};