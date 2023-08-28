import * as NestCommon from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { INestApplication } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

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
    let mocks: {
      NestFactory: {
        create: {
          implementation: jest.SpyInstance;
          resolvedValue: {
            listen: jest.SpyInstance;
            getUrl: jest.SpyInstance;
            useGlobalPipes: jest.SpyInstance;
            useStaticAssets: jest.SpyInstance;
            close: jest.SpyInstance;
          };
        };
      };
      NestCommonLogger: { log: jest.SpyInstance };
    };
    
    let app: NestFastifyApplication;

    beforeEach(() => {
      const NestFactoryCreateMockResolvedValue = {
        listen: jest.fn(),
        getUrl: jest.fn().mockReturnValue("http://127.0.0.1:3000"),
        useGlobalPipes: jest.fn(),
        useStaticAssets: jest.fn(),
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
    });

    afterEach(async() => {
      await app.close();
    });

    it("should create FastifyAdapter with default fastify server options when called.", async() => {
      app = await bootstrap();
      
      expect(FastifyAdapter).toHaveBeenCalledExactlyOnceWith(FASTIFY_SERVER_DEFAULT_OPTIONS);
    });

    it("should call listen with the default port when no port is provided.", async() => {
      app = await bootstrap();
      
      expect(mocks.NestFactory.create.resolvedValue.listen).toHaveBeenCalledExactlyOnceWith(3000, "127.0.0.1");
    });

    it("should call listen with 4000 when port 4000 is provided.", async() => {
      app = await bootstrap(4000);
      
      expect(mocks.NestFactory.create.resolvedValue.listen).toHaveBeenCalledExactlyOnceWith(4000, "127.0.0.1");
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
      const port = 4500;
      mocks.NestFactory.create.resolvedValue.getUrl.mockReturnValue(`http://127.0.0.1:${port}`);
      app = await bootstrap(port);
      
      expect(mocks.NestCommonLogger.log).toHaveBeenCalledWith("🐺 App is available at http://127.0.0.1:4500", "NestApplication");
      expect(mocks.NestCommonLogger.log).toHaveBeenCalledWith("📖 API Documentation is available at http://127.0.0.1:4500/docs", "NestApplication");
    });
  });
});