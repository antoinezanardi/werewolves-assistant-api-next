import { plainToInstance } from "class-transformer";

import { CreateGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-game-options.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeCompositionGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-composition-game-options/create-composition-game-options.dto.factory";
import { createFakeRolesGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto.factory";
import { createFakeVotesGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-votes-game-options/create-votes-game-options.dto.factory";

function createFakeGameOptionsDto(createGameOptionsDto: Partial<CreateGameOptionsDto> = {}, override: object = {}): CreateGameOptionsDto {
  return plainToInstance(CreateGameOptionsDto, {
    composition: createFakeCompositionGameOptionsDto(createGameOptionsDto.composition),
    votes: createFakeVotesGameOptionsDto(createGameOptionsDto.votes),
    roles: createFakeRolesGameOptionsDto(createGameOptionsDto.roles),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGameOptionsDto };