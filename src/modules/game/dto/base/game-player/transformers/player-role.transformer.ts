import { has } from "lodash";
import type { TransformFnParams } from "class-transformer/types/interfaces";

import { getRoleWithName } from "@/modules/role/helpers/role.helpers";
import type { Role } from "@/modules/role/types/role.types";
import { ROLES } from "@/modules/role/constants/role.constants";
import { RoleNames } from "@/modules/role/enums/role.enum";

function playerRoleTransformer(params: TransformFnParams): unknown {
  if (!has(params.value as object, "name")) {
    return params.value;
  }
  const value = params.value as {
    name: RoleNames;
    current: RoleNames;
    original: RoleNames;
    isRevealed: boolean;
  };
  const role = getRoleWithName(ROLES as Role[], value.name);
  if (role === undefined) {
    return value;
  }
  value.current = role.name;
  value.original = role.name;
  value.isRevealed = role.name === RoleNames.VILLAGER_VILLAGER;
  return value;
}

export { playerRoleTransformer };