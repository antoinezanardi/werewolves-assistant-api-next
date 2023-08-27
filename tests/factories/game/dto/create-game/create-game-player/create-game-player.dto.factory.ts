import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";

function createFakeCreateGamePlayerDto(createGamePlayerDto: Partial<CreateGamePlayerDto> = {}, override: Partial<CreateGamePlayerDto> = {}): CreateGamePlayerDto {
  return plainToInstance(CreateGamePlayerDto, {
    name: createGamePlayerDto.name ?? faker.person.firstName(),
    role: { name: createGamePlayerDto.role?.name ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)) },
    position: createGamePlayerDto.position ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeCreateGamePlayerDto(length: number, createGamePlayersDto: Partial<CreateGamePlayerDto>[] = [], overrides: object[] = []): CreateGamePlayerDto[] {
  return bulkCreate(length, createFakeCreateGamePlayerDto, createGamePlayersDto, overrides);
}

export { createFakeCreateGamePlayerDto, bulkCreateFakeCreateGamePlayerDto };