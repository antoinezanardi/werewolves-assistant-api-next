import { ValidationPipe } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { validationPipeDefaultOptions } from "../../../src/shared/validation/constants/validation.constant";

async function initNestApp(app: NestFastifyApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe(validationPipeDefaultOptions));
  await app.init();
}

export { initNestApp };