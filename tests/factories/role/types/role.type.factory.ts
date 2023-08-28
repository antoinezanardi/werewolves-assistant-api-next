import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { RoleNames, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { Role } from "@/modules/role/types/role.type";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";

function createFakeRole(role: Partial<Role> = {}, override: object = {}): Role {
  return plainToInstance(Role, {
    name: role.name ?? faker.helpers.arrayElement(Object.values(RoleNames)),
    side: role.side ?? faker.helpers.arrayElement(Object.values(RoleSides)),
    type: role.type ?? faker.helpers.arrayElement(Object.values(RoleTypes)),
    minInGame: role.minInGame ?? undefined,
    maxInGame: role.maxInGame ?? undefined,
    recommendedMinPlayers: role.recommendedMinPlayers ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function bulkCreateFakeRoles(length: number, roles: Partial<Role>[] = [], overrides: object[] = []): Role[] {
  return bulkCreate(length, createFakeRole, roles, overrides);
}

export {
  createFakeRole,
  bulkCreateFakeRoles,
};