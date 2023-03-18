import { upperFirst } from "lodash";
import type { API_RESOURCES } from "../../api/enums/api.enum";
import { getResourceSingularForm } from "../../api/helpers/api.helper";

class ResourceNotFoundError extends Error {
  public constructor(resource: API_RESOURCES, id: string) {
    const resourceSingularForm = getResourceSingularForm(resource);
    const message = `${upperFirst(resourceSingularForm)} with id "${id}" not found`;
    super(message);
  }
}

export { ResourceNotFoundError };