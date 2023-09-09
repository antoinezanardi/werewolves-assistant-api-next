import isObject from "isobject";
import { has } from "lodash";
import type { TransformFnParams } from "class-transformer/types/interfaces";

import { ROLES } from "@/modules/role/constants/role.constant";
import type { RoleSides, RoleNames } from "@/modules/role/enums/role.enum";

function playerSideTransformer(params: TransformFnParams): unknown {
  if (!isObject(params.value) || !isObject(params.obj) || !has(params.obj as object, ["role", "name"])) {
    return params.value;
  }
  const obj = params.obj as { role: { name: RoleNames } };
  const value = params.value as {
    current: RoleSides;
    original: RoleSides;
  };
  const role = ROLES.find(({ name }) => name === obj.role.name);
  if (role === undefined) {
    return value;
  }
  value.current = role.side;
  value.original = role.side;
  return params.value;
}

export { playerSideTransformer };