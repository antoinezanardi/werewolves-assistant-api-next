import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { canPlayerDelegateSheriffAttribute, doesPlayerHaveActiveAttributeWithName, doesPlayerHaveActiveAttributeWithNameAndSource, doesPlayerHaveAttributeWithName, doesPlayerHaveAttributeWithNameAndSource, getActivePlayerAttributeWithName, getPlayerAttributeWithName, getPlayerAttributeWithNameAndSource, isPlayerAttributeActive } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeIdiotAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePlayerAttributeActivation, createFakePowerlessByActorPlayerAttribute, createFakePowerlessByElderPlayerAttribute, createFakePowerlessByWerewolvesPlayerAttribute, createFakeSeenBySeerPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";

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
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phase: GamePhases.DAY }) }),
        game: createFakeGame({ turn: 1, phase: GamePhases.DAY }),
        expected: false,
      },
      {
        test: "should return true when activation turn is reached (+1).",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) }),
        game: createFakeGame({ turn: 2, phase: GamePhases.DAY }),
        expected: true,
      },
      {
        test: "should return false when activation turn is same as game's turn but game's phase is NIGHT and activation phase is DAY.",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) }),
        game: createFakeGame({ turn: 1, phase: GamePhases.NIGHT }),
        expected: false,
      },
      {
        test: "should return true when activation turn is same as game's turn and phase too.",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.NIGHT }) }),
        game: createFakeGame({ turn: 1, phase: GamePhases.NIGHT }),
        expected: true,
      },
      {
        test: "should return true when activation turn is same as game's turn, phase are different but game's phase is DAY anyway.",
        attribute: createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.NIGHT }) }),
        game: createFakeGame({ turn: 1, phase: GamePhases.DAY }),
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

      expect(getPlayerAttributeWithName(player, PlayerAttributeNames.POWERLESS)).toStrictEqual<PlayerAttribute>(attributes[1]);
    });

    it("should return undefined when player doesn't have the attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithName(player, PlayerAttributeNames.IN_LOVE)).toBeUndefined();
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

      expect(doesPlayerHaveAttributeWithName(player, PlayerAttributeNames.SEEN)).toBe(expected);
    });
  });

  describe("getActivePlayerAttributeWithName", () => {
    it("should return undefined when player doesn't have the attribute.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getActivePlayerAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game)).toBeUndefined();
    });

    it("should return undefined when player has the attribute but not active yet.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phase: GamePhases.DAY }) }),
      ];
      const player = createFakePlayer({ attributes });

      expect(getActivePlayerAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game)).toBeUndefined();
    });

    it("should return the attribute when player has the attribute and is active yet.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) }),
      ];
      const player = createFakePlayer({ attributes });

      expect(getActivePlayerAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game)).toStrictEqual<PlayerAttribute>(attributes[1]);
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
        attributes: [createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phase: GamePhases.DAY }) })],
        expected: false,
      },
      {
        test: "should return true when player has the attribute and is active yet.",
        attributes: [createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) })],
        expected: true,
      },
    ])("$test", ({ attributes, expected }) => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game)).toBe(expected);
    });
  });

  describe("getPlayerAttributeWithNameAndSource", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.ELDER)).toStrictEqual<PlayerAttribute>(attributes[1]);
    });

    it("should return undefined when player doesn't have the attribute with correct name.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PlayerAttributeNames.IN_LOVE, RoleNames.ELDER)).toBeUndefined();
    });

    it("should return undefined when player doesn't have the attribute with correct source.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByElderPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.CUPID)).toBeUndefined();
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
        attributes: [createFakePowerlessByElderPlayerAttribute({ source: RoleNames.FOX })],
        expected: false,
      },
      {
        test: "should return true when player has the attribute.",
        attributes: [createFakePowerlessByElderPlayerAttribute()],
        expected: true,
      },
    ])("$test", ({ attributes, expected }) => {
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.ELDER)).toBe(expected);
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
        attributes: [createFakePowerlessByElderPlayerAttribute({ source: RoleNames.FOX })],
        expected: false,
      },
      {
        test: "should return false when player has the attribute but not active yet.",
        attributes: [createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phase: GamePhases.DAY }) })],
        expected: false,
      },
      {
        test: "should return true when player has the attribute and is active yet.",
        attributes: [createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) })],
        expected: true,
      },
    ])("$test", ({ attributes, expected }) => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveActiveAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.ELDER, game)).toBe(expected);
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