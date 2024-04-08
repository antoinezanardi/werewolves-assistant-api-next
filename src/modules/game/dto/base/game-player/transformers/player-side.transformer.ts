import isObject from "isobject";
import { has } from "lodash";
import type { TransformFnParams } from "class-transformer/types/interfaces";

import type { Role } from "@/modules/role/types/role.class";
import { ROLES } from "@/modules/role/constants/role-set.constants";
import type { RoleName } from "@/modules/role/types/role.types";
import { getRoleWithName } from "@/modules/role/helpers/role.helpers";
import type { RoleSides } from "@/modules/role/enums/role.enum";

function playerSideTransformer(params: TransformFnParams): unknown {
  if (!isObject(params.value) || !has(params.obj as object, ["role", "name"])) {
    return params.value;
  }
  const obj = params.obj as { role: { name: RoleName } };
  const value = params.value as {
    current: RoleSides;
    original: RoleSides;
  };
  const role = getRoleWithName(ROLES as Role[], obj.role.name);
  if (role === undefined) {
    return value;
  }
  value.current = role.side;
  value.original = role.side;
  return params.value;
}

export { playerSideTransformer };