import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { initNestApp } from "../helpers/nest-app.helper";

describe("App Controller", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await initNestApp(app);
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