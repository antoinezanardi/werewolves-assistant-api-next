import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../src/modules/game/enums/player.enum";
import { canPiedPiperCharm, doesPlayerHaveAttribute, isPlayerAliveAndPowerful } from "../../../../../../src/modules/game/helpers/player/player.helper";
import { ROLE_SIDES } from "../../../../../../src/modules/role/enums/role.enum";
import { createFakePlayer, createFakePlayerAttribute, createFakePlayerSide } from "../../../../../factories/game/schemas/player/player.schema.factory";

describe("Player Helper", () => {
  describe("doesPlayerHaveAttribute", () => {
    it("should return false when player doesn't have any attributes.", () => {
      const player = createFakePlayer({ attributes: [] });
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return false when player doesn't have the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakePlayerAttribute({ name: PLAYER_ATTRIBUTE_NAMES.EATEN })] });
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return true when player has the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakePlayerAttribute({ name: PLAYER_ATTRIBUTE_NAMES.SEEN })] });
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(true);
    });
  });

  describe("canPiedPiperCharm", () => {
    it("should return false when pied piper is powerless.", () => {
      const piedPiperPlayer = createFakePlayer({ attributes: [createFakePlayerAttribute({ name: PLAYER_ATTRIBUTE_NAMES.POWERLESS })] });
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(false);
    });

    it("should return false when pied piper is dead.", () => {
      const piedPiperPlayer = createFakePlayer({ attributes: [], isAlive: false });
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(false);
    });

    it("should return false when pied piper is infected and thus is powerless.", () => {
      const piedPiperPlayer = createFakePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }), attributes: [], isAlive: true });
      expect(canPiedPiperCharm(piedPiperPlayer, true)).toBe(false);
    });

    it("should return true when pied piper is infected but original rule is not respected.", () => {
      const piedPiperPlayer = createFakePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }), attributes: [], isAlive: true });
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(true);
    });

    it("should return true when pied piper is not powerless and currently a villager.", () => {
      const piedPiperPlayer = createFakePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.VILLAGERS }), attributes: [], isAlive: true });
      expect(canPiedPiperCharm(piedPiperPlayer, true)).toBe(true);
    });
  });

  describe("isPlayerAliveAndPowerful", () => {
    it("should return false when player is dead.", () => {
      const player = createFakePlayer({ isAlive: false, attributes: [] });
      expect(isPlayerAliveAndPowerful(player)).toBe(false);
    });

    it("should return false when player is powerless.", () => {
      const player = createFakePlayer({ isAlive: true, attributes: [createFakePlayerAttribute({ name: PLAYER_ATTRIBUTE_NAMES.POWERLESS })] });
      expect(isPlayerAliveAndPowerful(player)).toBe(false);
    });

    it("should return true when player is alive and powerful.", () => {
      const player = createFakePlayer({ isAlive: true, attributes: [] });
      expect(isPlayerAliveAndPowerful(player)).toBe(true);
    });
  });
});