import { RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { getRolesWithSide, getRoleWithName } from "@/modules/role/helpers/role.helpers";
import type { Role } from "@/modules/role/types/role.class";
import type { RoleName } from "@/modules/role/types/role.types";

import { createFakeRole } from "@tests/factories/role/types/role.type.factory";

describe("Role Helper", () => {
  describe("getRolesWithSide", () => {
    const roles = [
      createFakeRole({
        name: "werewolf",
        side: RoleSides.WEREWOLVES,
        type: RoleTypes.WEREWOLF,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
      createFakeRole({
        name: "villager",
        side: RoleSides.VILLAGERS,
        type: RoleTypes.VILLAGER,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
      createFakeRole({
        name: "pied-piper",
        side: RoleSides.VILLAGERS,
        type: RoleTypes.AMBIGUOUS,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
      createFakeRole({
        name: "white-werewolf",
        side: RoleSides.WEREWOLVES,
        type: RoleTypes.WEREWOLF,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
    ];

    it("should get all werewolf roles when werewolf side is provided.", () => {
      const expectedRoles = [
        createFakeRole({
          name: "werewolf",
          side: RoleSides.WEREWOLVES,
          type: RoleTypes.WEREWOLF,
          origin: RoleOrigins.CLASSIC,
          maxInGame: 1,
        }),
        createFakeRole({
          name: "white-werewolf",
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
          name: "villager",
          side: RoleSides.VILLAGERS,
          type: RoleTypes.VILLAGER,
          origin: RoleOrigins.CLASSIC,
          maxInGame: 1,
        }),
        createFakeRole({
          name: "pied-piper",
          side: RoleSides.VILLAGERS,
          type: RoleTypes.AMBIGUOUS,
          origin: RoleOrigins.CLASSIC,
          maxInGame: 1,
        }),
      ];

      expect(getRolesWithSide(roles, RoleSides.VILLAGERS)).toStrictEqual<Role[]>(expectedRoles);
    });
  });

  describe("getRoleWithName", () => {
    const roles = [
      createFakeRole({
        name: "werewolf",
        side: RoleSides.WEREWOLVES,
        type: RoleTypes.WEREWOLF,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
      createFakeRole({
        name: "villager",
        side: RoleSides.VILLAGERS,
        type: RoleTypes.VILLAGER,
        origin: RoleOrigins.CLASSIC,
        maxInGame: 1,
      }),
    ];

    it.each<{
      test: string;
      name: RoleName;
      expectedRole: Role | undefined;
    }>([
      {
        test: "should get the werewolf role when werewolf name is provided.",
        name: "werewolf",
        expectedRole: roles[0],
      },
      {
        test: "should get the villager role when villager name is provided.",
        name: "villager",
        expectedRole: roles[1],
      },
      {
        test: "should return undefined when no role name is provided.",
        name: "witch",
        expectedRole: undefined,
      },
    ])("$test", ({ name, expectedRole }) => {
      expect(getRoleWithName(roles, name)).toStrictEqual<Role | undefined>(expectedRole);
    });
  });
});