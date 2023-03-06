import { faker } from "@faker-js/faker";
import type { CreateGamePlayerDto } from "../../../../../../src/game/dto/create-game/create-game-player/create-game-player.dto";
import { ROLE_NAMES } from "../../../../../../src/role/enums/role.enum";

function createFakeCreateGamePlayerDto(override: Partial<CreateGamePlayerDto> = {}): CreateGamePlayerDto {
  return {
    name: faker.name.firstName(),
    role: faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    ...override,
  };
}

function bulkCreateFakeCreateGamePlayerDto(length: number, overrides: Partial<CreateGamePlayerDto>[] = []): CreateGamePlayerDto[] {
  return Array.from(Array(length)).map((item, index) => {
    const override = index < overrides.length ? overrides[index] : {};
    override.name ??= faker.helpers.unique(faker.name.firstName);
    return createFakeCreateGamePlayerDto(override);
  });
}

export { createFakeCreateGamePlayerDto, bulkCreateFakeCreateGamePlayerDto };