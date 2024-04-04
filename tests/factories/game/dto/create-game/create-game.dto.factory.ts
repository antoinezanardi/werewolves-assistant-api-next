import { plainToInstance } from "class-transformer";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

function createFakeCreateGameWithPlayersDto(createGameDto: Partial<CreateGameDto> = {}, override: object = {}): CreateGameDto {
  return createFakeCreateGameDto({
    players: [
      createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: RoleNames.WITCH } }),
      createFakeCreateGamePlayerDto({ name: "JB", role: { name: RoleNames.SEER } }),
      createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: RoleNames.WEREWOLF } }),
      createFakeCreateGamePlayerDto({ name: "Jérémy", role: { name: RoleNames.LITTLE_GIRL } }),
    ],
    ...createGameDto,
  }, override);
}

function createFakeCreateGameDto(createGameDto: Partial<CreateGameDto> = {}, override: object = {}): CreateGameDto {
  return plainToInstance(CreateGameDto, {
    turn: createGameDto.turn ?? 1,
    phase: createGameDto.phase ?? "night",
    players: createGameDto.players ?? [],
    upcomingPlays: createGameDto.upcomingPlays ?? [],
    currentPlay: createGameDto.currentPlay ?? null,
    additionalCards: createGameDto.additionalCards ?? undefined,
    options: createGameDto.options ?? DEFAULT_GAME_OPTIONS,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeCreateGameWithPlayersDto,
  createFakeCreateGameDto,
};