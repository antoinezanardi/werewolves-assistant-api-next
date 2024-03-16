import type { ApiPropertyOptions } from "@nestjs/swagger";

import { ApiResources } from "@/shared/api/enums/api.enum";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

function getResourceSingularForm(resource: ApiResources): string {
  const resourceSingularForms: Record<ApiResources, string> = {
    [ApiResources.GAMES]: "game",
    [ApiResources.PLAYERS]: "player",
    [ApiResources.GAME_ADDITIONAL_CARDS]: "additional card",
    [ApiResources.ROLES]: "role",
    [ApiResources.HEALTH]: "health",
  };
  return resourceSingularForms[resource];
}

function convertMongoosePropOptionsToApiPropertyOptions(mongoosePropOptions: MongoosePropOptions): ApiPropertyOptions {
  return {
    required: mongoosePropOptions.required,
    enum: mongoosePropOptions.enum,
    default: mongoosePropOptions.default,
    minItems: mongoosePropOptions.minItems,
    maxItems: mongoosePropOptions.maxItems,
    minimum: mongoosePropOptions.min,
    maximum: mongoosePropOptions.max,
  };
}

export {
  getResourceSingularForm,
  convertMongoosePropOptionsToApiPropertyOptions,
};