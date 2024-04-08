import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { Role } from "@/modules/role/types/role.class";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeRole(role: Partial<Role> = {}, override: object = {}): Role {
  return plainToInstance(Role, {
    name: role.name ?? faker.helpers.arrayElement(ROLE_NAMES),
    side: role.side ?? faker.helpers.arrayElement(Object.values(RoleSides)),
    type: role.type ?? faker.helpers.arrayElement(Object.values(RoleTypes)),
    origin: role.origin ?? faker.helpers.arrayElement(Object.values(RoleOrigins)),
    minInGame: role.minInGame ?? undefined,
    maxInGame: role.maxInGame ?? undefined,
    additionalCardsEligibleRecipients: role.additionalCardsEligibleRecipients ?? undefined,
    recommendedMinPlayers: role.recommendedMinPlayers ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeRole };