import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { HealthCheckResult } from "@nestjs/terminus";
import { initNestApp } from "../../../../helpers/nest-app.helper";

describe("Health Controller", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const { app: server } = await initNestApp();
    app = server;
  });

  afterAll(async() => {
    await app.close();
  });

  describe("GET /health", () => {
    it("should return app health when route is called.", async() => {
      const response = await app.inject({ method: "GET", url: "/health" });
      const expectedHealthCheckResult: HealthCheckResult = {
        status: "ok",
        details: { mongoose: { status: "up" } },
        error: {},
        info: { mongoose: { status: "up" } },
      };

      expect(response.statusCode).toBe(200);
      expect(response.json<HealthCheckResult>()).toStrictEqual(expectedHealthCheckResult);
    });
  });
});