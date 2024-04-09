import type { Role } from "@/modules/role/types/role.class";
import type { RoleName, RoleSide } from "@/modules/role/types/role.types";

function getRolesWithSide(roles: Role[], side: RoleSide): Role[] {
  return roles.filter(role => role.side === side);
}

function getRoleWithName(roles: Role[], name: RoleName): Role | undefined {
  return roles.find(role => role.name === name);
}

export {
  getRoleWithName,
  getRolesWithSide,
};