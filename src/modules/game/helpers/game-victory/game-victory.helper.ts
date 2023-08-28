import { plainToInstance } from "class-transformer";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { PlayerAttributeNames, PlayerDeathCauses } from "@/modules/game/enums/player.enum";
import { areAllPlayersDead, getLeftToCharmByPiedPiperPlayers, getPlayersWithActiveAttributeName, getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { isPlayerAliveAndPowerful, isPlayerPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

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
  if (!angelPlayer?.death || angelPlayer.isAlive || !isPlayerPowerful(angelPlayer, game) || game.turn > 1) {
    return false;
  }
  return [PlayerDeathCauses.VOTE, PlayerDeathCauses.EATEN].includes(angelPlayer.death.cause);
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
    return plainToInstance(GameVictory, { type: GameVictoryTypes.NONE }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
  }
  if (doesAngelWin(game)) {
    const angelPlayer = getPlayerWithCurrentRole(game, RoleNames.ANGEL);
    return plainToInstance(GameVictory, { type: GameVictoryTypes.ANGEL, winners: [angelPlayer] }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
  }
  if (doLoversWin(game)) {
    const inLovePlayers = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.IN_LOVE);
    return plainToInstance(GameVictory, { type: GameVictoryTypes.LOVERS, winners: inLovePlayers }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
  }
  if (doesPiedPiperWin(game)) {
    const piedPiperPlayer = getPlayerWithCurrentRole(game, RoleNames.PIED_PIPER);
    return plainToInstance(GameVictory, { type: GameVictoryTypes.PIED_PIPER, winners: [piedPiperPlayer] }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
  }
  if (doesWhiteWerewolfWin(game)) {
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, RoleNames.WHITE_WEREWOLF);
    return plainToInstance(GameVictory, { type: GameVictoryTypes.WHITE_WEREWOLF, winners: [whiteWerewolfPlayer] }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
  }
  if (doWerewolvesWin(game)) {
    const werewolvesSidePlayers = getPlayersWithCurrentSide(game, RoleSides.WEREWOLVES);
    return plainToInstance(GameVictory, { type: GameVictoryTypes.WEREWOLVES, winners: werewolvesSidePlayers }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
  }
  if (doVillagersWin(game)) {
    const villagersSidePlayers = getPlayersWithCurrentSide(game, RoleSides.VILLAGERS);
    return plainToInstance(GameVictory, { type: GameVictoryTypes.VILLAGERS, winners: villagersSidePlayers }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
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