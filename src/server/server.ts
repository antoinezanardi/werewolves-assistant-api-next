import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import { DEFAULT_APP_HOST, DEFAULT_APP_PORT } from "@/modules/config/env/constants/env.constant";

import { FASTIFY_SERVER_DEFAULT_OPTIONS } from "@/server/constants/server.constant";
import { createSwaggerDocument } from "@/server/swagger/swagger";

import { DEFAULT_VALIDATION_PIPE_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { AppModule } from "@/app.module";

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(FASTIFY_SERVER_DEFAULT_OPTIONS));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(DEFAULT_VALIDATION_PIPE_OPTIONS));
  const documentationPath = "docs";
  createSwaggerDocument(documentationPath, app);
  app.useStaticAssets({
    root: `${process.cwd()}/public`,
    prefix: "/public/",
  });
  const host = process.env.HOST ?? DEFAULT_APP_HOST;
  const port = process.env.PORT ?? DEFAULT_APP_PORT;
  await app.listen(port, host);
  const appUrl = await app.getUrl();
  Logger.log(`🐺 App is available at ${appUrl}`, "NestApplication");
  Logger.log(`📖 API Documentation is available at ${appUrl}/${documentationPath}`, "NestApplication");
  return app;
}

export { bootstrap };