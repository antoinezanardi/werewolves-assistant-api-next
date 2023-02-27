import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AppController } from "../../src/app.controller";
import { AppService } from "../../src/app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async() => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it("should return \"Hello World!\" when method is called.", () => {
      expect(appController.getHello()).toBe("Hello World!");
    });
  });
});