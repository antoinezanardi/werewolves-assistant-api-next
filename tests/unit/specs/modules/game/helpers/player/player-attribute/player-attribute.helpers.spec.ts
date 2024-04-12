import { canPlayerDelegateSheriffAttribute, doesPlayerHaveActiveAttributeWithName, doesPlayerHaveActiveAttributeWithNameAndSource, doesPlayerHaveAttributeWithName, doesPlayerHaveAttributeWithNameAndSource, getActivePlayerAttributeWithName, getPlayerAttributeWithName, getPlayerAttributeWithNameAndSource, isPlayerAttributeActive } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePlayerAttributeActivation, createFakePowerlessByActorPlayerAttribute, createFakePowerlessByElderPlayerAttribute, createFakePowerlessByWerewolvesPlayerAttribute, createFakeSeenBySeerPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeIdiotAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Player Attribute Helper", () => {
  describe("isPlayerAttrimakeDevotedServantDelegatesIfSheriffbuteActive", () => {
    it.each<{
      test: string;
      attribute: PlayerAttribute;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return true when activation is undefined.",
        attribute: createFakePowerlessByElderPlayerAttribute(),
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return false when activation turn is not reached yet.",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phaseName: "day" }) }),
        game: createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "day" }) }),
        expected: false,
      },
      {
        test: "should return true when activation turn is reached (+1).",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phaseName: "day" }) }),
        game: createFakeGame({ turn: 2, phase: createFakeGamePhase({ name: "day" }) }),
        expected: true,
      },
      {
        test: "should return false when activation turn is same as game's turn but game's phase is NIGHT and activation phase is DAY.",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phaseName: "day" }) }),
        game: createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "night" }) }),
        expected: false,
      },
      {
        test: "should return true when activation turn is same as game's turn and phase too.",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phaseName: "night" }) }),
        game: createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "night" }) }),
        expected: true,
      },
      {
        test: "should return true when activation turn is same as game's turn, phase are different but game's phase is DAY anyway.",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phaseName: "night" }) }),
        game: createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "day" }) }),
        expected: true,
      },
    ])("$test", ({ attribute, game, expected }) => {
      expect(isPlayerAttributeActive(attribute, game)).toBe(expected);
    });
  });

  describe("getPlayerAttributeWithName", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithName(player, "powerless")).toStrictEqual<PlayerAttribute>(attributes[1]);
    });

    it("should return undefined when player doesn't have the attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithName(player, "in-love")).toBeUndefined();
    });
  });

  describe("doesPlayerHaveAttributeWithName", () => {
    it.each<{
      test: string;
      attributes: PlayerAttribute[];
      expected: boolean;
    }>([
      {
        test: "should return false when player doesn't have any attributes.",
        attributes: [],
        expected: false,
      },
      {
        test: "should return false when player doesn't have the attribute.",
        attributes: [createFakeEatenByWerewolvesPlayerAttribute()],
        expected: false,
      },
      {
        test: "should return true when player has the attribute.",
        attributes: [createFakeSeenBySeerPlayerAttribute()],
        expected: true,
      },
    ])("$test", ({ attributes, expected }) => {
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithName(player, "seen")).toBe(expected);
    });
  });

  describe("getActivePlayerAttributeWithName", () => {
    it("should return undefined when player doesn't have the attribute.", () => {
      const game = createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "day" }) });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getActivePlayerAttributeWithName(player, "in-love", game)).toBeUndefined();
    });

    it("should return undefined when player has the attribute but not active yet.", () => {
      const game = createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "day" }) });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phaseName: "day" }) }),
      ];
      const player = createFakePlayer({ attributes });

      expect(getActivePlayerAttributeWithName(player, "in-love", game)).toBeUndefined();
    });

    it("should return the attribute when player has the attribute and is active yet.", () => {
      const game = createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "day" }) });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phaseName: "day" }) }),
      ];
      const player = createFakePlayer({ attributes });

      expect(getActivePlayerAttributeWithName(player, "in-love", game)).toStrictEqual<PlayerAttribute>(attributes[1]);
    });
  });

  describe("doesPlayerHaveActiveAttributeWithName", () => {
    it.each<{
      test: string;
      attributes: PlayerAttribute[];
      expected: boolean;
    }>([
      {
        test: "should return false when player doesn't have any attributes.",
        attributes: [],
        expected: false,
      },
      {
        test: "should return false when player doesn't have the attribute.",
        attributes: [createFakeEatenByWerewolvesPlayerAttribute()],
        expected: false,
      },
      {
        test: "should return false when player has the attribute but not active yet.",
        attributes: [createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phaseName: "day" }) })],
        expected: false,
      },
      {
        test: "should return true when player has the attribute and is active yet.",
        attributes: [createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phaseName: "day" }) })],
        expected: true,
      },
    ])("$test", ({ attributes, expected }) => {
      const game = createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "day" }) });
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveActiveAttributeWithName(player, "in-love", game)).toBe(expected);
    });
  });

  describe("getPlayerAttributeWithNameAndSource", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, "powerless", "elder")).toStrictEqual<PlayerAttribute>(attributes[1]);
    });

    it("should return undefined when player doesn't have the attribute with correct name.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, "in-love", "elder")).toBeUndefined();
    });

    it("should return undefined when player doesn't have the attribute with correct source.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, "powerless", "cupid")).toBeUndefined();
    });
  });

  describe("doesPlayerHaveAttributeWithNameAndSource", () => {
    it.each<{
      test: string;
      attributes: PlayerAttribute[];
      expected: boolean;
    }>([
      {
        test: "should return false when player doesn't have any attributes.",
        attributes: [],
        expected: false,
      },
      {
        test: "should return false when player doesn't have the attribute with correct name.",
        attributes: [createFakeEatenByWerewolvesPlayerAttribute()],
        expected: false,
      },
      {
        test: "should return false when player doesn't have the attribute with correct source.",
        attributes: [createFakePowerlessByElderPlayerAttribute({ source: "fox" })],
        expected: false,
      },
      {
        test: "should return true when player has the attribute.",
        attributes: [createFakePowerlessByElderPlayerAttribute()],
        expected: true,
      },
    ])("$test", ({ attributes, expected }) => {
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, "powerless", "elder")).toBe(expected);
    });
  });

  describe("doesPlayerHaveActiveAttributeWithNameAndSource", () => {
    it.each<{
      test: string;
      attributes: PlayerAttribute[];
      expected: boolean;
    }>([
      {
        test: "should return false when player doesn't have any attributes.",
        attributes: [],
        expected: false,
      },
      {
        test: "should return false when player doesn't have the attribute with correct name.",
        attributes: [createFakeEatenByWerewolvesPlayerAttribute()],
        expected: false,
      },
      {
        test: "should return false when player doesn't have the attribute with correct source.",
        attributes: [createFakePowerlessByElderPlayerAttribute({ source: "fox" })],
        expected: false,
      },
      {
        test: "should return false when player has the attribute but not active yet.",
        attributes: [createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phaseName: "day" }) })],
        expected: false,
      },
      {
        test: "should return true when player has the attribute and is active yet.",
        attributes: [createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phaseName: "day" }) })],
        expected: true,
      },
    ])("$test", ({ attributes, expected }) => {
      const game = createFakeGame({ turn: 1, phase: createFakeGamePhase({ name: "day" }) });
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveActiveAttributeWithNameAndSource(player, "powerless", "elder", game)).toBe(expected);
    });
  });

  describe("canPlayerDelegateSheriffAttribute", () => {
    it.each<{
      test: string;
      player: Player;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when player doesn't have the sheriff attribute.",
        player: createFakeSeerAlivePlayer({ attributes: [] }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when player has the sheriff attribute but is the idiot and is powerful.",
        player: createFakeIdiotAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return true when player has the sheriff attribute but is the idiot and powerless.",
        player: createFakePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakePowerlessByActorPlayerAttribute()] }),
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return true when player has the sheriff attribute and is not powerful.",
        player: createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakePowerlessByWerewolvesPlayerAttribute()] }),
        game: createFakeGame(),
        expected: true,
      },
    ])("$test", ({ player, game, expected }) => {
      expect(canPlayerDelegateSheriffAttribute(player, game)).toBe(expected);
    });
  });
});