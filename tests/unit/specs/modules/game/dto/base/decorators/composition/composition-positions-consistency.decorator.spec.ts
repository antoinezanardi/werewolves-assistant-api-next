import {
  doesCompositionHaveConsistentPositions,
  getCompositionPositionsConsistencyDefaultMessage,
} from "@/modules/game/dto/base/decorators/composition/composition-positions-consistency.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Positions Consistency Decorator", () => {
  describe("doesCompositionHaveConsistentPositions", () => {
    it("should return false when players are undefined.", () => {
      expect(doesCompositionHaveConsistentPositions(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(doesCompositionHaveConsistentPositions(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.TWO_SISTERS } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.TWO_SISTERS } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
      ];

      expect(doesCompositionHaveConsistentPositions([...players, "toto"])).toBe(false);
    });

    it("should return true when there is no position set in composition.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
      ];

      expect(doesCompositionHaveConsistentPositions(players)).toBe(true);
    });

    it("should return false when there is one position set in composition but not the others.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, position: 0 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
      ];

      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return false when there is twice the same position in composition.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, position: 0 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH }, position: 1 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER }, position: 3 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF }, position: 3 }),
      ];

      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return false when positions sequence starts at 1.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, position: 1 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH }, position: 2 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER }, position: 3 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF }, position: 4 }),
      ];

      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return false when there is one too high position in composition.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, position: 0 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH }, position: 1 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER }, position: 2 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF }, position: 666 }),
      ];

      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return true when all positions are sequence in composition.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, position: 0 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH }, position: 1 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER }, position: 2 }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF }, position: 3 }),
      ];

      expect(doesCompositionHaveConsistentPositions(players)).toBe(true);
    });
  });

  describe("getCompositionPositionsConsistencyDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionPositionsConsistencyDefaultMessage()).toBe("players.position must be all set or all undefined. Please check that every player has unique position, from 0 to players.length - 1");
    });
  });
});