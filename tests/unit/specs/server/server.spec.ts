import * as NestCommon from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { INestApplication } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { when } from "jest-when";

import { FASTIFY_SERVER_DEFAULT_OPTIONS } from "@/server/constants/server.constant";
import { bootstrap } from "@/server/server";

jest.mock<typeof NestCommon>("@nestjs/common", () => {
  const original = jest.requireActual<typeof NestCommon>("@nestjs/common");
  return {
    ...original,
    ValidationPipe: jest.fn(),
  };
});
jest.mock("@nestjs/core");
jest.mock("@nestjs/platform-fastify");
jest.mock("@/server/swagger/swagger");

describe("Server", () => {
  describe("bootstrap", () => {
    let configServiceGetOrThrow: jest.SpyInstance;
    let mocks: {
      NestFactory: {
        create: {
          implementation: jest.SpyInstance;
          resolvedValue: {
            listen: jest.SpyInstance;
            get: jest.SpyInstance;
            getUrl: jest.SpyInstance;
            useGlobalPipes: jest.SpyInstance;
            useStaticAssets: jest.SpyInstance;
            enableCors: jest.SpyInstance;
            close: jest.SpyInstance;
          };
        };
      };
      NestCommonLogger: { log: jest.SpyInstance };
    };

    let app: NestFastifyApplication;
    const env = process.env;

    beforeEach(() => {
      configServiceGetOrThrow = jest.fn();
      const NestFactoryCreateMockResolvedValue = {
        listen: jest.fn(),
        get: jest.fn().mockReturnValue({ getOrThrow: configServiceGetOrThrow }),
        getUrl: jest.fn().mockReturnValue("http://127.0.0.1:3000"),
        useGlobalPipes: jest.fn(),
        useStaticAssets: jest.fn(),
        enableCors: jest.fn(),
        close: jest.fn(),
      };
      mocks = {
        NestFactory: {
          create: {
            implementation: jest.spyOn(NestFactory, "create").mockResolvedValue(NestFactoryCreateMockResolvedValue as unknown as INestApplication),
            resolvedValue: NestFactoryCreateMockResolvedValue,
          },
        },
        NestCommonLogger: { log: jest.spyOn(NestCommon.Logger, "log").mockImplementation() },
      };
      process.env = { ...env };
    });

    afterEach(async() => {
      process.env = env;
      await app.close();
    });

    it("should create FastifyAdapter with default fastify server options when called.", async() => {
      app = await bootstrap();

      expect(FastifyAdapter).toHaveBeenCalledExactlyOnceWith(FASTIFY_SERVER_DEFAULT_OPTIONS);
    });

    it("should call enableCors with specific origin when CORS_ORIGIN config service.", async() => {
      when(configServiceGetOrThrow).calledWith("CORS_ORIGIN").mockReturnValue("http://localhost:3000");
      app = await bootstrap();

      expect(mocks.NestFactory.create.resolvedValue.enableCors).toHaveBeenCalledExactlyOnceWith({ origin: "http://localhost:3000" });
    });

    it("should call listen with specific port and host when they are in config service.", async() => {
      when(configServiceGetOrThrow).calledWith("HOST").mockReturnValue("0.0.0.0");
      when(configServiceGetOrThrow).calledWith("PORT").mockReturnValue(8081);
      app = await bootstrap();

      expect(mocks.NestFactory.create.resolvedValue.listen).toHaveBeenCalledExactlyOnceWith(8081, "0.0.0.0");
    });

    it("should add validation pipe with transform when Validation Pipe constructor is called.", async() => {
      app = await bootstrap();

      expect(NestCommon.ValidationPipe).toHaveBeenCalledExactlyOnceWith({
        transform: true,
        whitelist: true,
        transformOptions: {
          exposeDefaultValues: true,
          exposeUnsetFields: false,
        },
      });
    });

    it("should serve public directory when called.", async() => {
      app = await bootstrap();

      expect(mocks.NestFactory.create.resolvedValue.useStaticAssets).toHaveBeenCalledExactlyOnceWith({
        root: `${process.cwd()}/public`,
        prefix: "/public/",
      });
    });

    it("should print server and docs address with specific port when port is provided.", async() => {
      mocks.NestFactory.create.resolvedValue.getUrl.mockReturnValue(`http://127.0.0.1:8080`);
      app = await bootstrap();

      expect(mocks.NestCommonLogger.log).toHaveBeenNthCalledWith(1, "🐺 App is available at http://127.0.0.1:8080", "NestApplication");
      expect(mocks.NestCommonLogger.log).toHaveBeenNthCalledWith(2, "📖 API Documentation is available at http://127.0.0.1:8080/docs", "NestApplication");
    });
  });
});