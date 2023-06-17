import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../src/modules/game/enums/player.enum";
import { canPiedPiperCharm, doesPlayerHaveAttribute, isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide } from "../../../../../../../src/modules/game/helpers/player/player.helper";
import { ROLE_SIDES } from "../../../../../../../src/modules/role/enums/role.enum";
import { createFakeEatenByWerewolvesPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakeSeenBySeerPlayerAttribute } from "../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePiedPiperAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerSide } from "../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Player Helper", () => {
  describe("doesPlayerHaveAttribute", () => {
    it("should return false when player doesn't have any attributes.", () => {
      const player = createFakePlayer({ attributes: [] });
      
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return false when player doesn't have the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] });
      
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(false);
    });

    it("should return true when player has the attribute.", () => {
      const player = createFakePlayer({ attributes: [createFakeSeenBySeerPlayerAttribute()] });
      
      expect(doesPlayerHaveAttribute(player, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBe(true);
    });
  });

  describe("canPiedPiperCharm", () => {
    it("should return false when pied piper is powerless.", () => {
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] });
      
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(false);
    });

    it("should return false when pied piper is dead.", () => {
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ attributes: [], isAlive: false });
      
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(false);
    });

    it("should return false when pied piper is infected and thus is powerless.", () => {
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) });
      
      expect(canPiedPiperCharm(piedPiperPlayer, true)).toBe(false);
    });

    it("should return true when pied piper is infected but original rule is not respected.", () => {
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) });
      
      expect(canPiedPiperCharm(piedPiperPlayer, false)).toBe(true);
    });

    it("should return true when pied piper is not powerless and currently a villager.", () => {
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.VILLAGERS }) });
      
      expect(canPiedPiperCharm(piedPiperPlayer, true)).toBe(true);
    });
  });

  describe("isPlayerAliveAndPowerful", () => {
    it("should return false when player is dead.", () => {
      const player = createFakePlayer({ isAlive: false, attributes: [] });
      
      expect(isPlayerAliveAndPowerful(player)).toBe(false);
    });

    it("should return false when player is powerless.", () => {
      const player = createFakePlayer({ isAlive: true, attributes: [createFakePowerlessByAncientPlayerAttribute()] });
      
      expect(isPlayerAliveAndPowerful(player)).toBe(false);
    });

    it("should return true when player is alive and powerful.", () => {
      const player = createFakePlayer({ isAlive: true, attributes: [] });
      
      expect(isPlayerAliveAndPowerful(player)).toBe(true);
    });
  });

  describe("isPlayerOnWerewolvesSide", () => {
    it("should return false when player is on villagers side.", () => {
      expect(isPlayerOnWerewolvesSide(createFakePiedPiperAlivePlayer())).toBe(false);
    });

    it("should return true when player is on werewolves side.", () => {
      expect(isPlayerOnWerewolvesSide(createFakeWhiteWerewolfAlivePlayer())).toBe(true);
    });
  });

  describe("isPlayerOnVillagersSide", () => {
    it("should return true when player is on villagers side.", () => {
      expect(isPlayerOnVillagersSide(createFakePiedPiperAlivePlayer())).toBe(true);
    });

    it("should return false when player is on werewolves side.", () => {
      expect(isPlayerOnVillagersSide(createFakeWhiteWerewolfAlivePlayer())).toBe(false);
    });
  });
});