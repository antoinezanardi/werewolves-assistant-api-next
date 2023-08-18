import { GAME_PLAY_ACTIONS } from "../../../../../../../src/modules/game/enums/game-play.enum";
import { GAME_VICTORY_TYPES } from "../../../../../../../src/modules/game/enums/game-victory.enum";
import { doesAngelWin, doesPiedPiperWin, doesWhiteWerewolfWin, doLoversWin, doVillagersWin, doWerewolvesWin, generateGameVictoryData, isGameOver } from "../../../../../../../src/modules/game/helpers/game-victory/game-victory.helper";
import type { GameVictory } from "../../../../../../../src/modules/game/schemas/game-victory/game-victory.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../../src/modules/role/enums/role.enum";
import * as UnexpectedExceptionFactory from "../../../../../../../src/shared/exception/helpers/unexpected-exception.factory";
import { createFakeGameOptions } from "../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions } from "../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlaySource } from "../../../../../../factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlayAllVote, createFakeGamePlayHunterShoots, createFakeGamePlayWerewolvesEat } from "../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameVictory } from "../../../../../../factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAncientPlayerAttribute } from "../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerBrokenHeartByCupidDeath, createFakePlayerEatenByWerewolvesDeath, createFakePlayerVoteByAllDeath } from "../../../../../../factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAngelAlivePlayer, createFakePiedPiperAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayerSide } from "../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Game Victory Helper", () => {
  let mocks: {
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };
  
  beforeEach(() => {
    mocks = { unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() } };
  });
  
  describe("doWerewolvesWin", () => {
    it("should return false when there are no players provided.", () => {
      const game = createFakeGame();

      expect(doWerewolvesWin(game)).toBe(false);
    });

    it("should return false when there are no werewolves among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doWerewolvesWin(game)).toBe(false);
    });

    it("should return false when there are at least one alive villager among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doWerewolvesWin(game)).toBe(false);
    });

    it("should return true when all villagers are dead.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doWerewolvesWin(game)).toBe(true);
    });
  });
  
  describe("doVillagersWin", () => {
    it("should return false when there are no players provided.", () => {
      const game = createFakeGame();
      expect(doVillagersWin(game)).toBe(false);
    });

    it("should return false when there are no villagers among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doVillagersWin(game)).toBe(false);
    });

    it("should return false when there are at least one alive werewolf among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doVillagersWin(game)).toBe(false);
    });

    it("should return true when all werewolves are dead.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doVillagersWin(game)).toBe(true);
    });
  });

  describe("doLoversWin", () => {
    it("should return false when no players are provided.", () => {
      const game = createFakeGame();

      expect(doLoversWin(game)).toBe(false);
    });

    it("should return false when there are no lovers among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doLoversWin(game)).toBe(false);
    });

    it("should return false when at least one non-lover player is alive.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(doLoversWin(game)).toBe(false);
    });

    it("should return false when at least one lover player is dead.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doLoversWin(game)).toBe(false);
    });

    it("should return true when lovers are the last survivors.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(doLoversWin(game)).toBe(true);
    });
  });

  describe("doesWhiteWerewolfWin", () => {
    it("should return false when no players are provided.", () => {
      const game = createFakeGame();

      expect(doesWhiteWerewolfWin(game)).toBe(false);
    });

    it("should return false when there is no white werewolf among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doesWhiteWerewolfWin(game)).toBe(false);
    });

    it("should return false when there is at least one alive players among players except white werewolf himself.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doesWhiteWerewolfWin(game)).toBe(false);
    });

    it("should return false when all players are dead even white werewolf himself.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doesWhiteWerewolfWin(game)).toBe(false);
    });

    it("should return true when all players are dead except white werewolf.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: true }),
      ];
      const game = createFakeGame({ players });

      expect(doesWhiteWerewolfWin(game)).toBe(true);
    });
  });

  describe("doesPiedPiperWin", () => {
    it("should return false when no players are provided.", () => {
      const game = createFakeGame();

      expect(doesPiedPiperWin(game)).toBe(false);
    });

    it("should return false when there is no pied piper among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doesPiedPiperWin(game)).toBe(false);
    });

    it("should return false when pied piper is dead but all are charmed.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doesPiedPiperWin(game)).toBe(false);
    });

    it("should return false when pied piper is powerless but all are charmed.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(doesPiedPiperWin(game)).toBe(false);
    });

    it("should return false when there are still left to charm players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [] }),
        createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(doesPiedPiperWin(game)).toBe(false);
    });

    it("should return false when all are charmed but pied piper is powerless because infected.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: true }) }) });
      const game = createFakeGame({ players, options });

      expect(doesPiedPiperWin(game)).toBe(false);
    });

    it("should return true when all are charmed but pied piper is not powerless because infected.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ players, options });

      expect(doesPiedPiperWin(game)).toBe(true);
    });

    it("should return true when all are charmed and pied piper is not infected anyway.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: true }) }) });
      const game = createFakeGame({ players, options });

      expect(doesPiedPiperWin(game)).toBe(true);
    });
  });

  describe("doesAngelWin", () => {
    it("should return false when no players provided.", () => {
      const game = createFakeGame();

      expect(doesAngelWin(game)).toBe(false);
    });

    it("should return false when there is no angel among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doesAngelWin(game)).toBe(false);
    });

    it("should return false when angel is still alive.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(doesAngelWin(game)).toBe(false);
    });

    it("should return false when angel is dead but has no death cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(doesAngelWin(game)).toBe(false);
    });

    it("should return false when angel is dead but powerless.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath(), attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(doesAngelWin(game)).toBe(false);
    });

    it("should return false when it's not first turn of the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath() }),
      ];
      const game = createFakeGame({ players, turn: 2 });

      expect(doesAngelWin(game)).toBe(false);
    });

    it("should return false when angel is not dead from vote or eaten cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerBrokenHeartByCupidDeath() }),
      ];
      const game = createFakeGame({ players, turn: 1 });

      expect(doesAngelWin(game)).toBe(false);
    });

    it("should return true when angel is dead from eaten cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath() }),
      ];
      const game = createFakeGame({ players, turn: 1 });

      expect(doesAngelWin(game)).toBe(true);
    });

    it("should return true when angel is dead from vote cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteByAllDeath() }),
      ];
      const game = createFakeGame({ players, turn: 1 });

      expect(doesAngelWin(game)).toBe(true);
    });
  });

  describe("isGameOver", () => {
    it("should throw error when game's current play is not set.", () => {
      const game = createFakeGame();
      const interpolations = { gameId: game._id };

      expect(() => isGameOver(game)).toThrow(undefined);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("isGameOver", interpolations);
    });

    it("should return true when all players are dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ source: createFakeGamePlaySource({ name: ROLE_NAMES.HUNTER }) }),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(isGameOver(game)).toBe(true);
    });

    it("should return false when there is a incoming shoot by hunter play.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(isGameOver(game)).toBe(false);
    });

    it("should return false when current play is shoot by hunter play.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayAllVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayHunterShoots();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(isGameOver(game)).toBe(false);
    });

    it("should return true when werewolves win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ action: GAME_PLAY_ACTIONS.LOOK }),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, currentPlay, upcomingPlays });

      expect(isGameOver(game)).toBe(true);
    });

    it("should return true when villagers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ source: createFakeGamePlaySource({ name: ROLE_NAMES.THIEF }) }),
        createFakeGamePlayAllVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, currentPlay, upcomingPlays });

      expect(isGameOver(game)).toBe(true);
    });

    it("should return true when lovers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const upcomingPlays = [
        createFakeGamePlayAllVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(isGameOver(game)).toBe(true);
    });

    it("should return true when white werewolf wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: true }),
      ];
      const upcomingPlays = [
        createFakeGamePlayAllVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(isGameOver(game)).toBe(true);
    });

    it("should return true when pied piper wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) }),
      ];
      const upcomingPlays = [
        createFakeGamePlayAllVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay, options });

      expect(isGameOver(game)).toBe(true);
    });

    it("should return true when angel wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteByAllDeath() }),
      ];
      const upcomingPlays = [
        createFakeGamePlayAllVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const currentPlay = createFakeGamePlayAllVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay, options, turn: 1 });

      expect(isGameOver(game)).toBe(true);
    });
  });

  describe("generateGameVictoryData", () => {
    it("should return no winners when all players are dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ source: createFakeGamePlaySource({ name: ROLE_NAMES.HUNTER }) }),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGameVictory = createFakeGameVictory({ type: GAME_VICTORY_TYPES.NONE });

      expect(generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return angel victory when angel wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteByAllDeath() }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ players, options, turn: 1 });
      const expectedGameVictory = createFakeGameVictory({ type: GAME_VICTORY_TYPES.ANGEL, winners: [players[3]] });

      expect(generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return lovers victory when lovers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GAME_VICTORY_TYPES.LOVERS, winners: [players[2], players[3]] });

      expect(generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return pied piper victory when pied piper wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ players, options });
      const expectedGameVictory = createFakeGameVictory({ type: GAME_VICTORY_TYPES.PIED_PIPER, winners: [players[3]] });

      expect(generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return white werewolf victory when white werewolf wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: true }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GAME_VICTORY_TYPES.WHITE_WEREWOLF, winners: [players[2]] });

      expect(generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return werewolves victory when werewolves win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GAME_VICTORY_TYPES.WEREWOLVES, winners: [players[2], players[3]] });

      expect(generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return villagers victory when villagers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GAME_VICTORY_TYPES.VILLAGERS, winners: [players[0], players[1]] });

      expect(generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return undefined when no victory can't be generated.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(generateGameVictoryData(game)).toBeUndefined();
    });
  });
});