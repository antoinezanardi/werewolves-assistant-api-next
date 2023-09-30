import { plainToInstance } from "class-transformer";

import { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";

import { ApiSortOrder } from "@/shared/api/enums/api.enum";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeGetGameHistoryDto(getGameRandomCompositionDto: Partial<GetGameHistoryDto> = {}, override: object = {}): GetGameHistoryDto {
  return plainToInstance(GetGameHistoryDto, {
    limit: getGameRandomCompositionDto.limit ?? 0,
    order: getGameRandomCompositionDto.order ?? ApiSortOrder.ASC,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeGetGameHistoryDto };