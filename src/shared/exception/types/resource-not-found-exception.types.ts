import { NotFoundException } from "@nestjs/common";
import { upperFirst } from "lodash";

import type { ApiResources } from "@/shared/api/enums/api.enums";
import type { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enums";
import { getResourceSingularForm } from "@/shared/api/helpers/api.helpers";

class ResourceNotFoundException extends NotFoundException {
  public constructor(resource: ApiResources, id: string, reason?: ResourceNotFoundReasons) {
    const resourceSingularForm = getResourceSingularForm(resource);
    const message = `${upperFirst(resourceSingularForm)} with id "${id}" not found`;
    super(message, { description: reason });
  }
}

export { ResourceNotFoundException };