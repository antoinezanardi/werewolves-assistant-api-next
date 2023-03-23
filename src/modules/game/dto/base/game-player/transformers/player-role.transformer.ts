import type { TransformFnParams } from "class-transformer/types/interfaces";
import { has } from "lodash";
import { roles } from "../../../../../role/constants/role.constant";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";

function playerRoleTransformer(params: TransformFnParams): unknown {
  if (!has(params.value as object, "name")) {
    return params.value;
  }
  const value = params.value as {
    name: string;
    current: ROLE_NAMES;
    original: ROLE_NAMES;
    isRevealed: boolean;
  };
  const role = roles.find(({ name }) => name === value.name);
  if (role === undefined) {
    return value;
  }
  value.current = role.name;
  value.original = role.name;
  value.isRevealed = role.name === ROLE_NAMES.VILLAGER_VILLAGER;
  return value;
}

export { playerRoleTransformer };