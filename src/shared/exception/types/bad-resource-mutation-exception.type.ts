import { BadRequestException } from "@nestjs/common";
import { upperFirst } from "lodash";
import type { API_RESOURCES } from "../../api/enums/api.enum";
import { getResourceSingularForm } from "../../api/helpers/api.helper";
import type { BAD_RESOURCE_MUTATION_REASONS } from "../enums/bad-resource-mutation-error.enum";

class BadResourceMutationException extends BadRequestException {
  public constructor(resource: API_RESOURCES, id: string, reason?: BAD_RESOURCE_MUTATION_REASONS) {
    const resourceSingularForm = getResourceSingularForm(resource);
    const message = `Bad mutation for ${upperFirst(resourceSingularForm)} with id "${id}"`;
    super(message, { description: reason });
  }
}

export { BadResourceMutationException };