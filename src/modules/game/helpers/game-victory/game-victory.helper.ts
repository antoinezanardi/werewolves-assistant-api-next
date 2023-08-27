import { plainToInstance } from "class-transformer";

import { GAME_PLAY_ACTIONS } from "@/modules/game/enums/game-play.enum";
import { GAME_VICTORY_TYPES } from "@/modules/game/enums/game-victory.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES } from "@/modules/game/enums/player.enum";
import { areAllPlayersDead, getLeftToCharmByPiedPiperPlayers, getPlayersWithActiveAttributeName, getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { ROLE_NAMES, ROLE_SIDES } from "@/modules/role/enums/role.enum";

import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function doWerewolvesWin(game: Game): boolean {
  const werewolvesSidedPlayers = getPlayersWithCurrentSide(game, ROLE_SIDES.WEREWOLVES);
  return werewolvesSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === ROLE_SIDES.VILLAGERS && isAlive);
}

function doVillagersWin(game: Game): boolean {
  const villagersSidedPlayers = getPlayersWithCurrentSide(game, ROLE_SIDES.VILLAGERS);
  return villagersSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === ROLE_SIDES.WEREWOLVES && isAlive);
}

function doLoversWin(game: Game): boolean {
  const lovers = getPlayersWithActiveAttributeName(game, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
  return lovers.length > 0 && game.players.every(player => {
    const isPlayerInLove = doesPlayerHaveActiveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.IN_LOVE, game);
    return isPlayerInLove && player.isAlive || !isPlayerInLove && !player.isAlive;
  });
}

function doesWhiteWerewolfWin(game: Game): boolean {
  const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, ROLE_NAMES.WHITE_WEREWOLF);
  return !!whiteWerewolfPlayer && game.players.every(({ role, isAlive }) =>
    role.current === ROLE_NAMES.WHITE_WEREWOLF && isAlive || role.current !== ROLE_NAMES.WHITE_WEREWOLF && !isAlive);
}

function doesPiedPiperWin(game: Game): boolean {
  const { isPowerlessIfInfected } = game.options.roles.piedPiper;
  const piedPiperPlayer = getPlayerWithCurrentRole(game, ROLE_NAMES.PIED_PIPER);
  const leftToCharmPlayers = getLeftToCharmByPiedPiperPlayers(game);
  return !!piedPiperPlayer && isPlayerAliveAndPowerful(piedPiperPlayer, game) && !leftToCharmPlayers.length &&
    (!isPowerlessIfInfected || piedPiperPlayer.side.current === ROLE_SIDES.VILLAGERS);
}

function doesAngelWin(game: Game): boolean {
  const angelPlayer = getPlayerWithCurrentRole(game, ROLE_NAMES.ANGEL);
  if (!angelPlayer?.death || angelPlayer.isAlive || !isPlayerPowerful(angelPlayer, game) || game.turn > 1) {
    return false;
  }
  return [PLAYER_DEATH_CAUSES.VOTE, PLAYER_DEATH_CAUSES.EATEN].includes(angelPlayer.death.cause);
}

function isGameOver(game: Game): boolean {
  const { upcomingPlays, currentPlay } = game;
  if (!currentPlay) {
    throw createNoCurrentGamePlayUnexpectedException("isGameOver", { gameId: game._id });
  }
  const isShootPlayIncoming = !!upcomingPlays.find(({ action, source }) => action === GAME_PLAY_ACTIONS.SHOOT && source.name === ROLE_NAMES.HUNTER);
  return areAllPlayersDead(game) || currentPlay.action !== GAME_PLAY_ACTIONS.SHOOT && !isShootPlayIncoming &&
    (doWerewolvesWin(game) || doVillagersWin(game) || doLoversWin(game) || doesWhiteWerewolfWin(game) || doesPiedPiperWin(game) || doesAngelWin(game));
}

function generateGameVictoryData(game: Game): GameVictory | undefined {
  if (areAllPlayersDead(game)) {
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.NONE }, plainToInstanceDefaultOptions);
  }
  if (doesAngelWin(game)) {
    const angelPlayer = getPlayerWithCurrentRole(game, ROLE_NAMES.ANGEL);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.ANGEL, winners: [angelPlayer] }, plainToInstanceDefaultOptions);
  }
  if (doLoversWin(game)) {
    const inLovePlayers = getPlayersWithActiveAttributeName(game, PLAYER_ATTRIBUTE_NAMES.IN_LOVE);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.LOVERS, winners: inLovePlayers }, plainToInstanceDefaultOptions);
  }
  if (doesPiedPiperWin(game)) {
    const piedPiperPlayer = getPlayerWithCurrentRole(game, ROLE_NAMES.PIED_PIPER);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.PIED_PIPER, winners: [piedPiperPlayer] }, plainToInstanceDefaultOptions);
  }
  if (doesWhiteWerewolfWin(game)) {
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, ROLE_NAMES.WHITE_WEREWOLF);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.WHITE_WEREWOLF, winners: [whiteWerewolfPlayer] }, plainToInstanceDefaultOptions);
  }
  if (doWerewolvesWin(game)) {
    const werewolvesSidePlayers = getPlayersWithCurrentSide(game, ROLE_SIDES.WEREWOLVES);
    return plainToInstance(GameVictory, { type: GAME_VICTORY_TYPES.WEREWOLVES, winners: werewolvesSidePlayers }, plainToInstanceDefaultOptions);
  }
  if (doVillagersWin(game)) {
    const villagersSidePlayers = getPlayersWithCurrentSide(game, ROLE_SIDES.VILLAGERS);
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