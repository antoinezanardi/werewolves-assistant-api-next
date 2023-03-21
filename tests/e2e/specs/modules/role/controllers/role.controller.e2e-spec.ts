import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { roles } from "../../../../../../src/modules/role/constants/role.constant";
import { RoleModule } from "../../../../../../src/modules/role/role.module";
import { Role } from "../../../../../../src/modules/role/types/role.type";
import { E2eTestModule } from "../../../../../../src/modules/test/e2e-test.module";
import { fastifyServerDefaultOptions } from "../../../../../../src/server/constants/server.constant";

describe("Role Controller", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, RoleModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter(fastifyServerDefaultOptions));

    await app.init();
  });

  afterAll(async() => {
    await app.close();
  });

  describe("GET /roles", () => {
    it("should return roles when route is called.", async() => {
      const response = await app.inject({ method: "GET", url: "/roles" });
      expect(response.statusCode).toBe(200);
      expect(plainToInstance(Role, response.json<Role[]>())).toStrictEqual(roles);
    });
  });
});