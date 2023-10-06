import { createAngelGameVictory, createLoversGameVictory, createNoneGameVictory, createPiedPiperGameVictory, createVillagersGameVictory, createWerewolvesGameVictory, createWhiteWerewolfGameVictory } from "@/modules/game/helpers/game-victory/game-victory.factory";
import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerDeathCauses } from "@/modules/game/enums/player.enum";
import { areAllPlayersDead, getLeftToCharmByPiedPiperPlayers, getPlayersWithActiveAttributeName, getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

function doWerewolvesWin(game: Game): boolean {
  const werewolvesSidedPlayers = getPlayersWithCurrentSide(game, RoleSides.WEREWOLVES);
  return werewolvesSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === RoleSides.VILLAGERS && isAlive);
}

function doVillagersWin(game: Game): boolean {
  const villagersSidedPlayers = getPlayersWithCurrentSide(game, RoleSides.VILLAGERS);
  return villagersSidedPlayers.length > 0 && !game.players.some(({ side, isAlive }) => side.current === RoleSides.WEREWOLVES && isAlive);
}

function doLoversWin(game: Game): boolean {
  const lovers = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.IN_LOVE);
  return lovers.length > 0 && game.players.every(player => {
    const isPlayerInLove = doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game);
    return isPlayerInLove && player.isAlive || !isPlayerInLove && !player.isAlive;
  });
}

function doesWhiteWerewolfWin(game: Game): boolean {
  const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, RoleNames.WHITE_WEREWOLF);
  return !!whiteWerewolfPlayer && game.players.every(({ role, isAlive }) =>
    role.current === RoleNames.WHITE_WEREWOLF && isAlive || role.current !== RoleNames.WHITE_WEREWOLF && !isAlive);
}

function doesPiedPiperWin(game: Game): boolean {
  const { isPowerlessIfInfected } = game.options.roles.piedPiper;
  const piedPiperPlayer = getPlayerWithCurrentRole(game, RoleNames.PIED_PIPER);
  const leftToCharmPlayers = getLeftToCharmByPiedPiperPlayers(game);
  return !!piedPiperPlayer && isPlayerAliveAndPowerful(piedPiperPlayer, game) && !leftToCharmPlayers.length &&
    (!isPowerlessIfInfected || piedPiperPlayer.side.current === RoleSides.VILLAGERS);
}

function doesAngelWin(game: Game): boolean {
  const angelPlayer = getPlayerWithCurrentRole(game, RoleNames.ANGEL);
  const { turn, phase } = game;
  if (!angelPlayer?.death || angelPlayer.isAlive || !isPlayerPowerful(angelPlayer, game) || turn > 1) {
    return false;
  }
  const { cause: deathCause } = angelPlayer.death;
  return deathCause === PlayerDeathCauses.EATEN || deathCause === PlayerDeathCauses.VOTE && phase === GamePhases.NIGHT;
}

function isGameOver(game: Game): boolean {
  const { upcomingPlays, currentPlay } = game;
  if (!currentPlay) {
    throw createNoCurrentGamePlayUnexpectedException("isGameOver", { gameId: game._id });
  }
  const isShootPlayIncoming = !!upcomingPlays.find(({ action, source }) => action === GamePlayActions.SHOOT && source.name === RoleNames.HUNTER);
  return areAllPlayersDead(game) || currentPlay.action !== GamePlayActions.SHOOT && !isShootPlayIncoming &&
    (doWerewolvesWin(game) || doVillagersWin(game) || doLoversWin(game) || doesWhiteWerewolfWin(game) || doesPiedPiperWin(game) || doesAngelWin(game));
}

function generateGameVictoryData(game: Game): GameVictory | undefined {
  if (areAllPlayersDead(game)) {
    return createNoneGameVictory();
  }
  if (doesAngelWin(game)) {
    return createAngelGameVictory(game);
  }
  if (doLoversWin(game)) {
    return createLoversGameVictory(game);
  }
  if (doesPiedPiperWin(game)) {
    return createPiedPiperGameVictory(game);
  }
  if (doesWhiteWerewolfWin(game)) {
    return createWhiteWerewolfGameVictory(game);
  }
  if (doWerewolvesWin(game)) {
    return createWerewolvesGameVictory(game);
  }
  if (doVillagersWin(game)) {
    return createVillagersGameVictory(game);
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