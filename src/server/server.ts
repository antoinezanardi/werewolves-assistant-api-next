import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { createSwaggerDocument } from "./swagger/swagger";

async function bootstrap(port = 3000): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const documentationPath = "docs";
  createSwaggerDocument(documentationPath, app);
  await app.listen(port, "127.0.0.1");
  const appUrl = await app.getUrl();
  Logger.log(`🐺 App is available at ${appUrl}`, "NestApplication");
  Logger.log(`📖 API Documentation is available at ${appUrl}/${documentationPath}`, "NestApplication");
}

export { bootstrap };