import { plainToInstance } from "class-transformer";

import { GetGameRandomCompositionDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeGetGameRandomCompositionDto(getGameRandomCompositionDto: Partial<GetGameRandomCompositionDto> = {}, override: object = {}): GetGameRandomCompositionDto {
  return plainToInstance(GetGameRandomCompositionDto, {
    players: getGameRandomCompositionDto.players ?? [],
    excludedRoles: getGameRandomCompositionDto.excludedRoles ?? [],
    areRecommendedMinPlayersRespected: getGameRandomCompositionDto.areRecommendedMinPlayersRespected ?? true,
    arePowerfulVillagerRolesPrioritized: getGameRandomCompositionDto.arePowerfulVillagerRolesPrioritized ?? true,
    arePowerfulWerewolfRolesPrioritized: getGameRandomCompositionDto.arePowerfulWerewolfRolesPrioritized ?? false,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGetGameRandomCompositionDto };