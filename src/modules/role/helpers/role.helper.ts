import type { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";
import type { Role } from "@/modules/role/types/role.type";

function getRolesWithSide(roles: Role[], side: RoleSides): Role[] {
  return roles.filter(role => role.side === side);
}

function getRoleWithName(roles: Role[], name: RoleNames): Role | undefined {
  return roles.find(role => role.name === name);
}

export {
  getRoleWithName,
  getRolesWithSide,
};