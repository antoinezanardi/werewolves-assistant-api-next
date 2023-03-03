import type { INestApplication } from "@nestjs/common";
import type { HealthCheckResult } from "@nestjs/terminus";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { HealthModule } from "../../../src/health/health.module";
import { E2eTestModule } from "../../../src/test/e2e-test.module";

describe("Health Module", () => {
  let app: INestApplication;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, HealthModule] }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async() => {
    await app.close();
  });

  it("should return app health when route is called.", async() => request(app.getHttpServer())
    .get("/health")
    .expect(200)
    .expect(res => {
      const bodyResponse = res.body as HealthCheckResult;
      const expectedHealthCheckResult: HealthCheckResult = {
        status: "ok",
        details: { mongoose: { status: "up" } },
        error: {},
        info: { mongoose: { status: "up" } },
      };
      expect(bodyResponse).toStrictEqual(expectedHealthCheckResult);
    }));
});