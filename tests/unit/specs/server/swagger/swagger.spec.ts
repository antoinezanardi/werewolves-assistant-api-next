import type { INestApplication } from "@nestjs/common";
import type { SwaggerCustomOptions } from "@nestjs/swagger";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { createSwaggerDocument } from "../../../../../src/server/swagger/swagger";

describe("Server Swagger", () => {
  describe("createSwaggerDocument", () => {
    const env = process.env;
    let documentBuilderSpy: { setTitle: jest.SpyInstance; setDescription: jest.SpyInstance; setVersion: jest.SpyInstance; build: jest.SpyInstance };
    let setupMock: jest.SpyInstance;
    let createDocumentMock: jest.SpyInstance;
    beforeEach(() => {
      documentBuilderSpy = {
        setTitle: jest.spyOn(DocumentBuilder.prototype, "setTitle"),
        setDescription: jest.spyOn(DocumentBuilder.prototype, "setDescription"),
        setVersion: jest.spyOn(DocumentBuilder.prototype, "setVersion"),
        build: jest.spyOn(DocumentBuilder.prototype, "build"),
      };
      createDocumentMock = jest.spyOn(SwaggerModule, "createDocument").mockImplementation();
      setupMock = jest.spyOn(SwaggerModule, "setup").mockImplementation();
      process.env = { ...env };
    });

    afterEach(() => {
      process.env = env;
    });

    it("should call document builder methods when function is called with known version.", () => {
      process.env.npm_package_version = "1.2.3";
      createSwaggerDocument("docs", {} as INestApplication);
      const expectedDescription = "Werewolves Assistant API provides over HTTP requests a way of manage Werewolves games to help the game master.";
      expect(documentBuilderSpy.setTitle).toHaveBeenCalledWith("Werewolves Assistant API Reference 🐺");
      expect(documentBuilderSpy.setDescription).toHaveBeenCalledWith(expectedDescription);
      expect(documentBuilderSpy.setVersion).toHaveBeenCalledWith("1.2.3");
      expect(documentBuilderSpy.build).toHaveBeenCalledWith();
    });

    it("should call document builder methods when function is called with unknown version.", () => {
      process.env.npm_package_version = undefined;
      createSwaggerDocument("docs", {} as INestApplication);
      const expectedDescription = "Werewolves Assistant API provides over HTTP requests a way of manage Werewolves games to help the game master.";
      expect(documentBuilderSpy.setTitle).toHaveBeenCalledWith("Werewolves Assistant API Reference 🐺");
      expect(documentBuilderSpy.setDescription).toHaveBeenCalledWith(expectedDescription);
      expect(documentBuilderSpy.setVersion).toHaveBeenCalledWith("?");
      expect(documentBuilderSpy.build).toHaveBeenCalledWith();
    });

    it("should call createDocument and setup functions when function is called.", () => {
      const path = "docs";
      const app = {};
      const options: SwaggerCustomOptions = {
        customSiteTitle: "Werewolves Assistant API Reference 🐺",
        customfavIcon: "public/assets/images/logo/square/werewolves-logo-small.png",
        customCssUrl: "public/assets/css/custom-swagger.css",
      };
      createSwaggerDocument(path, app as INestApplication);
      expect(createDocumentMock).toHaveBeenCalledTimes(1);
      expect(setupMock).toHaveBeenCalledTimes(1);
      expect(setupMock).toHaveBeenCalledWith(path, app as INestApplication, undefined, options);
    });
  });
});