import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";

function createFakeGameAdditionalCard(gameAdditionalCard: Partial<GameAdditionalCard> = {}, override: object = {}): GameAdditionalCard {
  return plainToInstance(GameAdditionalCard, {
    _id: gameAdditionalCard._id ?? createFakeObjectId(),
    roleName: gameAdditionalCard.roleName ?? faker.helpers.arrayElement(Object.values(RoleNames)),
    isUsed: gameAdditionalCard.isUsed ?? faker.datatype.boolean(),
    recipient: gameAdditionalCard.recipient ?? faker.helpers.arrayElement(Object.values([RoleNames.THIEF])),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function bulkCreateFakeGameAdditionalCards(length: number, gameAdditionalCards: Partial<GameAdditionalCard>[] = [], overrides: object[] = []): GameAdditionalCard[] {
  return bulkCreate(length, createFakeGameAdditionalCard, gameAdditionalCards, overrides);
}

export { bulkCreateFakeGameAdditionalCards, createFakeGameAdditionalCard };