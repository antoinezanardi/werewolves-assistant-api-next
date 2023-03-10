import {
  getCompositionRolesMinInGameDefaultMessage,
  areCompositionRolesMinInGameRespected,
} from "../../../../../../../src/game/dto/create-game/decorators/composition-roles-min-in-game.decorator";
import { ROLE_NAMES } from "../../../../../../../src/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Roles Min In Game Decorator", () => {
  describe("areCompositionRolesMinInGameRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(areCompositionRolesMinInGameRespected(undefined)).toBe(false);
    });

    it("should return false when there is only 1 player with a role which min in game is 2.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: ROLE_NAMES.TWO_SISTERS },
        { role: ROLE_NAMES.WITCH },
        { role: ROLE_NAMES.WEREWOLF },
        { role: ROLE_NAMES.VILLAGER },
      ]);
      expect(areCompositionRolesMinInGameRespected(players)).toBe(false);
    });

    it("should return true when players are empty.", () => {
      expect(areCompositionRolesMinInGameRespected([])).toBe(true);
    });

    it("should return true when the limit for each role is respected.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(9, [
        { role: ROLE_NAMES.WITCH },
        { role: ROLE_NAMES.SEER },
        { role: ROLE_NAMES.WEREWOLF },
        { role: ROLE_NAMES.WEREWOLF },
        { role: ROLE_NAMES.THREE_BROTHERS },
        { role: ROLE_NAMES.THREE_BROTHERS },
        { role: ROLE_NAMES.THREE_BROTHERS },
        { role: ROLE_NAMES.TWO_SISTERS },
        { role: ROLE_NAMES.TWO_SISTERS },
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