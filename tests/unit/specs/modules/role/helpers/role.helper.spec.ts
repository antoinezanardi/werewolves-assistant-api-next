import { RoleNames, RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { getRolesWithSide } from "@/modules/role/helpers/role.helper";
import type { Role } from "@/modules/role/types/role.type";

import { createFakeRole } from "@tests/factories/role/types/role.type.factory";

describe("Role Helper", () => {
  describe("getRolesWithSide", () => {
    const roles = [
      createFakeRole({
        name: RoleNames.WEREWOLF,
        side: RoleSides.WEREWOLVES,
        type: RoleTypes.WEREWOLF,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
      createFakeRole({
        name: RoleNames.VILLAGER,
        side: RoleSides.VILLAGERS,
        type: RoleTypes.VILLAGER,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
      createFakeRole({
        name: RoleNames.PIED_PIPER,
        side: RoleSides.VILLAGERS,
        type: RoleTypes.AMBIGUOUS,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
      createFakeRole({
        name: RoleNames.WHITE_WEREWOLF,
        side: RoleSides.WEREWOLVES,
        type: RoleTypes.WEREWOLF,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
    ];

    it("should get all werewolf roles when werewolf side is provided.", () => {
      const expectedRoles = [
        createFakeRole({
          name: RoleNames.WEREWOLF,
          side: RoleSides.WEREWOLVES,
          type: RoleTypes.WEREWOLF,
          origin: RoleOrigins.CLASSIC,
          maxInGame: 1,
        }),
        createFakeRole({
          name: RoleNames.WHITE_WEREWOLF,
          side: RoleSides.WEREWOLVES,
          type: RoleTypes.WEREWOLF,
          origin: RoleOrigins.CLASSIC,
          maxInGame: 1,
        }),
      ];

      expect(getRolesWithSide(roles, RoleSides.WEREWOLVES)).toStrictEqual<Role[]>(expectedRoles);
    });

    it("should get all villagers roles when villager side is provided.", () => {
      const expectedRoles = [
        createFakeRole({
          name: RoleNames.VILLAGER,
          side: RoleSides.VILLAGERS,
          type: RoleTypes.VILLAGER,
          origin: RoleOrigins.CLASSIC,
          maxInGame: 1,
        }),
        createFakeRole({
          name: RoleNames.PIED_PIPER,
          side: RoleSides.VILLAGERS,
          type: RoleTypes.AMBIGUOUS,
          origin: RoleOrigins.CLASSIC,
          maxInGame: 1,
        }),
      ];

      expect(getRolesWithSide(roles, RoleSides.VILLAGERS)).toStrictEqual<Role[]>(expectedRoles);
    });
  });
});