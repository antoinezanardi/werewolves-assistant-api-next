import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { Game } from "@/modules/game/schemas/game.schema";
import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { GameVictoryService } from "@/modules/game/providers/services/game-victory/game-victory.service";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeCupidGameOptions, createFakePiedPiperGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlayHunterShoots, createFakeGamePlaySurvivorsVote, createFakeGamePlayWerewolvesEat } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameVictory } from "@tests/factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByElderPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerBrokenHeartByCupidDeath, createFakePlayerEatenByWerewolvesDeath, createFakePlayerShotByHunterDeath, createFakePlayerVoteBySurvivorsDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAngelAlivePlayer, createFakeCupidAlivePlayer, createFakePiedPiperAlivePlayer, createFakePrejudicedManipulatorAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
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
      const expectedError = new UnexpectedException("isGameOver", UnexpectedExceptionReasons.NO_CURRENT_GAME_PLAY, { gameId: game._id.toString() });
      mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException.mockReturnValueOnce(expectedError);

      expect(() => services.gameVictory.isGameOver(game)).toThrow(expectedError);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("isGameOver", { gameId: game._id });
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
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: false }) }) });
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
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: false }) }) });
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
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: false }) }) });
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
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: false }) }) });
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

    it("should return prejudiced manipulator victory when prejudiced manipulator wins.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, group: "girl" }),
        createFakeSeerAlivePlayer({ isAlive: false, group: "girl" }),
        createFakePrejudicedManipulatorAlivePlayer({ group: "boy" }),
        createFakeWerewolfAlivePlayer({ group: "boy" }),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory = createFakeGameVictory({ type: GameVictoryTypes.PREJUDICED_MANIPULATOR, winners: [players[2]] });

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
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when there are no players provided.",
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when there are no werewolves among players.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when there are at least one alive villager among players.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when all villagers are dead.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWerewolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
          ],
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gameVictory["doWerewolvesWin"](game)).toBe(expected);
    });
    
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
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when there are no players provided.",
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when there are no lovers among players.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWerewolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: false }) }) }),
        }),
        expected: false,
      },
      {
        test: "should return false when there are at least one alive non-lover player among players.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer(),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: true }) }) }),
        }),
        expected: false,
      },
      {
        test: "should return true when all non-lover players are dead.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer({ isAlive: false }),
            createFakeCupidAlivePlayer({ isAlive: false }),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: false }) }) }),
        }),
        expected: true,
      },
      {
        test: "should return true when all non-lover players are dead and cupid can win with lovers.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer({ isAlive: false }),
            createFakeCupidAlivePlayer(),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: true }) }) }),
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gameVictory["doLoversWin"](game)).toBe(expected);
    });
  });

  describe("doesWhiteWerewolfWin", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when no players are provided.",
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when there is no white werewolf among players.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when there is at least one alive players among players except white werewolf himself.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWhiteWerewolfAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when all players are dead even white werewolf himself.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when all players are dead except white werewolf.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWhiteWerewolfAlivePlayer({ isAlive: true }),
          ],
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gameVictory["doesWhiteWerewolfWin"](game)).toBe(expected);
    });
  });

  describe("doesPiedPiperWin", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when no players are provided.",
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when there is no pied piper among players.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when pied piper is dead but all are charmed.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakePiedPiperAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when pied piper is powerless but all are charmed.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when there are still left to charm players.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeVillagerAlivePlayer({ attributes: [] }),
            createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when all are charmed but pied piper is powerless because infected.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: true }) }) }),
        }),
        expected: false,
      },
      {
        test: "should return true when all are charmed but pied piper is not powerless because infected.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: false }) }) }),
        }),
        expected: true,
      },
      {
        test: "should return true when all are charmed and pied piper is not infected anyway.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
            createFakePiedPiperAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: true }) }) }),
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gameVictory["doesPiedPiperWin"](game)).toBe(expected);
    });
  });

  describe("doesAngelWin", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when no players are provided.",
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when there is no angel among players.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when angel is still alive.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when angel is dead but has no death cause.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when angel is dead but powerless.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false, attributes: [createFakePowerlessByElderPlayerAttribute()] }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when it's not first turn of the game.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath() }),
          ],
          turn: 2,
        }),
        expected: false,
      },
      {
        test: "should return false when angel is not dead from vote or eaten cause.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerBrokenHeartByCupidDeath() }),
          ],
          turn: 1,
        }),
        expected: false,
      },
      {
        test: "should return false when angel dead for shot cause on night phase.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerShotByHunterDeath() }),
          ],
          turn: 1,
          phase: GamePhases.NIGHT,
        }),
        expected: false,
      },
      {
        test: "should return false when angel dead for vote cause but on phase day.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
          ],
          turn: 1,
          phase: GamePhases.DAY,
        }),
        expected: false,
      },
      {
        test: "should return true when angel is dead from eaten cause.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerEatenByWerewolvesDeath() }),
          ],
          turn: 1,
        }),
        expected: true,
      },
      {
        test: "should return true when angel is dead from vote cause.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
          ],
          turn: 1,
          phase: GamePhases.NIGHT,
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gameVictory["doesAngelWin"](game)).toBe(expected);
    });
  });

  describe("doesPrejudicedManipulatorWin", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when no players are provided.",
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when there is no prejudiced manipulator among players.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ group: "boy" }),
            createFakeSeerAlivePlayer({ group: "boy" }),
            createFakeVillagerAlivePlayer({ group: "boy" }),
            createFakeVillagerAlivePlayer({ group: "girl", isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when prejudiced manipulator is dead.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ group: "boy" }),
            createFakeSeerAlivePlayer({ group: "boy" }),
            createFakePrejudicedManipulatorAlivePlayer({ group: "boy", isAlive: false }),
            createFakeVillagerAlivePlayer({ group: "girl", isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when prejudiced manipulator is powerless.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ group: "boy" }),
            createFakeSeerAlivePlayer({ group: "boy" }),
            createFakePrejudicedManipulatorAlivePlayer({ group: "boy", attributes: [createFakePowerlessByElderPlayerAttribute()] }),
            createFakeVillagerAlivePlayer({ group: "girl", isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when one of the prejudiced manipulator's other group is still alive.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ group: "boy" }),
            createFakeSeerAlivePlayer({ group: "girl" }),
            createFakePrejudicedManipulatorAlivePlayer({ group: "boy" }),
            createFakeVillagerAlivePlayer({ group: "girl", isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when every one of the prejudiced manipulator's other group is dead.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ group: "boy" }),
            createFakeSeerAlivePlayer({ group: "girl", isAlive: false }),
            createFakePrejudicedManipulatorAlivePlayer({ group: "boy" }),
            createFakeVillagerAlivePlayer({ group: "girl", isAlive: false }),
          ],
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gameVictory["doesPrejudicedManipulatorWin"](game)).toBe(expected);
    });
  });
});