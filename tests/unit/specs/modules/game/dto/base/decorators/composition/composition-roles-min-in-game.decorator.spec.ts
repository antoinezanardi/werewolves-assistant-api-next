import {
  getCompositionRolesMinInGameDefaultMessage,
  areCompositionRolesMinInGameRespected,
} from "@/modules/game/dto/base/decorators/composition/composition-roles-min-in-game.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { bulkCreateFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Roles Min In Game Decorator", () => {
  describe("areCompositionRolesMinInGameRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(areCompositionRolesMinInGameRespected(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(areCompositionRolesMinInGameRespected(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(areCompositionRolesMinInGameRespected([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players doesn't have the good structure.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(areCompositionRolesMinInGameRespected([...players, { name: "bad", role: { toto: "tata" } }])).toBe(false);
    });

    it("should return false when there is only 1 player with a role which min in game is 2.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(areCompositionRolesMinInGameRespected(players)).toBe(false);
    });

    it("should return true when players are empty.", () => {
      expect(areCompositionRolesMinInGameRespected([])).toBe(true);
    });

    it("should return true when the limit for each role is respected.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(9, [
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.THREE_BROTHERS } },
        { role: { name: RoleNames.THREE_BROTHERS } },
        { role: { name: RoleNames.THREE_BROTHERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
      ]);

      expect(areCompositionRolesMinInGameRespected(players)).toBe(true);
    });
  });

  describe("playersRoleLimitDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionRolesMinInGameDefaultMessage()).toBe("players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles");
    });
  });
});