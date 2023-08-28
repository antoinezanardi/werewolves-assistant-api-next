import { RoleNames, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { getRolesWithSide } from "@/modules/role/helpers/role.helper";
import type { Role } from "@/modules/role/types/role.type";

describe("Role Helper", () => {
  describe("getRolesWithSide", () => {
    const roles: Role[] = [
      { name: RoleNames.WEREWOLF, side: RoleSides.WEREWOLVES, type: RoleTypes.WEREWOLF, maxInGame: 1 },
      { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, type: RoleTypes.VILLAGER, maxInGame: 1 },
      { name: RoleNames.PIED_PIPER, side: RoleSides.VILLAGERS, type: RoleTypes.AMBIGUOUS, maxInGame: 1 },
      { name: RoleNames.WHITE_WEREWOLF, side: RoleSides.WEREWOLVES, type: RoleTypes.WEREWOLF, maxInGame: 1 },
    ];

    it("should get all werewolf roles when werewolf side is provided.", () => {
      expect(getRolesWithSide(roles, RoleSides.WEREWOLVES)).toStrictEqual<Role[]>([
        { name: RoleNames.WEREWOLF, side: RoleSides.WEREWOLVES, type: RoleTypes.WEREWOLF, maxInGame: 1 },
        { name: RoleNames.WHITE_WEREWOLF, side: RoleSides.WEREWOLVES, type: RoleTypes.WEREWOLF, maxInGame: 1 },
      ]);
    });

    it("should get all villagers roles when villager side is provided.", () => {
      expect(getRolesWithSide(roles, RoleSides.VILLAGERS)).toStrictEqual<Role[]>([
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, type: RoleTypes.VILLAGER, maxInGame: 1 },
        { name: RoleNames.PIED_PIPER, side: RoleSides.VILLAGERS, type: RoleTypes.AMBIGUOUS, maxInGame: 1 },
      ]);
    });
  });
});