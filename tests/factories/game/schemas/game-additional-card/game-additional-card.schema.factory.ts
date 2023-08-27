import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";

function createFakeGameAdditionalCard(gameAdditionalCard: Partial<GameAdditionalCard> = {}, override: object = {}): GameAdditionalCard {
  return plainToInstance(GameAdditionalCard, {
    _id: gameAdditionalCard._id ?? createFakeObjectId(),
    roleName: gameAdditionalCard.roleName ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    isUsed: gameAdditionalCard.isUsed ?? faker.datatype.boolean(),
    recipient: gameAdditionalCard.recipient ?? faker.helpers.arrayElement(Object.values([ROLE_NAMES.THIEF])),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeGameAdditionalCards(length: number, gameAdditionalCards: Partial<GameAdditionalCard>[] = [], overrides: object[] = []): GameAdditionalCard[] {
  return bulkCreate(length, createFakeGameAdditionalCard, gameAdditionalCards, overrides);
}

export { bulkCreateFakeGameAdditionalCards, createFakeGameAdditionalCard };