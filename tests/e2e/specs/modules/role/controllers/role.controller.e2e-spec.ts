import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { roles } from "../../../../../../src/modules/role/constants/role.constant";
import type { Role } from "../../../../../../src/modules/role/types/role.type";
import { bulkCreateFakeRoles } from "../../../../../factories/role/types/role.type.factory";
import { initNestApp } from "../../../../helpers/nest-app.helper";

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
      expect(bulkCreateFakeRoles(respondedRoles.length, respondedRoles)).toStrictEqual(roles);
    });
  });
});