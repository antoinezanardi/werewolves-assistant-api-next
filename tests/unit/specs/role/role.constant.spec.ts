import { plainToInstance } from "class-transformer";
import { roles, villagerRoles, werewolvesRoles } from "../../../../src/role/constants/role.constant";
import { ROLE_SIDES } from "../../../../src/role/enums/role.enum";
import { Role } from "../../../../src/role/role.entity";

describe("Role Constant", () => {
  describe("werewolvesRoles", () => {
    it("should contain only roles with side 'werewolves' when called.", () => {
      expect(werewolvesRoles.length).toBeGreaterThan(0);
      expect(werewolvesRoles.every(role => role.side === ROLE_SIDES.WEREWOLVES)).toBe(true);
    });
  });

  describe("villagerRoles", () => {
    it("should contain only roles with side 'villagers' when called.", () => {
      expect(villagerRoles.length).toBeGreaterThan(0);
      expect(villagerRoles.every(role => role.side === ROLE_SIDES.VILLAGERS)).toBe(true);
    });
  });

  describe("roles", () => {
    it("should contain all roles when called.", () => {
      expect(roles).toStrictEqual(plainToInstance(Role, [...werewolvesRoles, ...villagerRoles]));
    });
  });
});