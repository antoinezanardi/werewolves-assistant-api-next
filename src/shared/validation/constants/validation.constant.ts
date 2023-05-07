import type { ValidationPipeOptions } from "@nestjs/common";
import type { ClassTransformOptions } from "class-transformer/types/interfaces";

const plainToInstanceDefaultOptions: Readonly<ClassTransformOptions> = Object.freeze({
  exposeDefaultValues: true,
  exposeUnsetFields: false,
});

const validationPipeDefaultOptions: Readonly<ValidationPipeOptions> = Object.freeze({
  transform: true,
  whitelist: true,
  transformOptions: plainToInstanceDefaultOptions,
});

export { plainToInstanceDefaultOptions, validationPipeDefaultOptions };