import { doesCompositionHaveAtLeastOneVillager, getCompositionHasVillagerDefaultMessage } from "@/modules/game/dto/base/decorators/composition/composition-has-villager.decorator";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Has Villager Decorator", () => {
  describe("doesCompositionHaveAtLeastOneVillager", () => {
    it("should return false when players are undefined.", () => {
      expect(doesCompositionHaveAtLeastOneVillager(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(doesCompositionHaveAtLeastOneVillager(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(doesCompositionHaveAtLeastOneVillager([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players doesn't have the good structure.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
      ];

      expect(doesCompositionHaveAtLeastOneVillager([...players, { name: "bad", role: { titi: "toto" } }])).toBe(false);
    });

    it("should return false when composition is full of werewolves.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "accursed-wolf-father" } }),
        createFakeCreateGamePlayerDto({ role: { name: "white-werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "accursed-wolf-father" } }),
      ];

      expect(doesCompositionHaveAtLeastOneVillager(players)).toBe(false);
    });

    it("should return false when players are empty.", () => {
      expect(doesCompositionHaveAtLeastOneVillager([])).toBe(false);
    });

    it("should return true when there is at least one villager in composition.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
      ];

      expect(doesCompositionHaveAtLeastOneVillager(players)).toBe(true);
    });
  });

  describe("playersRoleLimitDefaultMessage", () => {
    it("should return default message when called.", () => {
      expect(getCompositionHasVillagerDefaultMessage()).toBe("one of the players.role must have at least one role from `villagers` side");
    });
  });
});