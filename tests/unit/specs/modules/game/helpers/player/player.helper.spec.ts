import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../src/modules/game/enums/player.enum";
import { canPiedPiperCharm, doesPlayerHaveAttribute, isPlayerAliveAndPowerful } from "../../../../../../../src/modules/game/helpers/player/player.helper";
import { ROLE_SIDES } from "../../../../../../../src/modules/role/enums/role.enum";
import { createFakePlayerEatenAttribute, createFakePlayerPowerlessAttribute, createFakePlayerSeenAttribute } from "../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePiedPiperPlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerSide } from "../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Player Helper", () => {
  describe("doesPlayerHaveAttribute", () => {
    it("should return false when player doesn't have any attributes.", () => {
      const player = createFakePlayer({ attributes: [] });
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return false when player doesn't have the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakePlayerEatenAttribute()] });
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return true when player has the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakePlayerSeenAttribute()] });
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(true);
    });
  });

  describe("canPiedPiperCharm", () => {
    it("should return false when pied piper is powerless.", () => {
      const piedPiperPlayer = createFakePiedPiperPlayer({ attributes: [createFakePlayerPowerlessAttribute()] });
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(false);
    });

    it("should return false when pied piper is dead.", () => {
      const piedPiperPlayer = createFakePiedPiperPlayer({ attributes: [], isAlive: false });
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(false);
    });

    it("should return false when pied piper is infected and thus is powerless.", () => {
      const piedPiperPlayer = createFakePiedPiperPlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) });
      expect(canPiedPiperCharm(piedPiperPlayer, true)).toBe(false);
    });

    it("should return true when pied piper is infected but original rule is not respected.", () => {
      const piedPiperPlayer = createFakePiedPiperPlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) });
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(true);
    });

    it("should return true when pied piper is not powerless and currently a villager.", () => {
      const piedPiperPlayer = createFakePiedPiperPlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.VILLAGERS }) });
      expect(canPiedPiperCharm(piedPiperPlayer, true)).toBe(true);
    });
  });

  describe("isPlayerAliveAndPowerful", () => {
    it("should return false when player is dead.", () => {
      const player = createFakePlayer({ isAlive: false, attributes: [] });
      expect(isPlayerAliveAndPowerful(player)).toBe(false);
    });

    it("should return false when player is powerless.", () => {
      const player = createFakePlayer({ isAlive: true, attributes: [createFakePlayerPowerlessAttribute()] });
      expect(isPlayerAliveAndPowerful(player)).toBe(false);
    });

    it("should return true when player is alive and powerful.", () => {
      const player = createFakePlayer({ isAlive: true, attributes: [] });
      expect(isPlayerAliveAndPowerful(player)).toBe(true);
    });
  });
});