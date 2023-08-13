import { GAME_PHASES } from "../../../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../../src/modules/game/enums/player.enum";
import { doesPlayerHaveAttributeWithName, doesPlayerHaveAttributeWithNameAndSource, getPlayerAttributeWithName, getPlayerAttributeWithNameAndSource, isPlayerAttributeActive } from "../../../../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeEatenByWerewolvesPlayerAttribute, createFakePlayerAttributeActivation, createFakePowerlessByAncientPlayerAttribute, createFakeSeenBySeerPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Player Attribute Helper", () => {
  describe("isPlayerAttributeActive", () => {
    it("should return true when activation is undefined.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute();
      const game = createFakeGame();

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });

    it("should return false when activation turn is not reached yet.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2, phase: GAME_PHASES.DAY }) });
      const game = createFakeGame({ turn: 1, phase: GAME_PHASES.DAY });

      expect(isPlayerAttributeActive(attribute, game)).toBe(false);
    });

    it("should return true when activation turn is reached (+1).", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GAME_PHASES.DAY }) });
      const game = createFakeGame({ turn: 2, phase: GAME_PHASES.DAY });

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });

    it("should return false when activation turn is same as game's turn but game's phase is NIGHT and activation phase is DAY.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GAME_PHASES.DAY }) });
      const game = createFakeGame({ turn: 1, phase: GAME_PHASES.NIGHT });

      expect(isPlayerAttributeActive(attribute, game)).toBe(false);
    });

    it("should return true when activation turn is same as game's turn and phase too.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GAME_PHASES.NIGHT }) });
      const game = createFakeGame({ turn: 1, phase: GAME_PHASES.NIGHT });

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });

    it("should return true when activation turn is same as game's turn, phase are different but game's phase is DAY anyway.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 1, phase: GAME_PHASES.NIGHT }) });
      const game = createFakeGame({ turn: 1, phase: GAME_PHASES.DAY });

      expect(isPlayerAttributeActive(attribute, game)).toBe(true);
    });
  });

  describe("doesPlayerHaveAttributeWithName", () => {
    it("should return false when player doesn't have any attributes.", () => {
      const player = createFakePlayer({ attributes: [] });

      expect(doesPlayerHaveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return false when player doesn't have the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] });

      expect(doesPlayerHaveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return true when player has the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakeSeenBySeerPlayerAttribute()] });

      expect(doesPlayerHaveAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(true);
    });
  });
  
  describe("getPlayerAttributeWithName", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS)).toStrictEqual(attributes[1]);
    });
    
    it("should return undefined when player doesn't have the attribute.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithName(player, PLAYER_ATTRIBUTE_NAMES.IN_LOVE)).toBeUndefined();
    });
  });

  describe("doesPlayerHaveAttributeWithNameAndSource", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS, ROLE_NAMES.ANCIENT)).toBe(true);
    });

    it("should return undefined when player doesn't have the attribute with correct name.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, PLAYER_ATTRIBUTE_NAMES.IN_LOVE, ROLE_NAMES.ANCIENT)).toBe(false);
    });

    it("should return undefined when player doesn't have the attribute with correct source.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(doesPlayerHaveAttributeWithNameAndSource(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS, ROLE_NAMES.CUPID)).toBe(false);
    });
  });

  describe("getPlayerAttributeWithNameAndSource", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS, ROLE_NAMES.ANCIENT)).toStrictEqual(attributes[1]);
    });

    it("should return undefined when player doesn't have the attribute with correct name.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PLAYER_ATTRIBUTE_NAMES.IN_LOVE, ROLE_NAMES.ANCIENT)).toBeUndefined();
    });

    it("should return undefined when player doesn't have the attribute with correct source.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttributeWithNameAndSource(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS, ROLE_NAMES.CUPID)).toBeUndefined();
    });
  });
});