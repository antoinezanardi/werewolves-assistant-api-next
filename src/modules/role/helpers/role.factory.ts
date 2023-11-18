import { plainToInstance } from "class-transformer";

import { Role } from "@/modules/role/types/role.type";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createRole(role: Role): Role {
  return plainToInstance(Role, toJSON(role), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createRole };