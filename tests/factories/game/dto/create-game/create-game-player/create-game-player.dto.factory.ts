import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";

function createFakeCreateGamePlayerDto(createGamePlayerDto: Partial<CreateGamePlayerDto> = {}, override: Partial<CreateGamePlayerDto> = {}): CreateGamePlayerDto {
  return plainToInstance(CreateGamePlayerDto, {
    name: createGamePlayerDto.name ?? faker.person.firstName(),
    role: { name: createGamePlayerDto.role?.name ?? faker.helpers.arrayElement(ROLE_NAMES) },
    position: createGamePlayerDto.position ?? undefined,
    group: createGamePlayerDto.group ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function bulkCreateFakeCreateGamePlayerDto(length: number): CreateGamePlayerDto[] {
  return bulkCreate(length, createFakeCreateGamePlayerDto);
}

export {
  createFakeCreateGamePlayerDto,
  bulkCreateFakeCreateGamePlayerDto,
};