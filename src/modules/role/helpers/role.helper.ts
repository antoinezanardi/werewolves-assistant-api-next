import { cloneDeep } from "lodash";
import type { ROLE_SIDES } from "../enums/role.enum";
import type { Role } from "../types/role.type";

function getRolesWithSide(roles: Role[], side: ROLE_SIDES): Role[] {
  return cloneDeep(roles.filter(role => role.side === side));
}

export { getRolesWithSide };