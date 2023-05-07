import { roles, villagerRoles, werewolvesRoles } from "../../../../../../src/modules/role/constants/role.constant";
import { ROLE_SIDES } from "../../../../../../src/modules/role/enums/role.enum";
import { bulkCreateFakeRoles } from "../../../../../factories/role/types/role.type.factory";

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
      expect(roles).toStrictEqual(bulkCreateFakeRoles([...werewolvesRoles, ...villagerRoles].length, [...werewolvesRoles, ...villagerRoles]));
    });
  });
});