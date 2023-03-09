import type { CreateGamePlayerDto } from "../../../../../src/game/dto/create-game/create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../../../../../src/game/dto/create-game/create-game.dto";
import { ROLE_NAMES } from "../../../../../src/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "./create-game-player/create-game-player.dto.factory";

function createFakeCreateGameDto(obj: Partial<CreateGameDto> = {}): CreateGameDto {
  const players: Partial<CreateGamePlayerDto>[] = [
    { name: "Antoine", role: ROLE_NAMES.WITCH },
    { name: "JB", role: ROLE_NAMES.SEER },
    { name: "Thomas", role: ROLE_NAMES.WEREWOLF },
    { name: "Jérémy", role: ROLE_NAMES.LITTLE_GIRL },
  ];
  return {
    players: bulkCreateFakeCreateGamePlayerDto(players.length, players),
    ...obj,
  };
}

function bulkCreateFakeCreateGameDto(length: number): CreateGameDto[] {
  return Array.from(Array(length)).map(() => createFakeCreateGameDto());
}

export { createFakeCreateGameDto, bulkCreateFakeCreateGameDto };