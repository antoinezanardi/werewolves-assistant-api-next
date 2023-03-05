import type { INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import * as request from "supertest";
import { roles } from "../../../src/role/role.constant";
import { Role } from "../../../src/role/role.entity";
import { RoleModule } from "../../../src/role/role.module";
import { E2eTestModule } from "../../../src/test/e2e-test.module";

describe("Role Module", () => {
  let app: INestApplication;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, RoleModule] }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async() => {
    await app.close();
  });

  it("should return roles when route is called.", async() => request(app.getHttpServer())
    .get("/roles")
    .expect(200)
    .expect(res => {
      expect(plainToInstance(Role, res.body)).toStrictEqual(roles);
    }));
});