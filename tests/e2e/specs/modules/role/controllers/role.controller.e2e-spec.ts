import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import { ROLES } from "@/modules/role/constants/role.constant";
import type { Role } from "@/modules/role/types/role.type";

import { toJSON } from "@/shared/misc/helpers/object.helper";

import { initNestApp } from "@tests/e2e/helpers/nest-app.helper";

describe("Role Controller", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const { app: server } = await initNestApp();
    app = server;
  });

  afterAll(async() => {
    await app.close();
  });

  describe("GET /roles", () => {
    it("should return roles when route is called.", async() => {
      const response = await app.inject({ method: "GET", url: "/roles" });
      const respondedRoles = response.json<Role[]>();

      expect(response.statusCode).toBe(200);
      expect(respondedRoles).toStrictEqual(toJSON(ROLES));
    });
  });
});