import { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import { mongooseModuleFactory } from "../../../../../../../src/modules/config/database/helpers/database.helper";

describe("Database Helper", () => {
  let mocks: { configService: { getOrThrow: jest.SpyInstance } };
  let services: { config: ConfigService };
  
  const connectionTimeoutMs = 3000;
  const host = "localhost";
  const port = "1234";
  const databaseName = "test";
  const databaseUserName = "user";
  const databasePassword = "password";
  
  beforeEach(async() => {
    mocks = { configService: { getOrThrow: jest.fn() } };

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mocks.configService,
        },
      ],
    }).compile();
    
    services = { config: module.get<ConfigService>(ConfigService) };
    
    when(mocks.configService.getOrThrow).calledWith("DATABASE_HOST").mockReturnValue(host);
    when(mocks.configService.getOrThrow).calledWith("DATABASE_PORT").mockReturnValue(port);
    when(mocks.configService.getOrThrow).calledWith("DATABASE_NAME").mockReturnValue(databaseName);
    when(mocks.configService.getOrThrow).calledWith("DATABASE_USERNAME").mockReturnValue(databaseUserName);
    when(mocks.configService.getOrThrow).calledWith("DATABASE_PASSWORD").mockReturnValue(databasePassword);
  });

  describe("mongooseModuleFactory", () => {
    it("should return connection string when called.", () => {
      expect(mongooseModuleFactory(services.config)).toStrictEqual<MongooseModuleFactoryOptions>({
        uri: `mongodb://${host}:${port}`,
        dbName: databaseName,
        authSource: "admin",
        user: databaseUserName,
        pass: encodeURIComponent(databasePassword),
        retryAttempts: 3,
        retryDelay: connectionTimeoutMs,
        serverSelectionTimeoutMS: connectionTimeoutMs,
      });
    });
  });
});