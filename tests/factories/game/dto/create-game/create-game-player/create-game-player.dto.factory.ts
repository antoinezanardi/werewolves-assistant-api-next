import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { CreateGamePlayerDto } from "../../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { ROLE_NAMES } from "../../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";
import { bulkCreate } from "../../../../shared/bulk-create.factory";

function createFakeCreateGamePlayerDto(createGamePlayerDto: Partial<CreateGamePlayerDto> = {}, override: Partial<CreateGamePlayerDto> = {}): CreateGamePlayerDto {
  return plainToInstance(CreateGamePlayerDto, {
    name: createGamePlayerDto.name ?? faker.helpers.unique(faker.name.firstName),
    role: { name: createGamePlayerDto.role?.name ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)) },
    position: createGamePlayerDto.position ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeCreateGamePlayerDto(length: number, createGamePlayersDto: Partial<CreateGamePlayerDto>[] = [], overrides: object[] = []): CreateGamePlayerDto[] {
  return bulkCreate(length, createFakeCreateGamePlayerDto, createGamePlayersDto, overrides);
}

export { createFakeCreateGamePlayerDto, bulkCreateFakeCreateGamePlayerDto };