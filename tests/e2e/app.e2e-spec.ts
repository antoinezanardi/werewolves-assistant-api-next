import type { INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should return Hello World when route is called.", async() => request(app.getHttpServer())
    .get("/")
    .expect(200)
    .expect(res => {
      expect(res.text).toBe("Hello World!");
    }));
});