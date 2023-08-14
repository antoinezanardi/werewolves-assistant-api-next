import { plainToInstance } from "class-transformer";
import { toJSON } from "../../../../tests/helpers/object/object.helper";
import { plainToInstanceDefaultOptions } from "../../../shared/validation/constants/validation.constant";
import { Role } from "../types/role.type";

function createRole(role: Role): Role {
  return plainToInstance(Role, toJSON(role), plainToInstanceDefaultOptions);
}

export { createRole };