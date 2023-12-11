import { plainToInstance } from "class-transformer";

import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGameAdditionalCard(card: GameAdditionalCard): GameAdditionalCard {
  return plainToInstance(GameAdditionalCard, toJSON(card), { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

export { createGameAdditionalCard };