import type { ValidationPipeOptions } from "@nestjs/common";
import type { ClassTransformOptions } from "class-transformer/types/interfaces";

const DEFAULT_PLAIN_TO_INSTANCE_OPTIONS: Readonly<ClassTransformOptions> = Object.freeze({
  exposeDefaultValues: true,
  exposeUnsetFields: false,
});

const DEFAULT_VALIDATION_PIPE_OPTIONS: Readonly<ValidationPipeOptions> = Object.freeze({
  transform: true,
  whitelist: true,
  transformOptions: DEFAULT_PLAIN_TO_INSTANCE_OPTIONS,
});

export {
  DEFAULT_PLAIN_TO_INSTANCE_OPTIONS,
  DEFAULT_VALIDATION_PIPE_OPTIONS,
};