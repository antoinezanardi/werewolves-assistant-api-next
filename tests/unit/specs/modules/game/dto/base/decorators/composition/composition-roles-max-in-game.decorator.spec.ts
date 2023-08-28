import {
  getCompositionRolesMaxInGameDefaultMessage,
  areCompositionRolesMaxInGameRespected,
} from "@/modules/game/dto/base/decorators/composition/composition-roles-max-in-game.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { bulkCreateFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Roles Max In Game Decorator", () => {
  describe("areCompositionRolesMaxInGameRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(areCompositionRolesMaxInGameRespected(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(areCompositionRolesMaxInGameRespected(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(areCompositionRolesMaxInGameRespected([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players doesn't have the good structure.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(areCompositionRolesMaxInGameRespected([...players, { name: "bad", role: { toto: "tata" } }])).toBe(false);
    });

    it("should return false when there is 2 players with the same role but max in game is 1.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(areCompositionRolesMaxInGameRespected(players)).toBe(false);
    });

    it("should return true when players are empty.", () => {
      expect(areCompositionRolesMaxInGameRespected([])).toBe(true);
    });

    it("should return true when the limit for each role is respected.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(8, [
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
        { role: { name: RoleNames.VILLAGER } },
        { role: { name: RoleNames.VILLAGER } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(areCompositionRolesMaxInGameRespected(players)).toBe(true);
    });
  });

  describe("playersRoleLimitDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionRolesMaxInGameDefaultMessage()).toBe("players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles");
    });
  });
});