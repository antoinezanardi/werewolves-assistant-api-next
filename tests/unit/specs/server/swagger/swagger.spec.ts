import type { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { createSwaggerDocument } from "../../../../../src/server/swagger/swagger";

describe("Server Swagger", () => {
  describe("createSwaggerDocument", () => {
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
    });

    it("should call document builder methods when function is called.", () => {
      createSwaggerDocument("docs", {} as INestApplication);
      const expectedDescription = "Werewolves Assistant API provides over HTTP requests a way of manage Werewolves games to help the game master.";
      expect(documentBuilderSpy.setTitle).toHaveBeenCalledWith("Werewolves Assistant API Reference 🐺");
      expect(documentBuilderSpy.setDescription).toHaveBeenCalledWith(expectedDescription);
      expect(documentBuilderSpy.setVersion).toHaveBeenCalledWith("1.0");
      expect(documentBuilderSpy.build).toHaveBeenCalledWith();
    });

    it("should call createDocument and setup functions when function is called.", () => {
      createSwaggerDocument("docs", {} as INestApplication);
      expect(createDocumentMock).toHaveBeenCalledTimes(1);
      expect(setupMock).toHaveBeenCalledTimes(1);
    });
  });
});