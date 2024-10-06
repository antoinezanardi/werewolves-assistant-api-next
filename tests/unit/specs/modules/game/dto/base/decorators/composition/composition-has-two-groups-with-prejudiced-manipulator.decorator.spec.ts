import { doesCompositionHasTwoGroupsWithPrejudicedManipulator, getCompositionHasTwoGroupsWithPrejudicedManipulatorDefaultMessage } from "@/modules/game/dto/base/decorators/composition/composition-has-two-groups-with-prejudiced-manipulator.decorator";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Composition Has Two Groups With Prejudiced Manipulator Decorator", () => {
  describe("doesCompositionHasTwoGroupsWithPrejudicedManipulator", () => {
    it("should return false when players are undefined.", () => {
      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = [
        { role: { name: "FOX" } },
        { role: { name: "VILLAGER" } },
        { role: { name: "WEREWOLF" } },
        { role: { name: "PREJUDICED_MANIPULATOR" } },
      ];

      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players has no role.", () => {
      const players = [
        { role: { name: "FOX" } },
        { role: { name: "VILLAGER" } },
        { role: { name: "WEREWOLF" } },
        { role: { name: "PREJUDICED_MANIPULATOR" } },
      ];

      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator([...players, { role: { toto: "WITCH" } }])).toBe(false);
    });

    it("should return true when nobody is the prejudiced manipulator.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
      ];

      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator(players)).toBe(true);
    });

    it("should return false when one player is the prejudiced manipulator and there is only one group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "toto" }),
      ];

      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator(players)).toBe(false);
    });

    it("should return false when one player is the prejudiced manipulator and there is more than two groups.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" }, group: "titi" }),
        createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "tata" }),
      ];

      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator(players)).toBe(false);
    });

    it("should return true when one player is the prejudiced manipulator and there are two groups.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" }, group: "tata" }),
        createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "tata" }),
      ];

      expect(doesCompositionHasTwoGroupsWithPrejudicedManipulator(players)).toBe(true);
    });
  });

  describe("getCompositionHasTwoGroupsWithPrejudicedManipulatorDefaultMessage", () => {
    it("should return the default message when called.", () => {
      const expectedMessage = "there must be exactly two groups among players when `prejudiced-manipulator` in the game";

      expect(getCompositionHasTwoGroupsWithPrejudicedManipulatorDefaultMessage()).toBe(expectedMessage);
    });
  });
});