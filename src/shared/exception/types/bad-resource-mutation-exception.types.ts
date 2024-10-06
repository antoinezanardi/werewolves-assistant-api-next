import { BadRequestException } from "@nestjs/common";
import { upperFirst } from "lodash";

import type { ApiResources } from "@/shared/api/enums/api.enums";
import type { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enums";
import { getResourceSingularForm } from "@/shared/api/helpers/api.helpers";

class BadResourceMutationException extends BadRequestException {
  public constructor(resource: ApiResources, id: string, reason?: BadResourceMutationReasons) {
    const resourceSingularForm = getResourceSingularForm(resource);
    const message = `Bad mutation for ${upperFirst(resourceSingularForm)} with id "${id}"`;
    super(message, { description: reason });
  }
}

export { BadResourceMutationException };