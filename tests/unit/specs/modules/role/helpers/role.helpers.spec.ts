import { getRolesWithSide, getRoleWithName } from "@/modules/role/helpers/role.helpers";
import type { Role } from "@/modules/role/types/role.class";
import type { RoleName } from "@/modules/role/types/role.types";

import { createFakeRole } from "@tests/factories/role/types/role.type.factory";

describe("Role Helper", () => {
  describe("getRolesWithSide", () => {
    const roles = [
      createFakeRole({
        name: "werewolf",
        side: "werewolves",
        type: "werewolf",
        origin: "classic",
        maxInGame: 1,
      }),
      createFakeRole({
        name: "villager",
        side: "villagers",
        type: "villager",
        origin: "classic",
        maxInGame: 1,
      }),
      createFakeRole({
        name: "pied-piper",
        side: "villagers",
        type: "ambiguous",
        origin: "classic",
        maxInGame: 1,
      }),
      createFakeRole({
        name: "white-werewolf",
        side: "werewolves",
        type: "werewolf",
        origin: "classic",
        maxInGame: 1,
      }),
    ];

    it("should get all werewolf roles when werewolf side is provided.", () => {
      const expectedRoles = [
        createFakeRole({
          name: "werewolf",
          side: "werewolves",
          type: "werewolf",
          origin: "classic",
          maxInGame: 1,
        }),
        createFakeRole({
          name: "white-werewolf",
          side: "werewolves",
          type: "werewolf",
          origin: "classic",
          maxInGame: 1,
        }),
      ];

      expect(getRolesWithSide(roles, "werewolves")).toStrictEqual<Role[]>(expectedRoles);
    });

    it("should get all villagers roles when villager side is provided.", () => {
      const expectedRoles = [
        createFakeRole({
          name: "villager",
          side: "villagers",
          type: "villager",
          origin: "classic",
          maxInGame: 1,
        }),
        createFakeRole({
          name: "pied-piper",
          side: "villagers",
          type: "ambiguous",
          origin: "classic",
          maxInGame: 1,
        }),
      ];

      expect(getRolesWithSide(roles, "villagers")).toStrictEqual<Role[]>(expectedRoles);
    });
  });

  describe("getRoleWithName", () => {
    const roles = [
      createFakeRole({
        name: "werewolf",
        side: "werewolves",
        type: "werewolf",
        origin: "classic",
        maxInGame: 1,
      }),
      createFakeRole({
        name: "villager",
        side: "villagers",
        type: "villager",
        origin: "classic",
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