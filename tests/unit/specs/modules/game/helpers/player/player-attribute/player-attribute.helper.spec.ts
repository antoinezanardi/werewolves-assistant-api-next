import { GAME_PHASES } from "../../../../../../../../src/modules/game/enums/game.enum";
import { isPlayerAttributeActive } from "../../../../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePlayerAttributeActivation, createFakePowerlessByAncientPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";

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
});