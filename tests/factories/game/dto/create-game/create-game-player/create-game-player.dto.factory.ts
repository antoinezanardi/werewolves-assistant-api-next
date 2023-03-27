import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { CreateGamePlayerDto } from "../../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { ROLE_NAMES } from "../../../../../../src/modules/role/enums/role.enum";

function createFakeCreateGamePlayerDto(obj: Partial<CreateGamePlayerDto> = {}, override: Partial<CreateGamePlayerDto> = {}): CreateGamePlayerDto {
  return plainToInstance(CreateGamePlayerDto, {
    name: obj.name ?? faker.helpers.unique(faker.name.firstName),
    role: { name: obj.role?.name ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)) },
    side: {},
    position: obj.position ?? undefined,
    ...override,
  });
}

function bulkCreateFakeCreateGamePlayerDto(length: number, players: Partial<CreateGamePlayerDto>[] = []): CreateGamePlayerDto[] {
  return Array.from(Array(length)).map((item, index) => {
    const override = index < players.length ? players[index] : {};
    return createFakeCreateGamePlayerDto(override);
  });
}

export { createFakeCreateGamePlayerDto, bulkCreateFakeCreateGamePlayerDto };