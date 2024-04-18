import { ROLES, VILLAGER_ROLES, WEREWOLF_ROLES } from "@/modules/role/constants/role-set.constants";
import type { Role } from "@/modules/role/types/role.class";

describe("Role Constant", () => {
  describe("werewolvesRoles", () => {
    it("should contain only roles with side 'werewolves' when called.", () => {
      expect(WEREWOLF_ROLES.length).toBeGreaterThan(0);
      expect(WEREWOLF_ROLES.every(role => role.side === "werewolves")).toBe(true);
    });
  });

  describe("villagerRoles", () => {
    it("should contain only roles with side 'villagers' when called.", () => {
      expect(VILLAGER_ROLES.length).toBeGreaterThan(0);
      expect(VILLAGER_ROLES.every(role => role.side === "villagers")).toBe(true);
    });
  });

  describe("roles", () => {
    it("should contain all roles when called.", () => {
      expect(ROLES).toStrictEqual<Role[]>([...WEREWOLF_ROLES, ...VILLAGER_ROLES] as Role[]);
    });
  });
});