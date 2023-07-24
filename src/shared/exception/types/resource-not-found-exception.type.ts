import { NotFoundException } from "@nestjs/common";
import { upperFirst } from "lodash";
import { API_RESOURCES } from "../../api/enums/api.enum";
import { getResourceSingularForm } from "../../api/helpers/api.helper";
import { RESOURCE_NOT_FOUND_REASONS } from "../enums/resource-not-found-error.enum";

class ResourceNotFoundException extends NotFoundException {
  public constructor(resource: API_RESOURCES, id: string, reason?: RESOURCE_NOT_FOUND_REASONS) {
    const resourceSingularForm = getResourceSingularForm(resource);
    const message = `${upperFirst(resourceSingularForm)} with id "${id}" not found`;
    super(message, { description: reason });
  }
}

export { ResourceNotFoundException };