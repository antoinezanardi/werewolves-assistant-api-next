import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { CreateGameOptionsDto } from "../../../../../../src/modules/game/dto/create-game/create-game-options/create-game-options.dto";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";
import { createFakeRolesGameOptionsDto } from "./create-roles-game-options/create-roles-game-options.dto.factory";

function createFakeGameOptionsDto(createGameOptionsDto: Partial<CreateGameOptionsDto> = {}, override: object = {}): CreateGameOptionsDto {
  return plainToInstance(CreateGameOptionsDto, {
    composition: { isHidden: createGameOptionsDto.composition?.isHidden ?? faker.datatype.boolean() },
    roles: createFakeRolesGameOptionsDto(createGameOptionsDto.roles),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeGameOptionsDto };