import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { ROLE_NAMES, ROLE_ORIGINS, ROLE_SIDES, ROLE_TYPES } from "@/modules/role/constants/role.constants";
import { Role } from "@/modules/role/types/role.class";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeRole(role: Partial<Role> = {}, override: object = {}): Role {
  return plainToInstance(Role, {
    name: role.name ?? faker.helpers.arrayElement(ROLE_NAMES),
    side: role.side ?? faker.helpers.arrayElement(ROLE_SIDES),
    type: role.type ?? faker.helpers.arrayElement(ROLE_TYPES),
    origin: role.origin ?? faker.helpers.arrayElement(ROLE_ORIGINS),
    minInGame: role.minInGame ?? undefined,
    maxInGame: role.maxInGame ?? undefined,
    additionalCardsEligibleRecipients: role.additionalCardsEligibleRecipients ?? undefined,
    recommendedMinPlayers: role.recommendedMinPlayers ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeRole };