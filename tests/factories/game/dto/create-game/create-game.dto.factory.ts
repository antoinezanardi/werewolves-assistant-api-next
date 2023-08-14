import { plainToInstance } from "class-transformer";
import { defaultGameOptions } from "../../../../../src/modules/game/constants/game-options/game-options.constant";
import { CreateGameDto } from "../../../../../src/modules/game/dto/create-game/create-game.dto";
import { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import { ROLE_NAMES } from "../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { createFakeCreateGamePlayerDto } from "./create-game-player/create-game-player.dto.factory";

function createFakeCreateGameWithPlayersDto(createGameDto: Partial<CreateGameDto> = {}, override: object = {}): CreateGameDto {
  return createFakeCreateGameDto({
    players: [
      createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WITCH } }),
      createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.SEER } }),
      createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: ROLE_NAMES.WEREWOLF } }),
      createFakeCreateGamePlayerDto({ name: "Jérémy", role: { name: ROLE_NAMES.LITTLE_GIRL } }),
    ],
    ...createGameDto,
  }, override);
}

function createFakeCreateGameDto(createGameDto: Partial<CreateGameDto> = {}, override: object = {}): CreateGameDto {
  return plainToInstance(CreateGameDto, {
    turn: createGameDto.turn ?? 1,
    phase: createGameDto.phase ?? GAME_PHASES.NIGHT,
    players: createGameDto.players ?? [],
    upcomingPlays: createGameDto.upcomingPlays ?? [],
    currentPlay: createGameDto.currentPlay ?? null,
    options: createGameDto.options ?? defaultGameOptions,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export {
  createFakeCreateGameWithPlayersDto,
  createFakeCreateGameDto,
};