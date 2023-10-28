import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { GameVictoryService } from "@/modules/game/providers/services/game-victory/game-victory.service";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlayHunterShoots, createFakeGamePlaySurvivorsVote, createFakeGamePlayWerewolvesEat } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameVictory } from "@tests/factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAncientPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerBrokenHeartByCupidDeath, createFakePlayerEatenByWerewolvesDeath, createFakePlayerVoteBySurvivorsDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAngelAlivePlayer, createFakePiedPiperAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayerSide } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Victory Service", () => {
  let services: { gameVictory: GameVictoryService };
  let mocks: {
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GameVictoryService] }).compile();
    mocks = { unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() } };
    services = { gameVictory: module.get<GameVictoryService>(GameVictoryService) };
  });

  describe("isGameOver", () => {
    it("should throw error when game's current play is not set.", () => {
      const game = createFakeGame();
      const interpolations = { gameId: game._id };

      expect(() => services.gameVictory.isGameOver(game)).toThrow(undefined);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("isGameOver", interpolations);
    });

    it("should return true when all players are dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ source: createFakeGamePlaySource({ name: RoleNames.HUNTER }) }),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(services.gameVictory.isGameOver(game)).toBe(true);
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
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(services.gameVictory.isGameOver(game)).toBe(false);
    });

    it("should return false when current play is shoot by hunter play.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlayHunterShoots();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(services.gameVictory.isGameOver(game)).toBe(false);
    });

    it("should return true when werewolves win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ action: GamePlayActions.LOOK }),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, currentPlay, upcomingPlays });

      expect(services.gameVictory.isGameOver(game)).toBe(true);
    });

    it("should return true when villagers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ source: createFakeGamePlaySource({ name: RoleNames.THIEF }) }),
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, currentPlay, upcomingPlays });

      expect(services.gameVictory.isGameOver(game)).toBe(true);
    });

    it("should return true when lovers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const upcomingPlays = [
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(services.gameVictory.isGameOver(game)).toBe(true);
    });

    it("should return true when white werewolf wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: true }),
      ];
      const upcomingPlays = [
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay });

      expect(services.gameVictory.isGameOver(game)).toBe(true);
    });

    it("should return true when pied piper wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
      ];
      const upcomingPlays = [
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay, options });

      expect(services.gameVictory.isGameOver(game)).toBe(true);
    });

    it("should return true when angel wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
      ];
      const upcomingPlays = [
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const currentPlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players, upcomingPlays, currentPlay, options, turn: 1, phase: GamePhases.NIGHT });

      expect(services.gameVictory.isGameOver(game)).toBe(true);
    });
  });

  describe("generateGameVictoryData", () => {
    it("should return no winners when all players are dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlayHunterShoots({ source: createFakeGamePlaySource({ name: RoleNames.HUNTER }) }),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.NONE });

      expect(services.gameVictory.generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return angel victory when angel wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ players, options, phase: GamePhases.NIGHT, turn: 1 });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.ANGEL, winners: [players[3]] });

      expect(services.gameVictory.generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return lovers victory when lovers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.LOVERS, winners: [players[2], players[3]] });

      expect(services.gameVictory.generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return pied piper victory when pied piper wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ players, options });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.PIED_PIPER, winners: [players[3]] });

      expect(services.gameVictory.generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return white werewolf victory when white werewolf wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: true }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.WHITE_WEREWOLF, winners: [players[2]] });

      expect(services.gameVictory.generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return werewolves victory when werewolves win.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.WEREWOLVES, winners: [players[2], players[3]] });

      expect(services.gameVictory.generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return villagers victory when villagers win.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.VILLAGERS, winners: [players[0], players[1]] });

      expect(services.gameVictory.generateGameVictoryData(game)).toStrictEqual<GameVictory>(expectedGameVictory);
    });

    it("should return undefined when no victory can't be generated.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory.generateGameVictoryData(game)).toBeUndefined();
    });
  });
  
  describe("doWerewolvesWin", () => {
    it("should return false when there are no players provided.", () => {
      const game = createFakeGame();

      expect(services.gameVictory["doWerewolvesWin"](game)).toBe(false);
    });

    it("should return false when there are no werewolves among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doWerewolvesWin"](game)).toBe(false);
    });

    it("should return false when there are at least one alive villager among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doWerewolvesWin"](game)).toBe(false);
    });

    it("should return true when all villagers are dead.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doWerewolvesWin"](game)).toBe(true);
    });
  });
  
  describe("doVillagersWin", () => {
    it("should return false when there are no players provided.", () => {
      const game = createFakeGame();
      expect(services.gameVictory["doVillagersWin"](game)).toBe(false);
    });

    it("should return false when there are no villagers among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doVillagersWin"](game)).toBe(false);
    });

    it("should return false when there are at least one alive werewolf among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doVillagersWin"](game)).toBe(false);
    });

    it("should return true when all werewolves are dead.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doVillagersWin"](game)).toBe(true);
    });
  });

  describe("doLoversWin", () => {
    it("should return false when no players are provided.", () => {
      const game = createFakeGame();

      expect(services.gameVictory["doLoversWin"](game)).toBe(false);
    });

    it("should return false when there are no lovers among players.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doLoversWin"](game)).toBe(false);
    });

    it("should return false when at least one non-lover player is alive.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doLoversWin"](game)).toBe(false);
    });

    it("should return false when at least one lover player is dead.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doLoversWin"](game)).toBe(false);
    });

    it("should return true when lovers are the last survivors.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doLoversWin"](game)).toBe(true);
    });
  });

  describe("doesWhiteWerewolfWin", () => {
    it("should return false when no players are provided.", () => {
      const game = createFakeGame();

      expect(services.gameVictory["doesWhiteWerewolfWin"](game)).toBe(false);
    });

    it("should return false when there is no white werewolf among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesWhiteWerewolfWin"](game)).toBe(false);
    });

    it("should return false when there is at least one alive players among players except white werewolf himself.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesWhiteWerewolfWin"](game)).toBe(false);
    });

    it("should return false when all players are dead even white werewolf himself.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesWhiteWerewolfWin"](game)).toBe(false);
    });

    it("should return true when all players are dead except white werewolf.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer({ isAlive: true }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesWhiteWerewolfWin"](game)).toBe(true);
    });
  });

  describe("doesPiedPiperWin", () => {
    it("should return false when no players are provided.", () => {
      const game = createFakeGame();

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(false);
    });

    it("should return false when there is no pied piper among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(false);
    });

    it("should return false when pied piper is dead but all are charmed.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(false);
    });

    it("should return false when pied piper is powerless but all are charmed.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(false);
    });

    it("should return false when there are still left to charm players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [] }),
        createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(false);
    });

    it("should return false when all are charmed but pied piper is powerless because infected.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(false);
    });

    it("should return true when all are charmed but pied piper is not powerless because infected.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(true);
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

      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(true);
    });
  });

  describe("doesAngelWin", () => {
    it("should return false when no players provided.", () => {
      const game = createFakeGame();

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return false when there is no angel among players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return false when angel is still alive.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return false when angel is dead but has no death cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return false when angel is dead but powerless.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath(), attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return false when it's not first turn of the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath() }),
      ];
      const game = createFakeGame({ players, turn: 2 });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return false when angel is not dead from vote or eaten cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerBrokenHeartByCupidDeath() }),
      ];
      const game = createFakeGame({ players, turn: 1 });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return false when angel dead for vote cause but on phase day.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
      ];
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.DAY });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(false);
    });

    it("should return true when angel is dead from eaten cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath() }),
      ];
      const game = createFakeGame({ players, turn: 1 });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(true);
    });

    it("should return true when angel is dead from vote cause.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
      ];
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.NIGHT });

      expect(services.gameVictory["doesAngelWin"](game)).toBe(true);
    });
  });
});