import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { ROLE_NAMES, ROLE_SIDES, ROLE_TYPES } from "../../../../src/modules/role/enums/role.enum";
import { Role } from "../../../../src/modules/role/types/role.type";
import { plainToInstanceDefaultOptions } from "../../../../src/shared/validation/constants/validation.constant";
import { bulkCreate } from "../../shared/bulk-create.factory";

function createFakeRole(role: Partial<Role> = {}, override: object = {}): Role {
  return plainToInstance(Role, {
    name: role.name ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    side: role.side ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
    type: role.type ?? faker.helpers.arrayElement(Object.values(ROLE_TYPES)),
    minInGame: role.minInGame ?? undefined,
    maxInGame: role.maxInGame ?? undefined,
    recommendedMinPlayers: role.recommendedMinPlayers ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeRoles(length: number, roles: Partial<Role>[] = [], overrides: object[] = []): Role[] {
  return bulkCreate(length, createFakeRole, roles, overrides);
}

export {
  createFakeRole,
  bulkCreateFakeRoles,
};