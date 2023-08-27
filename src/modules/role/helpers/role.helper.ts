import type { ROLE_SIDES } from "@/modules/role/enums/role.enum";
import type { Role } from "@/modules/role/types/role.type";

function getRolesWithSide(roles: Role[], side: ROLE_SIDES): Role[] {
  return roles.filter(role => role.side === side);
}

export { getRolesWithSide };