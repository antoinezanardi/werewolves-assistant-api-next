import {
  getCompositionRolesMaxInGameDefaultMessage,
  areCompositionRolesMaxInGameRespected,
} from "../../../../../../../src/game/dto/create-game/decorators/composition-roles-max-in-game.decorator";
import { ROLE_NAMES } from "../../../../../../../src/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Roles Max In Game Decorator", () => {
  describe("areCompositionRolesMaxInGameRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(areCompositionRolesMaxInGameRespected(undefined)).toBe(false);
    });

    it("should return false when there is 2 players with the same role but max in game is 1.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: ROLE_NAMES.WITCH },
        { role: ROLE_NAMES.WITCH },
        { role: ROLE_NAMES.WEREWOLF },
        { role: ROLE_NAMES.VILLAGER },
      ]);
      expect(areCompositionRolesMaxInGameRespected(players)).toBe(false);
    });

    it("should return true when players are empty.", () => {
      expect(areCompositionRolesMaxInGameRespected([])).toBe(true);
    });

    it("should return true when the limit for each role is respected.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(8, [
        { role: ROLE_NAMES.WITCH },
        { role: ROLE_NAMES.SEER },
        { role: ROLE_NAMES.WEREWOLF },
        { role: ROLE_NAMES.WEREWOLF },
        { role: ROLE_NAMES.VILLAGER },
        { role: ROLE_NAMES.VILLAGER },
        { role: ROLE_NAMES.VILLAGER },
        { role: ROLE_NAMES.VILLAGER },
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