import { faker } from "@faker-js/faker";
import type { CreateGamePlayerDto } from "../../../../../../src/game/dto/create-game/create-game-player/create-game-player.dto";
import { ROLE_NAMES } from "../../../../../../src/role/enums/role.enum";

function createFakeCreateGamePlayerDto(obj: Partial<CreateGamePlayerDto> = {}, override: Partial<CreateGamePlayerDto> = {}): CreateGamePlayerDto {
  return {
    name: obj.name ?? faker.name.firstName(),
    role: { name: obj.role?.name ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)) },
    side: {},
    position: obj.position ?? undefined,
    ...override,
  };
}

function bulkCreateFakeCreateGamePlayerDto(length: number, players: Partial<CreateGamePlayerDto>[] = []): CreateGamePlayerDto[] {
  return Array.from(Array(length)).map((item, index) => {
    const override = index < players.length ? players[index] : {};
    return createFakeCreateGamePlayerDto(override);
  });
}

export { createFakeCreateGamePlayerDto, bulkCreateFakeCreateGamePlayerDto };