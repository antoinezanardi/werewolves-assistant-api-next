import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateVotesGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-votes-game-options/create-votes-game-options.dto";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createFakeVotesGameOptionsDto(createVotesGameOptionsDto: Partial<CreateVotesGameOptionsDto> = {}, override: object = {}): CreateVotesGameOptionsDto {
  return plainToInstance(CreateVotesGameOptionsDto, {
    canBeSkipped: createVotesGameOptionsDto.canBeSkipped ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeVotesGameOptionsDto };