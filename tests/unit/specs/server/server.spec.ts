import * as NestCommon from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { fastifyServerDefaultOptions } from "../../../../src/server/constants/server.constant";
import { bootstrap } from "../../../../src/server/server";

jest.mock<typeof NestCommon>("@nestjs/common", () => {
  const original = jest.requireActual<typeof NestCommon>("@nestjs/common");
  return {
    ...original,
    ValidationPipe: jest.fn(),
  };
});
jest.mock("@nestjs/core");
jest.mock("@nestjs/platform-fastify");
jest.mock("../../../../src/server/swagger/swagger");

describe("Server", () => {
  describe("bootstrap", () => {
    let app: NestFastifyApplication;
    let listenMock: jest.Mock;
    let getUrlMock: jest.Mock;
    let useGlobalPipesMock: jest.Mock;
    let useStaticAssetsMock: jest.SpyInstance;
    let logMock: jest.SpyInstance;

    beforeEach(() => {
      listenMock = jest.fn();
      getUrlMock = jest.fn().mockReturnValue("http://127.0.0.1:3000");
      useGlobalPipesMock = jest.fn();
      useStaticAssetsMock = jest.fn();
      (NestFactory.create as jest.Mock).mockImplementation().mockResolvedValue({
        listen: listenMock,
        getUrl: getUrlMock,
        useGlobalPipes: useGlobalPipesMock,
        useStaticAssets: useStaticAssetsMock,
        close: jest.fn(),
      });
      logMock = jest.spyOn(NestCommon.Logger, "log").mockImplementation();
    });

    afterEach(async() => {
      await app.close();
    });

    it("should create FastifyAdapter with default fastify server options when called.", async() => {
      app = await bootstrap();
      expect(FastifyAdapter).toHaveBeenCalledWith(fastifyServerDefaultOptions);
    });

    it("should call listen with the default port when no port is provided.", async() => {
      app = await bootstrap();
      expect(listenMock).toHaveBeenCalledWith(3000, "127.0.0.1");
    });

    it("should call listen with 4000 when port 4000 is provided.", async() => {
      app = await bootstrap(4000);
      expect(listenMock).toHaveBeenCalledWith(4000, "127.0.0.1");
    });

    it("should add validation pipe with transform when Validation Pipe constructor is called.", async() => {
      app = await bootstrap();
      expect(NestCommon.ValidationPipe).toHaveBeenCalledWith({
        transform: true,
        whitelist: true,
        transformOptions: { exposeDefaultValues: true },
      });
    });

    it("should serve public directory when called.", async() => {
      app = await bootstrap();
      expect(useStaticAssetsMock).toHaveBeenCalledWith({
        root: `${process.cwd()}/public`,
        prefix: "/public/",
      });
    });

    it("should print server and docs address with specific port when port is provided.", async() => {
      const port = 4500;
      getUrlMock.mockReturnValue(`http://127.0.0.1:${port}`);
      app = await bootstrap(port);
      expect(logMock).toHaveBeenCalledWith("🐺 App is available at http://127.0.0.1:4500", "NestApplication");
      expect(logMock).toHaveBeenCalledWith("📖 API Documentation is available at http://127.0.0.1:4500/docs", "NestApplication");
    });
  });
});