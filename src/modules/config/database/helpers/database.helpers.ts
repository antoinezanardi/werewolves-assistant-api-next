import type { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

import type { EnvironmentVariables } from "@/modules/config/env/types/env.types";

function getDatabasePort(configService: ConfigService<EnvironmentVariables, true>): number | undefined {
  const port = configService.get<string | undefined>("DATABASE_PORT");
  if (port === undefined) {
    return undefined;
  }
  if (process.env.JEST_WORKER_ID !== undefined) {
    const portMultiplier = 2;
    const portAdjuster = (parseInt(process.env.JEST_WORKER_ID) - 1) * portMultiplier;

    return parseInt(port) + portAdjuster;
  }
  if (process.env.CUCUMBER_WORKER_ID !== undefined) {
    const portMultiplier = 2;
    const portAdjuster = parseInt(process.env.CUCUMBER_WORKER_ID) * portMultiplier;

    return parseInt(port) + portAdjuster;
  }
  return parseInt(port);
}

function mongooseModuleFactory(configService: ConfigService<EnvironmentVariables, true>): MongooseModuleFactoryOptions {
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