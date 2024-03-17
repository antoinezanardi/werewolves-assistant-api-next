import { plainToInstance } from "class-transformer";

import { Role } from "@/modules/role/types/role.types";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createRole(role: Role): Role {
  return plainToInstance(Role, toJSON(role), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createRole };