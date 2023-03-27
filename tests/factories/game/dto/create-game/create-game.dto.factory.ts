import { plainToInstance } from "class-transformer";
import { defaultGameOptions } from "../../../../../src/modules/game/constants/game-options/game-options.constant";
import type { CreateGamePlayerDto } from "../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { CreateGameDto } from "../../../../../src/modules/game/dto/create-game/create-game.dto";
import { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import { ROLE_NAMES } from "../../../../../src/modules/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "./create-game-player/create-game-player.dto.factory";

function createFakeCreateGameDto(obj: Partial<CreateGameDto> = {}, override: object = {}): CreateGameDto {
  const players: Partial<CreateGamePlayerDto>[] = [
    { name: "Antoine", role: { name: ROLE_NAMES.WITCH } },
    { name: "JB", role: { name: ROLE_NAMES.SEER } },
    { name: "Thomas", role: { name: ROLE_NAMES.WEREWOLF } },
    { name: "Jérémy", role: { name: ROLE_NAMES.LITTLE_GIRL } },
  ];
  return plainToInstance(CreateGameDto, {
    turn: obj.turn ?? 1,
    phase: obj.phase ?? GAME_PHASES.NIGHT,
    players: obj.players ?? bulkCreateFakeCreateGamePlayerDto(players.length, players),
    upcomingPlays: obj.upcomingPlays ?? [],
    options: obj.options ?? defaultGameOptions,
    ...override,
  });
}

export { createFakeCreateGameDto };