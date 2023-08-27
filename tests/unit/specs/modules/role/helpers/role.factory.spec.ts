
import { ROLE_NAMES, ROLE_SIDES, ROLE_TYPES } from "@/modules/role/enums/role.enum";
import { createRole } from "@/modules/role/helpers/role.factory";
import type { Role } from "@/modules/role/types/role.type";

import { createFakeRole } from "@tests/factories/role/types/role.type.factory";

describe("Role Factory", () => {
  describe("createRole", () => {
    it("should create a role when called.", () => {
      const role: Role = {
        name: ROLE_NAMES.ANCIENT,
        type: ROLE_TYPES.AMBIGUOUS,
        side: ROLE_SIDES.VILLAGERS,
        maxInGame: 1,
        minInGame: 1,
      };
      
      expect(createRole(role)).toStrictEqual<Role>(createFakeRole(role));
    });
  });
});