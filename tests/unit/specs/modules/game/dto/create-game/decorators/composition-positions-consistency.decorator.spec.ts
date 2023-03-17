import {
  doesCompositionHaveConsistentPositions,
  getCompositionPositionsConsistencyDefaultMessage,
} from "../../../../../../../../src/modules/game/dto/create-game/decorators/composition-positions-consistency.decorator";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Positions Consistency Decorator", () => {
  describe("doesCompositionHaveConsistentPositions", () => {
    it("should return false when players are undefined.", () => {
      expect(doesCompositionHaveConsistentPositions(undefined)).toBe(false);
    });

    it("should return true when there is no position set in composition.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      expect(doesCompositionHaveConsistentPositions(players)).toBe(true);
    });

    it("should return false when there is one position set in composition but not the others.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER }, position: 0 },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return false when there is twice the same position in composition.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER }, position: 0 },
        { role: { name: ROLE_NAMES.WITCH }, position: 1 },
        { role: { name: ROLE_NAMES.SEER }, position: 3 },
        { role: { name: ROLE_NAMES.WEREWOLF }, position: 3 },
      ]);
      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return false when positions sequence starts at 1.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER }, position: 1 },
        { role: { name: ROLE_NAMES.WITCH }, position: 2 },
        { role: { name: ROLE_NAMES.SEER }, position: 3 },
        { role: { name: ROLE_NAMES.WEREWOLF }, position: 4 },
      ]);
      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return false when there is one too high position in composition.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER }, position: 0 },
        { role: { name: ROLE_NAMES.WITCH }, position: 1 },
        { role: { name: ROLE_NAMES.SEER }, position: 2 },
        { role: { name: ROLE_NAMES.WEREWOLF }, position: 666 },
      ]);
      expect(doesCompositionHaveConsistentPositions(players)).toBe(false);
    });

    it("should return true when all positions are sequence in composition.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER }, position: 0 },
        { role: { name: ROLE_NAMES.WITCH }, position: 1 },
        { role: { name: ROLE_NAMES.SEER }, position: 2 },
        { role: { name: ROLE_NAMES.WEREWOLF }, position: 3 },
      ]);
      expect(doesCompositionHaveConsistentPositions(players)).toBe(true);
    });
  });

  describe("getCompositionPositionsConsistencyDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionPositionsConsistencyDefaultMessage()).toBe("players.position must be all set or all undefined. Please check that every player has unique position, from 0 to players.length - 1");
    });
  });
});