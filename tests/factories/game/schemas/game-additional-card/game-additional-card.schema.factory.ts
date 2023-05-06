import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { GameAdditionalCard } from "../../../../../src/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { ROLE_NAMES } from "../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { createObjectIdFromString } from "../../../../helpers/mongoose/mongoose.helper";
import { bulkCreate } from "../../../shared/bulk-create.factory";

function createFakeGameAdditionalCard(gameAdditionalCard: Partial<GameAdditionalCard> = {}, override: object = {}): GameAdditionalCard {
  return plainToInstance(GameAdditionalCard, {
    _id: gameAdditionalCard._id ?? createObjectIdFromString(faker.database.mongodbObjectId()),
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