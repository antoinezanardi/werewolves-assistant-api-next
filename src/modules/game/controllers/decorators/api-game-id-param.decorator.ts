import { ApiParam } from "@nestjs/swagger";
import type { ApiParamOptions } from "@nestjs/swagger";

function ApiGameIdParam(options: Partial<ApiParamOptions> = {}): MethodDecorator {
  const defaultOptions: ApiParamOptions = {
    name: "id",
    description: "Game's Id. Must be a valid Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
  };
  return ApiParam({ ...defaultOptions, ...options });
}

export { ApiGameIdParam };