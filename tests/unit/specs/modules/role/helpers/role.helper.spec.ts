import { ROLE_NAMES, ROLE_SIDES, ROLE_TYPES } from "@/modules/role/enums/role.enum";
import { getRolesWithSide } from "@/modules/role/helpers/role.helper";
import type { Role } from "@/modules/role/types/role.type";

describe("Role Helper", () => {
  describe("getRolesWithSide", () => {
    const roles: Role[] = [
      { name: ROLE_NAMES.WEREWOLF, side: ROLE_SIDES.WEREWOLVES, type: ROLE_TYPES.WEREWOLF, maxInGame: 1 },
      { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, type: ROLE_TYPES.VILLAGER, maxInGame: 1 },
      { name: ROLE_NAMES.PIED_PIPER, side: ROLE_SIDES.VILLAGERS, type: ROLE_TYPES.AMBIGUOUS, maxInGame: 1 },
      { name: ROLE_NAMES.WHITE_WEREWOLF, side: ROLE_SIDES.WEREWOLVES, type: ROLE_TYPES.WEREWOLF, maxInGame: 1 },
    ];

    it("should get all werewolf roles when werewolf side is provided.", () => {
      expect(getRolesWithSide(roles, ROLE_SIDES.WEREWOLVES)).toStrictEqual<Role[]>([
        { name: ROLE_NAMES.WEREWOLF, side: ROLE_SIDES.WEREWOLVES, type: ROLE_TYPES.WEREWOLF, maxInGame: 1 },
        { name: ROLE_NAMES.WHITE_WEREWOLF, side: ROLE_SIDES.WEREWOLVES, type: ROLE_TYPES.WEREWOLF, maxInGame: 1 },
      ]);
    });

    it("should get all villagers roles when villager side is provided.", () => {
      expect(getRolesWithSide(roles, ROLE_SIDES.VILLAGERS)).toStrictEqual<Role[]>([
        { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, type: ROLE_TYPES.VILLAGER, maxInGame: 1 },
        { name: ROLE_NAMES.PIED_PIPER, side: ROLE_SIDES.VILLAGERS, type: ROLE_TYPES.AMBIGUOUS, maxInGame: 1 },
      ]);
    });
  });
});