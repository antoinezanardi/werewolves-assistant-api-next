import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { createAngelGameVictory, createGameVictory, createLoversGameVictory, createNoneGameVictory, createPiedPiperGameVictory, createVillagersGameVictory, createWerewolvesGameVictory, createWhiteWerewolfGameVictory } from "@/modules/game/helpers/game-victory/game-victory.factory";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

import { createFakeGameVictory } from "@tests/factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeInLoveByCupidPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelAlivePlayer, createFakePiedPiperAlivePlayer, createFakeSeerAlivePlayer, createFakeAccursedWolfFatherAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Victory Factory", () => {
  describe("createNoneGameVictory", () => {
    it("should create a none game victory when called.", () => {
      const expectedGameVictory: GameVictory = { type: GameVictoryTypes.NONE };

      expect(createNoneGameVictory()).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });
  
  describe("createAngelGameVictory", () => {
    it("should create angel game victory with winners when called with angel in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.ANGEL,
        winners: [players[5]],
      };

      expect(createAngelGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });

    it("should create angel game victory without winners when called without angel in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeWhiteWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.ANGEL,
        winners: undefined,
      };

      expect(createAngelGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });

  describe("createLoversGameVictory", () => {
    it("should create lovers game victory when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWhiteWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.LOVERS,
        winners: [
          players[1],
          players[3],
        ],
      };

      expect(createLoversGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });

  describe("createPiedPiperGameVictory", () => {
    it("should create pied piper game victory with winner when called with pied piper in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.PIED_PIPER,
        winners: [players[3]],
      };

      expect(createPiedPiperGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });

    it("should create pied piper game victory without winner when called without pied piper in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.PIED_PIPER,
        winners: undefined,
      };

      expect(createPiedPiperGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });

  describe("createWhiteWerewolfGameVictory", () => {
    it("should create white werewolf game victory with winner when called with white werewolf in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeWhiteWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.WHITE_WEREWOLF,
        winners: [players[4]],
      };

      expect(createWhiteWerewolfGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });

    it("should create white werewolf game victory without winner when called without white werewolf in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.WHITE_WEREWOLF,
        winners: undefined,
      };

      expect(createWhiteWerewolfGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });
  
  describe("createWerewolvesGameVictory", () => {
    it("should create werewolves game victory when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeWhiteWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.WEREWOLVES,
        winners: [
          players[0],
          players[2],
          players[4],
        ],
      };

      expect(createWerewolvesGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });

  describe("createVillagersGameVictory", () => {
    it("should create villagers game victory when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeWhiteWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.VILLAGERS,
        winners: [
          players[1],
          players[3],
        ],
      };

      expect(createVillagersGameVictory(game)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });

  describe("createGameVictory", () => {
    it("should create game victory when called.", () => {
      const player = createFakePlayer();
      const expectedGameVictory: GameVictory = {
        type: GameVictoryTypes.ANGEL,
        winners: [player],
      };

      expect(createGameVictory(expectedGameVictory)).toStrictEqual<GameVictory>(createFakeGameVictory(expectedGameVictory));
    });
  });
});