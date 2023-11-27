import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeCreateGameAdditionalCardDto(
  createGameAdditionalCardDto: Partial<CreateGameAdditionalCardDto> = {},
  override: Record<string, unknown> = {},
): CreateGameAdditionalCardDto {
  return plainToInstance(CreateGameAdditionalCardDto, {
    roleName: createGameAdditionalCardDto.roleName ?? faker.helpers.arrayElement(Object.values(RoleNames)),
    recipient: createGameAdditionalCardDto.recipient ?? RoleNames.THIEF,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeCreateGameAdditionalCardDto };