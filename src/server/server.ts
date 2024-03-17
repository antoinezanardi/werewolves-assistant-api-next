import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import { FASTIFY_SERVER_DEFAULT_OPTIONS } from "@/server/constants/server.constants";
import { createSwaggerDocument } from "@/server/swagger/swagger";

import { DEFAULT_VALIDATION_PIPE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { AppModule } from "@/app.module";

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(FASTIFY_SERVER_DEFAULT_OPTIONS));
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({ origin: configService.getOrThrow<string>("CORS_ORIGIN") });
  app.useGlobalPipes(new ValidationPipe(DEFAULT_VALIDATION_PIPE_OPTIONS));
  const documentationPath = "docs";
  createSwaggerDocument(documentationPath, app);
  app.useStaticAssets({
    root: `${process.cwd()}/public`,
    prefix: "/public/",
  });
  const host = configService.getOrThrow<string>("HOST");
  const port = configService.getOrThrow<number>("PORT");
  await app.listen(port, host);
  const appUrl = await app.getUrl();
  Logger.log(`🐺 App is available at ${appUrl}`, "NestApplication");
  Logger.log(`📖 API Documentation is available at ${appUrl}/${documentationPath}`, "NestApplication");
  return app;
}

export { bootstrap };