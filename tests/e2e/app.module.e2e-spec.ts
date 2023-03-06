import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";

describe("App Module", () => {
  let app: NestFastifyApplication;

  beforeAll(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
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