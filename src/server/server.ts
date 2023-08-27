import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import { fastifyServerDefaultOptions } from "@/server/constants/server.constant";
import { createSwaggerDocument } from "@/server/swagger/swagger";

import { validationPipeDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { AppModule } from "@/app.module";

async function bootstrap(port = 3000): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyServerDefaultOptions));
  app.useGlobalPipes(new ValidationPipe(validationPipeDefaultOptions));
  const documentationPath = "docs";
  createSwaggerDocument(documentationPath, app);
  app.useStaticAssets({
    root: `${process.cwd()}/public`,
    prefix: "/public/",
  });
  await app.listen(port, "127.0.0.1");
  const appUrl = await app.getUrl();
  Logger.log(`🐺 App is available at ${appUrl}`, "NestApplication");
  Logger.log(`📖 API Documentation is available at ${appUrl}/${documentationPath}`, "NestApplication");
  return app;
}

export { bootstrap };