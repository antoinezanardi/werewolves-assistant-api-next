import { ApiNotFoundResponse } from "@nestjs/swagger";
import type { ApiResponseOptions } from "@nestjs/swagger";

function ApiGameNotFoundResponse(options: ApiResponseOptions = {}): MethodDecorator {
  const defaultOptions: ApiResponseOptions = { description: "The game with the provided id doesn't exist in database" };
  return ApiNotFoundResponse({ ...defaultOptions, ...options });
}

export { ApiGameNotFoundResponse };