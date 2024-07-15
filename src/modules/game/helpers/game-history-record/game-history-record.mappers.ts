import type { QueryOptions } from "mongoose";

import type { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";

import { getMongooseSortValueFromApiSortOrder } from "@/shared/mongoose/helpers/mongoose.helpers";

function convertGetGameHistoryDtoToMongooseQueryOptions(getGameHistoryDto: GetGameHistoryDto): QueryOptions {
  return {
    limit: getGameHistoryDto.limit,
    sort: { createdAt: getMongooseSortValueFromApiSortOrder(getGameHistoryDto.order) },
  };
}

export { convertGetGameHistoryDtoToMongooseQueryOptions };