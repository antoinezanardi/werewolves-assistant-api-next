import { GAME_PHASES } from "../../../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../../src/modules/game/enums/player.enum";
import { getPlayerAttribute, isPlayerAttributeActive } from "../../../../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePlayerAttributeActivation, createFakePowerlessByAncientPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
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
  
  describe("getPlayerAttribute", () => {
    it("should get attribute when player has this attribute.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttribute(player, PLAYER_ATTRIBUTE_NAMES.POWERLESS)).toStrictEqual(attributes[1]);
    });
    
    it("should return undefined when player doesn't have the attribute.", () => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakePowerlessByAncientPlayerAttribute(),
      ];
      const player = createFakePlayer({ attributes });

      expect(getPlayerAttribute(player, PLAYER_ATTRIBUTE_NAMES.IN_LOVE)).toBeUndefined();
    });
  });
});