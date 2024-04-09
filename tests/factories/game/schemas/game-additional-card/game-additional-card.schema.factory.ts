import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { GAME_ADDITIONAL_CARDS_RECIPIENTS } from "@/modules/game/constants/game-additional-card/game-additional-card.constants";
import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

function createFakeGameAdditionalCard(gameAdditionalCard: Partial<GameAdditionalCard> = {}, override: object = {}): GameAdditionalCard {
  return plainToInstance(GameAdditionalCard, {
    _id: gameAdditionalCard._id ?? createFakeObjectId(),
    roleName: gameAdditionalCard.roleName ?? faker.helpers.arrayElement(ROLE_NAMES),
    isUsed: gameAdditionalCard.isUsed ?? faker.datatype.boolean(),
    recipient: gameAdditionalCard.recipient ?? faker.helpers.arrayElement(GAME_ADDITIONAL_CARDS_RECIPIENTS),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGameAdditionalCard };