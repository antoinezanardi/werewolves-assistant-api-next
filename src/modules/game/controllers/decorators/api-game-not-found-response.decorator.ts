import type { ApiResponseOptions } from "@nestjs/swagger";
import { ApiNotFoundResponse } from "@nestjs/swagger";

function ApiGameNotFoundResponse(options: ApiResponseOptions = {}): ClassDecorator & MethodDecorator {
  const defaultOptions: ApiResponseOptions = { description: "The game with the provided id doesn't exist in database" };
  return ApiNotFoundResponse({ ...defaultOptions, ...options });
}

export { ApiGameNotFoundResponse };