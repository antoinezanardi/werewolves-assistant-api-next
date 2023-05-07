import { plainToInstance } from "class-transformer";
import { GetGameRandomCompositionDto } from "../../../../../src/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";

function createFakeGetGameRandomCompositionDto(getGameRandomCompositionDto: Partial<GetGameRandomCompositionDto> = {}, override: object = {}): GetGameRandomCompositionDto {
  return plainToInstance(GetGameRandomCompositionDto, {
    players: getGameRandomCompositionDto.players ?? [],
    excludedRoles: getGameRandomCompositionDto.excludedRoles ?? [],
    areRecommendedMinPlayersRespected: getGameRandomCompositionDto.areRecommendedMinPlayersRespected ?? true,
    arePowerfulVillagerRolesPrioritized: getGameRandomCompositionDto.arePowerfulVillagerRolesPrioritized ?? true,
    arePowerfulWerewolfRolesPrioritized: getGameRandomCompositionDto.arePowerfulWerewolfRolesPrioritized ?? false,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeGetGameRandomCompositionDto };