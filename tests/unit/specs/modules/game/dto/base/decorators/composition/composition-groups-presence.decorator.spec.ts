import type { ValidationArguments } from "class-validator";

import { getCompositionGroupsPresenceDefaultMessage, isCompositionGroupsExistenceRespected } from "@/modules/game/dto/base/decorators/composition/composition-groups-presence.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

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
        { role: { name: RoleNames.FOX } },
        { role: { name: RoleNames.VILLAGER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
      ];

      expect(isCompositionGroupsExistenceRespected([...players, "toto"])).toBe(false);
    });

    it("should return false when one of the players has no role.", () => {
      const players = [
        { role: { name: RoleNames.FOX } },
        { role: { name: RoleNames.VILLAGER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.PREJUDICED_MANIPULATOR } },
      ];

      expect(isCompositionGroupsExistenceRespected([...players, { role: { toto: RoleNames.WITCH } }])).toBe(false);
    });

    it("should return false when one of the players is prejudiced manipulator but one doesn't have a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.PREJUDICED_MANIPULATOR }, group: "tata" }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(false);
    });

    it("should return true when one of the players is prejudiced manipulator and all have a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF }, group: "toto" }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.PREJUDICED_MANIPULATOR }, group: "tata" }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(true);
    });

    it("should return false when there is no player with role prejudiced manipulator and one has a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER }, group: "tata" }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(false);
    });

    it("should return true when there is no player with role prejudiced manipulator and no one has a group.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
      ];

      expect(isCompositionGroupsExistenceRespected(players)).toBe(true);
    });

    describe("getCompositionGroupsPresenceDefaultMessage", () => {
      it("should return required players group when there is a player with role prejudiced manipulator.", () => {
        const players = [
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH }, group: "toto" }),
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER }, group: "toto" }),
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF }, group: "toto" }),
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.PREJUDICED_MANIPULATOR } }),
        ];
        const createGameDto = createFakeCreateGameDto({ players });
        const validationArguments: ValidationArguments = {
          value: players,
          object: createGameDto,
          constraints: [],
          targetName: "",
          property: "players",
        };

        expect(getCompositionGroupsPresenceDefaultMessage(validationArguments)).toBe(`each player must have a group if there is a player with role \`${RoleNames.PREJUDICED_MANIPULATOR}\``);
      });

      it("should return not expected players group when there is no player with role prejudiced manipulator.", () => {
        const players = [
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        ];
        const createGameDto = createFakeCreateGameDto({ players });
        const validationArguments: ValidationArguments = {
          value: players,
          object: createGameDto,
          constraints: [],
          targetName: "",
          property: "players",
        };

        expect(getCompositionGroupsPresenceDefaultMessage(validationArguments)).toBe(`any player can't have a group if there is no player with role \`${RoleNames.PREJUDICED_MANIPULATOR}\``);
      });
    });
  });
});