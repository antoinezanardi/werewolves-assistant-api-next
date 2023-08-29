import {
  doesCompositionHaveAtLeastOneWerewolf,
  getCompositionHasWerewolfDefaultMessage,
} from "@/modules/game/dto/base/decorators/composition/composition-has-werewolf.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { bulkCreateFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Has Werewolf Decorator", () => {
  describe("doesCompositionHaveAtLeastOneWerewolf", () => {
    it("should return false when players are undefined.", () => {
      expect(doesCompositionHaveAtLeastOneWerewolf(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(doesCompositionHaveAtLeastOneWerewolf(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(doesCompositionHaveAtLeastOneWerewolf([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players doesn't have the good structure.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.VILLAGER } },
      ]);

      expect(doesCompositionHaveAtLeastOneWerewolf([...players, { name: "bad", role: { titi: "toto" } }])).toBe(false);
    });

    it("should return false when composition is full of villagers.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.VILLAGER } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.HUNTER } },
      ]);

      expect(doesCompositionHaveAtLeastOneWerewolf(players)).toBe(false);
    });

    it("should return false when players are empty.", () => {
      expect(doesCompositionHaveAtLeastOneWerewolf([])).toBe(false);
    });

    it("should return true when there is at least one werewolf in composition.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.HUNTER } },
        { role: { name: RoleNames.WEREWOLF } },
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