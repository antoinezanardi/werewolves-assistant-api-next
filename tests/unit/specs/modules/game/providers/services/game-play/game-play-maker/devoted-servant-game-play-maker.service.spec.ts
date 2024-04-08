import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { createGamePlaySheriffDelegates } from "@/modules/game/helpers/game-play/game-play.factory";
import * as GameMutator from "@/modules/game/helpers/game.mutators";
import * as GamePlayHelper from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { DevotedServantGamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/devoted-servant-game-play-maker.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import { RoleSides } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeStolenRoleByDevotedServantPlayerAttribute, createFakeWorshipedByWildChildPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeDevotedServantAlivePlayer, createFakePiedPiperAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWildChildAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Devoted Servant Game Play Maker Service", () => {
  let services: { devotedServantGamePlayMaker: DevotedServantGamePlayMakerService };
  let mocks: {
    devotedServantGamePlayMakerService: {
      swapTargetAndDevotedServantCurrentRoleAndSide: jest.SpyInstance;
      makeDevotedServantDelegatesIfSheriff: jest.SpyInstance;
      applyTargetStolenRoleOutcomes: jest.SpyInstance;
      applyWildChildStolenRoleOutcome: jest.SpyInstance;
    };
    playerAttributeHelper: {
      canPlayerDelegateSheriffAttribute: jest.SpyInstance;
    };
    gameMutator: {
      removePlayerAttributeByNameAndSourceInGame: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createCantFindPlayerWithIdUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      devotedServantGamePlayMakerService: {
        swapTargetAndDevotedServantCurrentRoleAndSide: jest.fn(),
        makeDevotedServantDelegatesIfSheriff: jest.fn(),
        applyTargetStolenRoleOutcomes: jest.fn(),
        applyWildChildStolenRoleOutcome: jest.fn(),
      },
      playerAttributeHelper: { canPlayerDelegateSheriffAttribute: jest.spyOn(GamePlayHelper, "canPlayerDelegateSheriffAttribute").mockReturnValue(true) },
      gameMutator: { removePlayerAttributeByNameAndSourceInGame: jest.spyOn(GameMutator, "removePlayerAttributeByNameAndSourceInGame").mockImplementation() },
      unexpectedExceptionFactory: { createCantFindPlayerWithIdUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerWithIdUnexpectedException").mockImplementation() },
    };
    const module: TestingModule = await Test.createTestingModule({ providers: [DevotedServantGamePlayMakerService] }).compile();

    services = { devotedServantGamePlayMaker: module.get<DevotedServantGamePlayMakerService>(DevotedServantGamePlayMakerService) };
  });

  describe("devotedServantStealsRole", () => {
    beforeEach(() => {
      mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide = jest.spyOn(services.devotedServantGamePlayMaker as unknown as { swapTargetAndDevotedServantCurrentRoleAndSide }, "swapTargetAndDevotedServantCurrentRoleAndSide").mockImplementation();
      mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff = jest.spyOn(services.devotedServantGamePlayMaker as unknown as { makeDevotedServantDelegatesIfSheriff }, "makeDevotedServantDelegatesIfSheriff").mockImplementation();
      mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes = jest.spyOn(services.devotedServantGamePlayMaker as unknown as { applyTargetStolenRoleOutcomes }, "applyTargetStolenRoleOutcomes").mockImplementation();
    });

    it("should return game as is when devoted servant is not in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.devotedServantGamePlayMaker.devotedServantStealsRole(players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should create can't find player exception in case player is not found in game when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakePiedPiperAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      mocks.gameMutator.removePlayerAttributeByNameAndSourceInGame.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes.mockReturnValueOnce(game);
      services.devotedServantGamePlayMaker.devotedServantStealsRole(players[0] as DeadPlayer, game);
      const interpolations = { gameId: game._id, playerId: players[3]._id };

      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException).toHaveBeenCalledExactlyOnceWith("devotedServantStealsRole", interpolations);
    });

    it("should remove charmed from pied piper player attribute from devoted servant when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakePiedPiperAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      mocks.gameMutator.removePlayerAttributeByNameAndSourceInGame.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff.mockReturnValueOnce(game);
      services.devotedServantGamePlayMaker.devotedServantStealsRole(players[0] as DeadPlayer, game);

      expect(mocks.gameMutator.removePlayerAttributeByNameAndSourceInGame).toHaveBeenCalledExactlyOnceWith(players[3]._id, game, "charmed", "pied-piper");
    });

    it("should swap target and devoted servant current role and side when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameMutator.removePlayerAttributeByNameAndSourceInGame.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff.mockReturnValueOnce(game);
      services.devotedServantGamePlayMaker.devotedServantStealsRole(players[0] as DeadPlayer, game);

      expect(mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide).toHaveBeenCalledExactlyOnceWith(players[0], players[3], game);
    });

    it("should make devoted servant delegates if she is sheriff when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameMutator.removePlayerAttributeByNameAndSourceInGame.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff.mockReturnValueOnce(game);
      services.devotedServantGamePlayMaker.devotedServantStealsRole(players[0] as DeadPlayer, game);

      expect(mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff).toHaveBeenCalledExactlyOnceWith(players[3], game);
    });

    it("should apply target stolen role outcomes when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameMutator.removePlayerAttributeByNameAndSourceInGame.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff.mockReturnValueOnce(game);
      services.devotedServantGamePlayMaker.devotedServantStealsRole(players[0] as DeadPlayer, game);

      expect(mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
    });

    it("should add stolen role by devoted servant player attribute to target when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({
            ...game.players[0],
            attributes: [createFakeStolenRoleByDevotedServantPlayerAttribute()],
          }),
          game.players[1],
          game.players[2],
          game.players[3],
        ],
      });
      mocks.gameMutator.removePlayerAttributeByNameAndSourceInGame.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.swapTargetAndDevotedServantCurrentRoleAndSide.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.applyTargetStolenRoleOutcomes.mockReturnValueOnce(game);
      mocks.devotedServantGamePlayMakerService.makeDevotedServantDelegatesIfSheriff.mockReturnValueOnce(game);
      const result = services.devotedServantGamePlayMaker.devotedServantStealsRole(players[0] as DeadPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyWildChildStolenRoleOutcome", () => {
    it("should return game as is when worshiped player is not in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.devotedServantGamePlayMaker["applyWildChildStolenRoleOutcome"](game)).toStrictEqual<Game>(game);
    });

    it("should remove worshiped player attribute from worshiped player when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          game.players[0],
          game.players[1],
          createFakePlayer({ ...game.players[2], attributes: [] }),
          game.players[3],
        ],
      });

      expect(services.devotedServantGamePlayMaker["applyWildChildStolenRoleOutcome"](game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyTargetStolenRoleOutcomes", () => {
    beforeEach(() => {
      mocks.devotedServantGamePlayMakerService.applyWildChildStolenRoleOutcome = jest.spyOn(services.devotedServantGamePlayMaker as unknown as { applyWildChildStolenRoleOutcome }, "applyWildChildStolenRoleOutcome").mockImplementation();
    });

    it("should return game as is when target role is not in role outcomes methods.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.devotedServantGamePlayMaker["applyTargetStolenRoleOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should apply wild child stolen role outcome when target role is wild child.", () => {
      const players = [
        createFakeWildChildAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame(game);
      expectedGame.players[3].attributes = [];
      services.devotedServantGamePlayMaker["applyTargetStolenRoleOutcomes"](players[0] as DeadPlayer, game);

      expect(mocks.devotedServantGamePlayMakerService.applyWildChildStolenRoleOutcome).toHaveBeenCalledExactlyOnceWith(game);
    });
  });

  describe("swapTargetAndDevotedServantCurrentRoleAndSide", () => {
    it("should swap target and devoted servant current role and side when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      players[0].role.isRevealed = false;
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame(game);
      expectedGame.players[0].role.current = "devoted-servant";
      expectedGame.players[0].side.current = RoleSides.VILLAGERS;
      expectedGame.players[3].role.current = "werewolf";
      expectedGame.players[3].side.current = RoleSides.WEREWOLVES;
      expectedGame.players[3].role.isRevealed = false;

      expect(services.devotedServantGamePlayMaker["swapTargetAndDevotedServantCurrentRoleAndSide"](players[0] as DeadPlayer, players[3], game)).toStrictEqual<Game>(expectedGame);
    });

    it("should swap target and devoted servant current role but not side when devoted servant is currently in werewoles side.", () => {
      const players = [
        createFakeSeerAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      players[0].role.isRevealed = false;
      players[3].side.current = RoleSides.WEREWOLVES;
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame(game);
      expectedGame.players[0].role.current = "devoted-servant";
      expectedGame.players[0].side.current = RoleSides.VILLAGERS;
      expectedGame.players[3].role.current = "seer";
      expectedGame.players[3].side.current = RoleSides.WEREWOLVES;
      expectedGame.players[3].role.isRevealed = false;

      expect(services.devotedServantGamePlayMaker["swapTargetAndDevotedServantCurrentRoleAndSide"](players[0] as DeadPlayer, players[3], game)).toStrictEqual<Game>(expectedGame);
    });

    it("should remain role revelation when swapping target and devoted servant current role and side when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      players[0].role.isRevealed = true;
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame(game);
      expectedGame.players[0].role.current = "devoted-servant";
      expectedGame.players[0].side.current = RoleSides.VILLAGERS;
      expectedGame.players[3].role.current = "werewolf";
      expectedGame.players[3].side.current = RoleSides.WEREWOLVES;
      expectedGame.players[3].role.isRevealed = true;

      expect(services.devotedServantGamePlayMaker["swapTargetAndDevotedServantCurrentRoleAndSide"](players[0] as DeadPlayer, players[3], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("makeDevotedServantDelegatesIfSheriff", () => {
    it("should return game as is when devoted servant cannot delegate sheriff attribute.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.playerAttributeHelper.canPlayerDelegateSheriffAttribute.mockReturnValueOnce(false);

      expect(services.devotedServantGamePlayMaker["makeDevotedServantDelegatesIfSheriff"](players[3], game)).toStrictEqual<Game>(game);
    });

    it("should prepend sheriff delegates to upcoming plays when devoted servant can delegate sheriff attribute.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death: createFakePlayerDeath() }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createGamePlaySheriffDelegates()],
      });

      expect(services.devotedServantGamePlayMaker["makeDevotedServantDelegatesIfSheriff"](players[3], game)).toStrictEqual<Game>(expectedGame);
    });
  });
});