import { NotFoundException } from "@nestjs/common";
import { upperFirst } from "lodash";

import type { API_RESOURCES } from "@/shared/api/enums/api.enum";
import type { RESOURCE_NOT_FOUND_REASONS } from "@/shared/exception/enums/resource-not-found-error.enum";
import { getResourceSingularForm } from "@/shared/api/helpers/api.helper";

class ResourceNotFoundException extends NotFoundException {
  public constructor(resource: API_RESOURCES, id: string, reason?: RESOURCE_NOT_FOUND_REASONS) {
    const resourceSingularForm = getResourceSingularForm(resource);
    const message = `${upperFirst(resourceSingularForm)} with id "${id}" not found`;
    super(message, { description: reason });
  }
}

export { ResourceNotFoundException };