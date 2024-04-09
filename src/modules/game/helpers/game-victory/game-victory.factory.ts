import { plainToInstance } from "class-transformer";

import { getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helpers";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import type { Game } from "@/modules/game/schemas/game.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createNoneGameVictory(gameVictory: Partial<GameVictory> = {}): GameVictory {
  return createGameVictory({
    type: "none",
    ...gameVictory,
  });
}

function createAngelGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const angelPlayer = getPlayerWithCurrentRole(game, "angel");
  return createGameVictory({
    type: "angel",
    winners: angelPlayer ? [angelPlayer] : undefined,
    ...gameVictory,
  });
}

function createLoversGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const { mustWinWithLovers: mustCupidWinWithLovers } = game.options.roles.cupid;
  const winners = game.players.filter(player =>
    doesPlayerHaveActiveAttributeWithName(player, "in-love", game) ||
    player.role.current === "cupid" && mustCupidWinWithLovers);
  return createGameVictory({
    type: "lovers",
    winners,
    ...gameVictory,
  });
}

function createPiedPiperGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const piedPiperPlayer = getPlayerWithCurrentRole(game, "pied-piper");
  return createGameVictory({
    type: "pied-piper",
    winners: piedPiperPlayer ? [piedPiperPlayer] : undefined,
    ...gameVictory,
  });
}

function createPrejudicedManipulatorGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const prejudicedManipulatorPlayer = getPlayerWithCurrentRole(game, "prejudiced-manipulator");
  return createGameVictory({
    type: "prejudiced-manipulator",
    winners: prejudicedManipulatorPlayer ? [prejudicedManipulatorPlayer] : undefined,
    ...gameVictory,
  });
}

function createWhiteWerewolfGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, "white-werewolf");
  return createGameVictory({
    type: "white-werewolf",
    winners: whiteWerewolfPlayer ? [whiteWerewolfPlayer] : undefined,
    ...gameVictory,
  });
}

function createWerewolvesGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const werewolvesSidePlayers = getPlayersWithCurrentSide(game, "werewolves");
  return createGameVictory({
    type: "werewolves",
    winners: werewolvesSidePlayers,
    ...gameVictory,
  });
}

function createVillagersGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const villagersSidePlayers = getPlayersWithCurrentSide(game, "villagers");
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