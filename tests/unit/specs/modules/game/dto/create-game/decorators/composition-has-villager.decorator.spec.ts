import {
  doesCompositionHaveAtLeastOneVillager,
  getCompositionHasVillagerDefaultMessage,
} from "../../../../../../../../src/modules/game/dto/create-game/decorators/composition-has-villager.decorator";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Has Villager Decorator", () => {
  describe("doesCompositionHaveAtLeastOneVillager", () => {
    it("should return false when players are undefined.", () => {
      expect(doesCompositionHaveAtLeastOneVillager(undefined)).toBe(false);
    });

    it("should return false when composition is full of werewolves.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.VILE_FATHER_OF_WOLVES } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
        { role: { name: ROLE_NAMES.VILE_FATHER_OF_WOLVES } },
      ]);
      expect(doesCompositionHaveAtLeastOneVillager(players)).toBe(false);
    });

    it("should return false when players are empty.", () => {
      expect(doesCompositionHaveAtLeastOneVillager([])).toBe(false);
    });

    it("should return true when there is at least one villager in composition.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      expect(doesCompositionHaveAtLeastOneVillager(players)).toBe(true);
    });
  });

  describe("playersRoleLimitDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionHasVillagerDefaultMessage()).toBe("one of the players.role must have at least one role from `villagers` side");
    });
  });
});