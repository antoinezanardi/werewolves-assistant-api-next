import { ROLES, VILLAGER_ROLES, WEREWOLF_ROLES } from "@/modules/role/constants/role.constant";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { bulkCreateFakeRoles } from "@tests/factories/role/types/role.type.factory";

describe("Role Constant", () => {
  describe("werewolvesRoles", () => {
    it("should contain only roles with side 'werewolves' when called.", () => {
      expect(WEREWOLF_ROLES.length).toBeGreaterThan(0);
      expect(WEREWOLF_ROLES.every(role => role.side === RoleSides.WEREWOLVES)).toBe(true);
    });
  });

  describe("villagerRoles", () => {
    it("should contain only roles with side 'villagers' when called.", () => {
      expect(VILLAGER_ROLES.length).toBeGreaterThan(0);
      expect(VILLAGER_ROLES.every(role => role.side === RoleSides.VILLAGERS)).toBe(true);
    });
  });

  describe("roles", () => {
    it("should contain all roles when called.", () => {
      expect(ROLES).toStrictEqual(bulkCreateFakeRoles([...WEREWOLF_ROLES, ...VILLAGER_ROLES].length, [...WEREWOLF_ROLES, ...VILLAGER_ROLES]));
    });
  });
});