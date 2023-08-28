import { plainToInstance } from "class-transformer";

import { GetGameRandomCompositionDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeGetGameRandomCompositionDto(getGameRandomCompositionDto: Partial<GetGameRandomCompositionDto> = {}, override: object = {}): GetGameRandomCompositionDto {
  return plainToInstance(GetGameRandomCompositionDto, {
    players: getGameRandomCompositionDto.players ?? [],
    excludedRoles: getGameRandomCompositionDto.excludedRoles ?? [],
    areRecommendedMinPlayersRespected: getGameRandomCompositionDto.areRecommendedMinPlayersRespected ?? true,
    arePowerfulVillagerRolesPrioritized: getGameRandomCompositionDto.arePowerfulVillagerRolesPrioritized ?? true,
    arePowerfulWerewolfRolesPrioritized: getGameRandomCompositionDto.arePowerfulWerewolfRolesPrioritized ?? false,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeGetGameRandomCompositionDto };