import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { roles } from "../../../../src/role/constants/role.constant";
import { Role } from "../../../../src/role/role.entity";
import { RoleModule } from "../../../../src/role/role.module";
import { E2eTestModule } from "../../../../src/test/e2e-test.module";

describe("Role Module", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, RoleModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

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