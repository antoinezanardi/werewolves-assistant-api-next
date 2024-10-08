import { ValidationPipe } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";

import { FASTIFY_SERVER_DEFAULT_OPTIONS } from "@/server/constants/server.constants";

import { DEFAULT_VALIDATION_PIPE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { AppModule } from "@/app.module";

async function initNestApp(): Promise<{ app: NestFastifyApplication; module: TestingModule }> {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter(FASTIFY_SERVER_DEFAULT_OPTIONS));
  app.useGlobalPipes(new ValidationPipe(DEFAULT_VALIDATION_PIPE_OPTIONS));
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return { app, module };
}

export { initNestApp };