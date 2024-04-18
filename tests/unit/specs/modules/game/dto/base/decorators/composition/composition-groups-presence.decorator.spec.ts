import type { ValidationArguments } from "class-validator";

import { getCompositionGroupsPresenceDefaultMessage, isCompositionGroupsExistenceRespected } from "@/modules/game/dto/base/decorators/composition/composition-groups-presence.decorator";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";

describe("Composition Groups Presence Decorator", () => {
  describe("isCompositionGroupsExistenceRespected", () => {
    it("should return false when players are undefined.", () => {
      expect(isCompositionGroupsExistenceRespected(undefined)).toBe(false);
    });

    it("should return false when players are not an array.", () => {
      expect(isCompositionGroupsExistenceRespected(null)).toBe(false);
    });

    it("should return false when one of the players is not an object.", () => {
      const players = [
        { role: { name: "fox" } },
        { role: { name: "villager" } },
        { role: { name: "werewolf" } },
        { role: { name: "witch" } },
      ];

      expect(isCompositionGroupsExistenceRespected([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players has no role.", () => {
      const players = [
        { role: { name: "fox" } },
        { role: { name: "villager" } },
        { role: { name: "werewolf" } },
        { role: { name: "prejudiced-manipulator" } },
      ];

      expect(isCompositionGroupsExistenceRespected([...players, { role: { toto: "witch" } }])).toBe(false);
    });

    it("should return false when one of the players is prejudiced manipulator but one doesn't have a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "tata" }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(false);
    });

    it("should return true when one of the players is prejudiced manipulator and all have a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "tata" }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(true);
    });

    it("should return false when there is no player with role prejudiced manipulator and one has a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" }, group: "tata" }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(false);
    });

    it("should return true when there is no player with role prejudiced manipulator and no one has a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
        createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
        createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(true);
    });

    describe("getCompositionGroupsPresenceDefaultMessage", () => {
      it("should return required players group when there is a player with role prejudiced manipulator.", () => {
        const players = [
          createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "toto" }),
          createFakeCreateGamePlayerDto({ role: { name: "villager" }, group: "toto" }),
          createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
          createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" } }),
        ];
        const createGameDto = createFakeCreateGameDto({ players });
        const validationArguments: ValidationArguments = {
          value: players,
          object: createGameDto,
          constraints: [],
          targetName: "",
          property: "players",
        };

        expect(getCompositionGroupsPresenceDefaultMessage(validationArguments)).toBe(`each player must have a group if there is a player with role \`${"prejudiced-manipulator"}\``);
      });

      it("should return not expected players group when there is no player with role prejudiced manipulator.", () => {
        const players = [
          createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
          createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
          createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
          createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
        ];
        const createGameDto = createFakeCreateGameDto({ players });
        const validationArguments: ValidationArguments = {
          value: players,
          object: createGameDto,
          constraints: [],
          targetName: "",
          property: "players",
        };

        expect(getCompositionGroupsPresenceDefaultMessage(validationArguments)).toBe(`any player can't have a group if there is no player with role \`${"prejudiced-manipulator"}\``);
      });
    });
  });
});