import { getCompositionGroupsSizeDefaultMessage, isCompositionGroupsSizeRespected } from "@/modules/game/dto/base/decorators/composition/composition-groups-size.decorator";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Groups Size Decorator", () => {
  describe("isCompositionGroupsSizeRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(isCompositionGroupsSizeRespected(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(isCompositionGroupsSizeRespected(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = [
        { role: { name: "fox" } },
        { role: { name: "villager" } },
        { role: { name: "werewolf" } },
        { role: { name: "witch" } },
      ];

      expect(isCompositionGroupsSizeRespected([...players, "toto"])).toBe(false);
    });

    it("should return true when there are no groups among players.", () => {
      const players = [
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
      ];

      expect(isCompositionGroupsSizeRespected(players)).toBe(true);
    });

    it("should return false when one group size is only one player.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ group: "boy" }),
        createFakeCreateGamePlayerDto({ group: "boy" }),
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto({ group: "girl" }),
      ];

      expect(isCompositionGroupsSizeRespected(players)).toBe(false);
    });

    it("should return true when all groups have at least two players.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ group: "boy" }),
        createFakeCreateGamePlayerDto({ group: "boy" }),
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto({ group: "girl" }),
        createFakeCreateGamePlayerDto({ group: "girl" }),
      ];

      expect(isCompositionGroupsSizeRespected(players)).toBe(true);
    });
  });

  describe("getCompositionGroupsSizeDefaultMessage", () => {
    it("should return the default message when called.", () => {
      expect(getCompositionGroupsSizeDefaultMessage()).toBe("groups among players must contain at least two players when there is a prejudiced manipulator in the game");
    });
  });
});