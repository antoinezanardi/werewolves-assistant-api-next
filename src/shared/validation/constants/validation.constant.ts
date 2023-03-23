import type { ValidationPipeOptions } from "@nestjs/common";
import type { ClassTransformOptions } from "class-transformer/types/interfaces";

const plainToInstanceDefaultOptions: ClassTransformOptions = Object.freeze({ exposeDefaultValues: true });

const validationPipeDefaultOptions: ValidationPipeOptions = Object.freeze({
  transform: true,
  whitelist: true,
  transformOptions: plainToInstanceDefaultOptions,
});

export { plainToInstanceDefaultOptions, validationPipeDefaultOptions };