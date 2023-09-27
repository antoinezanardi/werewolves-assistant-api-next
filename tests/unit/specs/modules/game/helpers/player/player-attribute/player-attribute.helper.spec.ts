import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { doesPlayerHaveActiveAttributeWithName, doesPlayerHaveAttributeWithName, doesPlayerHaveAttributeWithNameAndSource, getActivePlayerAttributeWithName, getPlayerAttributeWithName, getPlayerAttributeWithNameAndSource, isPlayerAttributeActive } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePlayerAttributeActivation, createFakePowerlessByAncientPlayerAttribute, createFakeSeenBySeerPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";

describe("Player Attribute Helper", () => {
  describe("isPlayerAttributeActive", () => {
    it("should return true when activation is undefined.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute();
      const game = createFakeGame();

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });

    it("should return false when activation turn is not reached yet.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phase: GamePhases.DAY }) });
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });

      expect(isPlayerAttributeActive(attribute, game)).toBe(false);
    });

    it("should return true when activation turn is reached (+1).", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) });
      const game = createFakeGame({ turn: 2, phase: GamePhases.DAY });

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });

    it("should return false when activation turn is same as game's turn but game's phase is NIGHT and activation phase is DAY.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) });
      const game = createFakeGame({ turn: 1, phase: GamePhases.NIGHT });

      expect(isPlayerAttributeActive(attribute, game)).toBe(false);
    });

    it("should return true when activation turn is same as game's turn and phase too.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.NIGHT }) });
      const game = createFakeGame({ turn: 1, phase: GamePhases.NIGHT });

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });

    it("should return true when activation turn is same as game's turn, phase are different but game's phase is DAY anyway.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.NIGHT }) });
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });
  });

  describe("getPlayerAttributeWithName", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithName(player, PlayerAttributeNames.POWERLESS)).toStrictEqual(attributes[1]);
    });

    it("should return undefined when player doesn't have the attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithName(player, PlayerAttributeNames.IN_LOVE)).toBeUndefined();
    });
  });

  describe("doesPlayerHaveAttributeWithName", () => {
    it("should return false when player doesn't have any attributes.", () => {
      const player = createFakePlayer({ attributes: [] });

      expect(doesPlayerHaveAttributeWithName(player, PlayerAttributeNames.SEEN)).toBe(false);
    });

    it("should return false when player doesn't have the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] });

      expect(doesPlayerHaveAttributeWithName(player, PlayerAttributeNames.SEEN)).toBe(false);
    });

    it("should return true when player has the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakeSeenBySeerPlayerAttribute()] });

      expect(doesPlayerHaveAttributeWithName(player, PlayerAttributeNames.SEEN)).toBe(true);
    });
  });

  describe("getActivePlayerAttributeWithName", () => {
    it("should return undefined when player doesn't have the attribute.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
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
    it("should return false when player doesn't have the attribute.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game)).toBe(false);
    });

    it("should return false when player has the attribute but not active yet.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phase: GamePhases.DAY }) }),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game)).toBe(false);
    });

    it("should return true when player has the attribute and is active yet.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakeInLoveByCupidPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GamePhases.DAY }) }),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.IN_LOVE, game)).toBe(true);
    });
  });

  describe("getPlayerAttributeWithNameAndSource", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.ANCIENT)).toStrictEqual(attributes[1]);
    });

    it("should return undefined when player doesn't have the attribute with correct name.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PlayerAttributeNames.IN_LOVE, RoleNames.ANCIENT)).toBeUndefined();
    });

    it("should return undefined when player doesn't have the attribute with correct source.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.CUPID)).toBeUndefined();
    });
  });

  describe("doesPlayerHaveAttributeWithNameAndSource", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.ANCIENT)).toBe(true);
    });

    it("should return undefined when player doesn't have the attribute with correct name.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, PlayerAttributeNames.IN_LOVE, RoleNames.ANCIENT)).toBe(false);
    });

    it("should return undefined when player doesn't have the attribute with correct source.", () => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, PlayerAttributeNames.POWERLESS, RoleNames.CUPID)).toBe(false);
    });
  });
});