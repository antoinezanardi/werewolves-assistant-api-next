import { ValidationPipe } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

async function initNestApp(app: NestFastifyApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
}

export { initNestApp };