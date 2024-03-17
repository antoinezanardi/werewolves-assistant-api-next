import type { QueryOptions } from "mongoose";

import { convertGetGameHistoryDtoToMongooseQueryOptions } from "@/modules/game/helpers/game-history/game-history-record.mappers";

import { ApiSortOrder } from "@/shared/api/enums/api.enum";

import { createFakeGetGameHistoryDto } from "@tests/factories/game/dto/get-game-history/get-game-history.dto.factory";

describe("Game History Record Mapper", () => {
  describe("convertGetGameHistoryDtoToMongooseQueryOptions", () => {
    it("should convert GetGameHistoryDto to MongooseQueryOptions when called.", () => {
      const getGameHistoryDto = createFakeGetGameHistoryDto({ limit: 10, order: ApiSortOrder.DESC });

      expect(convertGetGameHistoryDtoToMongooseQueryOptions(getGameHistoryDto)).toStrictEqual<QueryOptions>({
        limit: 10,
        sort: { createdAt: -1 },
      });
    });
  });
});