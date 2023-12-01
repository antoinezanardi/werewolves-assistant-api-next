import { plainToInstance } from "class-transformer";

import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { getPlayersWithActiveAttributeName, getPlayersWithCurrentSide, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";
import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createNoneGameVictory(gameVictory: Partial<GameVictory> = {}): GameVictory {
  return createGameVictory({
    type: GameVictoryTypes.NONE,
    ...gameVictory,
  });
}

function createAngelGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const angelPlayer = getPlayerWithCurrentRole(game, RoleNames.ANGEL);
  return createGameVictory({
    type: GameVictoryTypes.ANGEL,
    winners: angelPlayer ? [angelPlayer] : undefined,
    ...gameVictory,
  });
}

function createLoversGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const inLovePlayers = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.IN_LOVE);
  return createGameVictory({
    type: GameVictoryTypes.LOVERS,
    winners: inLovePlayers,
    ...gameVictory,
  });
}

function createPiedPiperGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const piedPiperPlayer = getPlayerWithCurrentRole(game, RoleNames.PIED_PIPER);
  return createGameVictory({
    type: GameVictoryTypes.PIED_PIPER,
    winners: piedPiperPlayer ? [piedPiperPlayer] : undefined,
    ...gameVictory,
  });
}

function createPrejudicedManipulatorGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const prejudicedManipulatorPlayer = getPlayerWithCurrentRole(game, RoleNames.PREJUDICED_MANIPULATOR);
  return createGameVictory({
    type: GameVictoryTypes.PREJUDICED_MANIPULATOR,
    winners: prejudicedManipulatorPlayer ? [prejudicedManipulatorPlayer] : undefined,
    ...gameVictory,
  });
}

function createWhiteWerewolfGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const whiteWerewolfPlayer = getPlayerWithCurrentRole(game, RoleNames.WHITE_WEREWOLF);
  return createGameVictory({
    type: GameVictoryTypes.WHITE_WEREWOLF,
    winners: whiteWerewolfPlayer ? [whiteWerewolfPlayer] : undefined,
    ...gameVictory,
  });
}

function createWerewolvesGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const werewolvesSidePlayers = getPlayersWithCurrentSide(game, RoleSides.WEREWOLVES);
  return createGameVictory({
    type: GameVictoryTypes.WEREWOLVES,
    winners: werewolvesSidePlayers,
    ...gameVictory,
  });
}

function createVillagersGameVictory(game: Game, gameVictory: Partial<GameVictory> = {}): GameVictory {
  const villagersSidePlayers = getPlayersWithCurrentSide(game, RoleSides.VILLAGERS);
  return createGameVictory({
    type: GameVictoryTypes.VILLAGERS,
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