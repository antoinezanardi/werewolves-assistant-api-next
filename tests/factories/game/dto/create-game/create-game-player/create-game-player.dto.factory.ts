import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";

function createFakeCreateGamePlayerDto(createGamePlayerDto: Partial<CreateGamePlayerDto> = {}, override: Partial<CreateGamePlayerDto> = {}): CreateGamePlayerDto {
  return plainToInstance(CreateGamePlayerDto, {
    name: createGamePlayerDto.name ?? faker.person.firstName(),
    role: { name: createGamePlayerDto.role?.name ?? faker.helpers.arrayElement(Object.values(RoleNames)) },
    position: createGamePlayerDto.position ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function bulkCreateFakeCreateGamePlayerDto(length: number, createGamePlayersDto: Partial<CreateGamePlayerDto>[] = [], overrides: object[] = []): CreateGamePlayerDto[] {
  return bulkCreate(length, createFakeCreateGamePlayerDto, createGamePlayersDto, overrides);
}

export { createFakeCreateGamePlayerDto, bulkCreateFakeCreateGamePlayerDto };