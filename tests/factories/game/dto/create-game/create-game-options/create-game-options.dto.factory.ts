import { plainToInstance } from "class-transformer";
import { CreateGameOptionsDto } from "../../../../../../src/modules/game/dto/create-game/create-game-options/create-game-options.dto";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";
import { createFakeCompositionGameOptionsDto } from "./create-composition-game-options/create-composition-game-options.dto.factory";
import { createFakeRolesGameOptionsDto } from "./create-roles-game-options/create-roles-game-options.dto.factory";
import { createFakeVotesGameOptionsDto } from "./create-votes-game-options/create-votes-game-options.dto.factory";

function createFakeGameOptionsDto(createGameOptionsDto: Partial<CreateGameOptionsDto> = {}, override: object = {}): CreateGameOptionsDto {
  return plainToInstance(CreateGameOptionsDto, {
    composition: createFakeCompositionGameOptionsDto(createGameOptionsDto.composition),
    votes: createFakeVotesGameOptionsDto(createGameOptionsDto.votes),
    roles: createFakeRolesGameOptionsDto(createGameOptionsDto.roles),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeGameOptionsDto };