import { has } from "lodash";
import type { TransformFnParams } from "class-transformer/types/interfaces";

import { ROLES } from "@/modules/role/constants/role-set.constants";
import type { Role } from "@/modules/role/types/role.class";
import { getRoleWithName } from "@/modules/role/helpers/role.helpers";
import type { RoleName } from "@/modules/role/types/role.types";

function playerRoleTransformer(params: TransformFnParams): unknown {
  if (!has(params.value as object, "name")) {
    return params.value;
  }
  const value = params.value as {
    name: RoleName;
    current: RoleName;
    original: RoleName;
    isRevealed: boolean;
  };
  const role = getRoleWithName(ROLES as Role[], value.name);
  if (role === undefined) {
    return value;
  }
  value.current = role.name;
  value.original = role.name;
  value.isRevealed = role.name === "villager-villager";

  return value;
}

export { playerRoleTransformer };