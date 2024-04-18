import { When } from "@cucumber/cucumber";

import type { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";

import { ApiSortOrder } from "@/shared/api/enums/api.enums";

import { getGameHistory } from "@tests/acceptance/features/game/helpers/game-request.helpers";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

When(/^the most recent history record is retrieved$/u, async function(this: CustomWorld): Promise<void> {
  const getGameHistoryDto: GetGameHistoryDto = { limit: 1, order: ApiSortOrder.DESC };
  this.response = await getGameHistory(getGameHistoryDto, this.game, this.app);
  this.lastGameHistoryRecord = this.response.json<GameHistoryRecord[]>()[0];
});