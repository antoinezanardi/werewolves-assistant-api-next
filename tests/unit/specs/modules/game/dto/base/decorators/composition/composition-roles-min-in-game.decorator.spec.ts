import { areCompositionRolesMinInGameRespected, getCompositionRolesMinInGameDefaultMessage } from "@/modules/game/dto/base/decorators/composition/composition-roles-min-in-game.decorator";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Roles Min In Game Decorator", () => {
  describe("areCompositionRolesMinInGameRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(areCompositionRolesMinInGameRespected(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(areCompositionRolesMinInGameRespected(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(areCompositionRolesMinInGameRespected([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players doesn't have the good structure.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(areCompositionRolesMinInGameRespected([...players, { name: "bad", role: { toto: "tata" } }])).toBe(false);
    });

    it("should return false when there is only 1 player with a role which min in game is 2.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(areCompositionRolesMinInGameRespected(players)).toBe(false);
    });

    it("should return true when players are empty.", () => {
      expect(areCompositionRolesMinInGameRespected([])).toBe(true);
    });

    it("should return true when the limit for each role is respected.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "three-brothers" } }),
        createFakeCreateGamePlayerDto({ role: { name: "three-brothers" } }),
        createFakeCreateGamePlayerDto({ role: { name: "three-brothers" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
      ];

      expect(areCompositionRolesMinInGameRespected(players)).toBe(true);
    });
  });

  describe("playersRoleLimitDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionRolesMinInGameDefaultMessage()).toBe("players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles");
    });
  });
});