import { RoleNames, RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { createRole } from "@/modules/role/helpers/role.factory";
import type { Role } from "@/modules/role/types/role.types";

import { createFakeRole } from "@tests/factories/role/types/role.type.factory";

describe("Role Factory", () => {
  describe("createRole", () => {
    it("should create a role when called.", () => {
      const role: Role = {
        name: RoleNames.ELDER,
        type: RoleTypes.AMBIGUOUS,
        side: RoleSides.VILLAGERS,
        origin: RoleOrigins.CHARACTERS,
        maxInGame: 1,
        minInGame: 1,
      };

      expect(createRole(role)).toStrictEqual<Role>(createFakeRole(role));
    });
  });
});