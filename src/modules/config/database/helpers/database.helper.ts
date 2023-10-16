import type { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

function getDatabasePort(configService: ConfigService): number | undefined {
  const port = configService.get<string>("DATABASE_PORT");
  if (port === undefined) {
    return undefined;
  }
  if (process.env.JEST_WORKER_ID !== undefined) {
    const portMultiplier = 2;
    const workerId = (parseInt(process.env.JEST_WORKER_ID) - 1) * portMultiplier;
    return parseInt(port) + workerId;
  }
  return parseInt(port);
}

function mongooseModuleFactory(configService: ConfigService): MongooseModuleFactoryOptions {
  const connectionTimeoutMs = 3000;
  const host = configService.getOrThrow<string>("DATABASE_HOST");
  const port = getDatabasePort(configService);
  const databaseName = configService.getOrThrow<string>("DATABASE_NAME");
  const username = configService.getOrThrow<string>("DATABASE_USERNAME");
  const password = configService.getOrThrow<string>("DATABASE_PASSWORD");
  const uri = port !== undefined ? `mongodb://${host}:${port}` : `mongodb+srv://${host}`;
  return {
    uri,
    dbName: databaseName,
    authSource: "admin",
    user: username,
    pass: encodeURIComponent(password),
    retryAttempts: 3,
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
    retryDelay: connectionTimeoutMs,
    serverSelectionTimeoutMS: connectionTimeoutMs,
  };
}

export {
  getDatabasePort,
  mongooseModuleFactory,
};