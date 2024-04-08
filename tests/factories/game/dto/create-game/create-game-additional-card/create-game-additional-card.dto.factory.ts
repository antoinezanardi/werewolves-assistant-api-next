import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeCreateGameAdditionalCardDto(
  createGameAdditionalCardDto: Partial<CreateGameAdditionalCardDto> = {},
  override: Record<string, unknown> = {},
): CreateGameAdditionalCardDto {
  return plainToInstance(CreateGameAdditionalCardDto, {
    roleName: createGameAdditionalCardDto.roleName ?? faker.helpers.arrayElement(ROLE_NAMES),
    recipient: createGameAdditionalCardDto.recipient ?? "thief",
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeCreateGameAdditionalCardDto };