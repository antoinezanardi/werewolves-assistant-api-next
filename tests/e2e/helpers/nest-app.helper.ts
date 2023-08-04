import { ValidationPipe } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { fastifyServerDefaultOptions } from "../../../src/server/constants/server.constant";
import { validationPipeDefaultOptions } from "../../../src/shared/validation/constants/validation.constant";

async function initNestApp(): Promise<{ app: NestFastifyApplication; module: TestingModule }> {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter(fastifyServerDefaultOptions));
  app.useGlobalPipes(new ValidationPipe(validationPipeDefaultOptions));
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return { app, module };
}

export { initNestApp };