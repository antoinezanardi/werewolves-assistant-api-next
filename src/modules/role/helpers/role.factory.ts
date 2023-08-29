import { plainToInstance } from "class-transformer";

import { Role } from "@/modules/role/types/role.type";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { toJSON } from "@tests/helpers/object/object.helper";

function createRole(role: Role): Role {
  return plainToInstance(Role, toJSON(role), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createRole };