import type { ValidationPipeOptions } from "@nestjs/common";

const validationPipeDefaultOptions: ValidationPipeOptions = Object.freeze({
  transform: true,
  whitelist: true,
});

export { validationPipeDefaultOptions };