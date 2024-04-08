import { areCompositionRolesMaxInGameRespected, getCompositionRolesMaxInGameDefaultMessage } from "@/modules/game/dto/base/decorators/composition/composition-roles-max-in-game.decorator";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Roles Max In Game Decorator", () => {
  describe("areCompositionRolesMaxInGameRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(areCompositionRolesMaxInGameRespected(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(areCompositionRolesMaxInGameRespected(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(areCompositionRolesMaxInGameRespected([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players doesn't have the good structure.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(areCompositionRolesMaxInGameRespected([...players, { name: "bad", role: { toto: "tata" } }])).toBe(false);
    });

    it("should return false when there is 2 players with the same role but max in game is 1.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(areCompositionRolesMaxInGameRespected(players)).toBe(false);
    });

    it("should return true when players are empty.", () => {
      expect(areCompositionRolesMaxInGameRespected([])).toBe(true);
    });

    it("should return true when the limit for each role is respected.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(areCompositionRolesMaxInGameRespected(players)).toBe(true);
    });
  });

  describe("playersRoleLimitDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionRolesMaxInGameDefaultMessage()).toBe("players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles");
    });
  });
});