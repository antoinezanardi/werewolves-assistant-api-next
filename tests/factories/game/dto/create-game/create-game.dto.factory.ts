import type { CreateGamePlayerDto } from "../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../../../../../src/modules/game/dto/create-game/create-game.dto";
import { ROLE_NAMES } from "../../../../../src/modules/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "./create-game-player/create-game-player.dto.factory";

function createFakeCreateGameDto(obj: Partial<CreateGameDto> = {}, override: Partial<CreateGameDto> = {}): CreateGameDto {
  const players: Partial<CreateGamePlayerDto>[] = [
    { name: "Antoine", role: { name: ROLE_NAMES.WITCH } },
    { name: "JB", role: { name: ROLE_NAMES.SEER } },
    { name: "Thomas", role: { name: ROLE_NAMES.WEREWOLF } },
    { name: "Jérémy", role: { name: ROLE_NAMES.LITTLE_GIRL } },
  ];
  return {
    players: obj.players ?? bulkCreateFakeCreateGamePlayerDto(players.length, players),
    options: obj.options ?? undefined,
    ...override,
  };
}

export { createFakeCreateGameDto };