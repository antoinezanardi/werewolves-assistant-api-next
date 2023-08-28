import type { RoleSides } from "@/modules/role/enums/role.enum";
import type { Role } from "@/modules/role/types/role.type";

function getRolesWithSide(roles: Role[], side: RoleSides): Role[] {
  return roles.filter(role => role.side === side);
}

export { getRolesWithSide };