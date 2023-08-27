import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateCompositionGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-composition-game-options/create-composition-game-options.dto";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createFakeCompositionGameOptionsDto(
  createCompositionGameOptionsDto: Partial<CreateCompositionGameOptionsDto> = {},
  override: object = {},
): CreateCompositionGameOptionsDto {
  return plainToInstance(CreateCompositionGameOptionsDto, {
    isHidden: createCompositionGameOptionsDto.isHidden ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeCompositionGameOptionsDto };