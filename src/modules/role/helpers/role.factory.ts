import { plainToInstance } from "class-transformer";

import { Role } from "@/modules/role/types/role.type";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createRole(role: Role): Role {
  return plainToInstance(Role, toJSON(role), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createRole };