import type { ValidationPipeOptions } from "@nestjs/common";
import type { ClassTransformOptions } from "class-transformer/types/interfaces";

const PLAIN_TO_INSTANCE_DEFAULT_OPTIONS: Readonly<ClassTransformOptions> = Object.freeze({
  exposeDefaultValues: true,
  exposeUnsetFields: false,
});

const VALIDATION_PIPE_DEFAULT_OPTIONS: Readonly<ValidationPipeOptions> = Object.freeze({
  transform: true,
  whitelist: true,
  transformOptions: PLAIN_TO_INSTANCE_DEFAULT_OPTIONS,
});

export {
  PLAIN_TO_INSTANCE_DEFAULT_OPTIONS,
  VALIDATION_PIPE_DEFAULT_OPTIONS,
};