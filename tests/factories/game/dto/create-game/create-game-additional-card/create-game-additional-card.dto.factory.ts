import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createFakeCreateGameAdditionalCardDto(
  createGameAdditionalCardDto: Partial<CreateGameAdditionalCardDto> = {},
  override: Record<string, unknown> = {},
): CreateGameAdditionalCardDto {
  return plainToInstance(CreateGameAdditionalCardDto, {
    roleName: createGameAdditionalCardDto.roleName ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    recipient: createGameAdditionalCardDto.recipient ?? ROLE_NAMES.THIEF,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeCreateGameAdditionalCardDto };