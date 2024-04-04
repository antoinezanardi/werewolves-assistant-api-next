import { plainToInstance } from "class-transformer";

import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helpers";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createNoneGameVictory(gameVictory: Partial<GameVictory> = {}): GameVictory {
  return createGameVictory({
    type: "none",
    ...gameVictory,
  });
}

function createAngelGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const angelPlayer = getPlayerWithCurrentRole(game, RoleNames.ANGEL);
  return createGameVictory({
    type: "angel",
    winners: angelPlayer ? [angelPlayer] : undefined,
    ...gameVictory,
  });
}

function createLoversGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const { mustWinWithLovers: mustCupidWinWithLovers } = game.options.roles.cupid;
  const winners = game.players.filter(player =>
    doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game) ||
    player.role.current === RoleNames.CUPID && mustCupidWinWithLovers);
  return createGameVictory({
    type: "lovers",
    winners,
    ...gameVictory,
  });
}

function createPiedPiperGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const piedPiperPlayer = getPlayerWithCurrentRole(game, RoleNames.PIED_PIPER);
  return createGameVictory({
    type: "pied-piper",
    winners: piedPiperPlayer ? [piedPiperPlayer] : undefined,
    ...gameVictory,
  });
}

function createPrejudicedManipulatorGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const prejudicedManipulatorPlayer = getPlayerWithCurrentRole(game, RoleNames.PREJUDICED_MANIPULATOR);
  return createGameVictory({
    type: "prejudiced-manipulator",
    winners: prejudicedManipulatorPlayer ? [prejudicedManipulatorPlayer] : undefined,
    ...gameVictory,
  });
}

function createWhiteWerewolfGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, RoleNames.WHITE_WEREWOLF);
  return createGameVictory({
    type: "white-werewolf",
    winners: whiteWerewolfPlayer ? [whiteWerewolfPlayer] : undefined,
    ...gameVictory,
  });
}

function createWerewolvesGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const werewolvesSidePlayers = getPlayersWithCurrentSide(game, RoleSides.WEREWOLVES);
  return createGameVictory({
    type: "werewolves",
    winners: werewolvesSidePlayers,
    ...gameVictory,
  });
}

function createVillagersGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const villagersSidePlayers = getPlayersWithCurrentSide(game, RoleSides.VILLAGERS);
  return createGameVictory({
    type: "villagers",
    winners: villagersSidePlayers,
    ...gameVictory,
  });
}

function createGameVictory(gameVictory: GameVictory): GameVictory {
  return plainToInstance(GameVictory, toJSON(gameVictory), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createNoneGameVictory,
  createAngelGameVictory,
  createLoversGameVictory,
  createPiedPiperGameVictory,
  createPrejudicedManipulatorGameVictory,
  createWhiteWerewolfGameVictory,
  createWerewolvesGameVictory,
  createVillagersGameVictory,
  createGameVictory,
};