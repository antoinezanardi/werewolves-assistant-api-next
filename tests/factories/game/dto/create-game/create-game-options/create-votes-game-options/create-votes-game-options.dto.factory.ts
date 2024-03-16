import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateVotesGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-votes-game-options/create-votes-game-options.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeVotesGameOptionsDto(createVotesGameOptionsDto: Partial<CreateVotesGameOptionsDto> = {}, override: object = {}): CreateVotesGameOptionsDto {
  return plainToInstance(CreateVotesGameOptionsDto, {
    canBeSkipped: createVotesGameOptionsDto.canBeSkipped ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeVotesGameOptionsDto };