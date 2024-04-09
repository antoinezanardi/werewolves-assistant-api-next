import { plainToInstance } from "class-transformer";

import { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";

import { ApiSortOrder } from "@/shared/api/enums/api.enums";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeGetGameHistoryDto(getGameRandomCompositionDto: Partial<GetGameHistoryDto> = {}, override: object = {}): GetGameHistoryDto {
  return plainToInstance(GetGameHistoryDto, {
    limit: getGameRandomCompositionDto.limit ?? 0,
    order: getGameRandomCompositionDto.order ?? ApiSortOrder.ASC,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGetGameHistoryDto };