import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

import type { EnvironmentVariables } from "@/modules/config/env/types/env.types";
import { getDatabasePort, mongooseModuleFactory } from "@/modules/config/database/helpers/database.helpers";

describe("Database Helper", () => {
  let mocks: {
    configService: {
      getOrThrow: jest.SpyInstance;
      get: jest.SpyInstance;
    };
  };
  let services: { config: ConfigService<EnvironmentVariables, true> };

  const connectionTimeoutMs = 3000;
  const host = "localhost";
  const port = "1234";
  const databaseName = "test";
  const databaseUserName = "user";
  const databasePassword = "password";

  beforeEach(async() => {
    mocks = {
      configService: {
        getOrThrow: jest.fn(),
        get: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mocks.configService,
        },
      ],
    }).compile();

    services = { config: module.get<ConfigService<EnvironmentVariables, true>>(ConfigService<EnvironmentVariables, true>) };

    when(mocks.configService.getOrThrow).calledWith("DATABASE_HOST").mockReturnValue(host);
    when(mocks.configService.get).calledWith("DATABASE_PORT").mockReturnValue(port);
    when(mocks.configService.getOrThrow).calledWith("DATABASE_NAME").mockReturnValue(databaseName);
    when(mocks.configService.getOrThrow).calledWith("DATABASE_USERNAME").mockReturnValue(databaseUserName);
    when(mocks.configService.getOrThrow).calledWith("DATABASE_PASSWORD").mockReturnValue(databasePassword);
  });

  describe("getDatabasePort", () => {
    const env = process.env;

    beforeEach(() => {
      process.env = { ...env };
    });

    afterEach(() => {
      process.env = env;
    });

    it("should return undefined when port in env is undefined.", () => {
      when(mocks.configService.get).calledWith("DATABASE_PORT").mockReturnValue(undefined);

      expect(getDatabasePort(services.config)).toBeUndefined();
    });

    it("should return port without modifying it when port in env is defined and JEST_WORKER_ID and CUCUMBER_WORKER_ID are undefined.", () => {
      when(mocks.configService.get).calledWith("DATABASE_PORT").mockReturnValue(port);
      process.env.JEST_WORKER_ID = undefined;

      expect(getDatabasePort(services.config)).toBe(parseInt(port));
    });

    it("should return port with worker id multiplier when port in env is defined and JEST_WORKER_ID is defined.", () => {
      when(mocks.configService.get).calledWith("DATABASE_PORT").mockReturnValue(port);
      process.env.JEST_WORKER_ID = "2";

      expect(getDatabasePort(services.config)).toBe(parseInt(port) + 2);
    });

    it("should return port with worker id multiplier when port in env is defined and CUCUMBER_WORKER_ID is defined.", () => {
      when(mocks.configService.get).calledWith("DATABASE_PORT").mockReturnValue(port);
      process.env.JEST_WORKER_ID = undefined;
      process.env.CUCUMBER_WORKER_ID = "2";

      expect(getDatabasePort(services.config)).toBe(parseInt(port) + 4);
    });
  });

  describe("mongooseModuleFactory", () => {
    const env = process.env;

    beforeEach(() => {
      process.env = { ...env };
    });

    afterEach(() => {
      process.env = env;
    });

    it("should return connection string for local address when called with port.", () => {
      process.env.JEST_WORKER_ID = "1";

      expect(mongooseModuleFactory(services.config)).toStrictEqual<MongooseModuleFactoryOptions>({
        uri: `mongodb://${host}:${port}`,
        dbName: databaseName,
        authSource: "admin",
        user: databaseUserName,
        pass: encodeURIComponent(databasePassword),
        retryAttempts: 3,
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true,
        },
        retryDelay: connectionTimeoutMs,
        serverSelectionTimeoutMS: connectionTimeoutMs,
      });
    });

    it("should return connection string for remote address when called without port.", () => {
      when(mocks.configService.get).calledWith("DATABASE_PORT").mockReturnValue(undefined);

      expect(mongooseModuleFactory(services.config)).toStrictEqual<MongooseModuleFactoryOptions>({
        uri: `mongodb+srv://${host}`,
        dbName: databaseName,
        authSource: "admin",
        user: databaseUserName,
        pass: encodeURIComponent(databasePassword),
        retryAttempts: 3,
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true,
        },
        retryDelay: connectionTimeoutMs,
        serverSelectionTimeoutMS: connectionTimeoutMs,
      });
    });
  });
});