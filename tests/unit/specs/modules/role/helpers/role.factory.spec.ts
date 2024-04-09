import { createRole } from "@/modules/role/helpers/role.factory";
import type { Role } from "@/modules/role/types/role.class";

import { createFakeRole } from "@tests/factories/role/types/role.type.factory";

describe("Role Factory", () => {
  describe("createRole", () => {
    it("should create a role when called.", () => {
      const role: Role = {
        name: "elder",
        type: "ambiguous",
        side: "villagers",
        origin: "characters",
        maxInGame: 1,
        minInGame: 1,
      };

      expect(createRole(role)).toStrictEqual<Role>(createFakeRole(role));
    });
  });
});