import { upperFirst } from "lodash";
import type { API_RESOURCES } from "../../api/enums/api.enum";
import { getResourceSingularForm } from "../../api/helpers/api.helper";
import type { RESOURCE_NOT_FOUND_REASONS } from "../enums/resource-not-found-error.enum";

class ResourceNotFoundError extends Error {
  public constructor(resource: API_RESOURCES, id: string, reason?: RESOURCE_NOT_FOUND_REASONS) {
    const resourceSingularForm = getResourceSingularForm(resource);
    let message = `${upperFirst(resourceSingularForm)} with id "${id}" not found`;
    if (reason) {
      message += ` : ${reason}`;
    }
    super(message);
  }
}

export { ResourceNotFoundError };