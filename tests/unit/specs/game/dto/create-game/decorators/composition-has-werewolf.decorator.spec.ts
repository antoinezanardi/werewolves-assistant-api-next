import {
  doesCompositionHaveAtLeastOneWerewolf,
  getCompositionHasWerewolfDefaultMessage,
} from "../../../../../../../src/game/dto/create-game/decorators/composition-has-werewolf.decorator";
import { ROLE_NAMES } from "../../../../../../../src/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Has Werewolf Decorator", () => {
  describe("doesCompositionHaveAtLeastOneWerewolf", () => {
    it("should return false when players are undefined.", () => {
      expect(doesCompositionHaveAtLeastOneWerewolf(undefined)).toBe(false);
    });

    it("should return false when composition is full of villagers.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: ROLE_NAMES.VILLAGER },
        { role: ROLE_NAMES.WITCH },
        { role: ROLE_NAMES.SEER },
        { role: ROLE_NAMES.HUNTER },
      ]);
      expect(doesCompositionHaveAtLeastOneWerewolf(players)).toBe(false);
    });

    it("should return false when players are empty.", () => {
      expect(doesCompositionHaveAtLeastOneWerewolf([])).toBe(false);
    });

    it("should return true when there is at least one werewolf in composition.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: ROLE_NAMES.WITCH },
        { role: ROLE_NAMES.SEER },
        { role: ROLE_NAMES.HUNTER },
        { role: ROLE_NAMES.WEREWOLF },
      ]);
      expect(doesCompositionHaveAtLeastOneWerewolf(players)).toBe(true);
    });
  });

  describe("playersRoleLimitDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionHasWerewolfDefaultMessage()).toBe("one of the players.role must have at least one role from `werewolves` side");
    });
  });
});