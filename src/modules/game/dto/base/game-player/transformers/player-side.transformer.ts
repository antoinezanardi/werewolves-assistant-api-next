import type { TransformFnParams } from "class-transformer/types/interfaces";
import { has } from "lodash";
import { roles } from "../../../../../role/constants/role.constant";
import type { ROLE_SIDES, ROLE_NAMES } from "../../../../../role/enums/role.enum";

function playerSideTransformer(params: TransformFnParams): unknown {
  if (typeof params.value !== "object" || typeof params.obj !== "object" || !has(params.obj as object, ["role", "name"])) {
    return params.value;
  }
  const obj = params.obj as { role: { name: ROLE_NAMES } };
  const value = params.value as {
    current: ROLE_SIDES;
    original: ROLE_SIDES;
  };
  const role = roles.find(({ name }) => name === obj.role.name);
  if (role === undefined) {
    return value;
  }
  value.current = role.side;
  value.original = role.side;
  return params.value;
}

export { playerSideTransformer };