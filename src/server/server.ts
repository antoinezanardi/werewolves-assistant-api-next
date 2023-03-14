import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "../app.module";
import { createSwaggerDocument } from "./swagger/swagger";

async function bootstrap(port = 3000): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  const documentationPath = "docs";
  createSwaggerDocument(documentationPath, app);
  await app.listen(port, "127.0.0.1");
  const appUrl = await app.getUrl();
  Logger.log(`🐺 App is available at ${appUrl}`, "NestApplication");
  Logger.log(`📖 API Documentation is available at ${appUrl}/${documentationPath}`, "NestApplication");
  return app;
}

export { bootstrap };