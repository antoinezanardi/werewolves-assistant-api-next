import type { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { when } from "jest-when";
import { mongooseModuleFactory } from "../../../../../../src/modules/config/database/database.helper";

describe("Database Helper", () => {
  const connectionTimeoutMs = 3000;
  const configServiceMock: Partial<ConfigService> = { getOrThrow: jest.fn() };
  const host = "localhost";
  const port = "1234";
  const databaseName = "test";
  const databaseUserName = "user";
  const databasePassword = "password";

  beforeEach(() => {
    when(configServiceMock.getOrThrow as jest.Mock).calledWith("DATABASE_HOST").mockReturnValue(host);
    when(configServiceMock.getOrThrow as jest.Mock).calledWith("DATABASE_PORT").mockReturnValue(port);
    when(configServiceMock.getOrThrow as jest.Mock).calledWith("DATABASE_NAME").mockReturnValue(databaseName);
    when(configServiceMock.getOrThrow as jest.Mock).calledWith("DATABASE_USERNAME").mockReturnValue(databaseUserName);
    when(configServiceMock.getOrThrow as jest.Mock).calledWith("DATABASE_PASSWORD").mockReturnValue(databasePassword);
  });

  describe("mongooseModuleFactory", () => {
    it("should return connection string when called.", () => {
      expect(mongooseModuleFactory(configServiceMock as ConfigService)).toStrictEqual<MongooseModuleFactoryOptions>({
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