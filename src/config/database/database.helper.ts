import type { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

function mongooseModuleFactory(configService: ConfigService): MongooseModuleFactoryOptions {
  const host = configService.getOrThrow<string>("DATABASE_HOST");
  const port = configService.getOrThrow<string>("DATABASE_PORT");
  const databaseName = configService.getOrThrow<string>("DATABASE_NAME");
  const username = configService.getOrThrow<string>("DATABASE_USERNAME");
  const password = configService.getOrThrow<string>("DATABASE_PASSWORD");
  return {
    uri: `mongodb://${host}:${port}`,
    dbName: databaseName,
    authSource: "admin",
    user: username,
    pass: encodeURIComponent(password),
  };
}

export { mongooseModuleFactory };