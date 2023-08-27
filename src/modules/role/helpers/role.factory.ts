import { plainToInstance } from "class-transformer";

import { Role } from "@/modules/role/types/role.type";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { toJSON } from "@tests/helpers/object/object.helper";

function createRole(role: Role): Role {
  return plainToInstance(Role, toJSON(role), plainToInstanceDefaultOptions);
}

export { createRole };