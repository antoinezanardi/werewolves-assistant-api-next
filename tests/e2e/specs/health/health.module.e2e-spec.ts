import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { HealthCheckResult } from "@nestjs/terminus";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { HealthModule } from "../../../../src/health/health.module";
import { E2eTestModule } from "../../../../src/test/e2e-test.module";
import { initNestApp } from "../../helpers/nest-app.helper";

describe("Health Module", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, HealthModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await initNestApp(app);
  });

  afterAll(async() => {
    await app.close();
  });

  describe("GET /health", () => {
    it("should return app health when route is called.", async() => {
      const response = await app.inject({ method: "GET", url: "/health" });
      expect(response.statusCode).toBe(200);
      const expectedHealthCheckResult: HealthCheckResult = {
        status: "ok",
        details: { mongoose: { status: "up" } },
        error: {},
        info: { mongoose: { status: "up" } },
      };
      expect(response.json<HealthCheckResult>()).toStrictEqual(expectedHealthCheckResult);
    });
  });
});