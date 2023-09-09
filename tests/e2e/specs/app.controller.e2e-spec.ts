import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import { initNestApp } from "@tests/e2e/helpers/nest-app.helper";

describe("App Controller", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const { app: server } = await initNestApp();
    app = server;
  });

  afterAll(async() => {
    await app.close();
  });

  describe("GET /", () => {
    it("should return status code 204 when route is called.", async() => {
      const response = await app.inject({ method: "GET", url: "/" });

      expect(response.statusCode).toBe(204);
    });
  });
});