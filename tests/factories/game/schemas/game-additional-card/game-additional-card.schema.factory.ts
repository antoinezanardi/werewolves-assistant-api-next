import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { GameAdditionalCard } from "../../../../../src/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { ROLE_NAMES } from "../../../../../src/modules/role/enums/role.enum";

function createFakeGameAdditionalCard(obj: Partial<GameAdditionalCard> = {}): GameAdditionalCard {
  return plainToInstance(GameAdditionalCard, {
    _id: obj._id ?? faker.database.mongodbObjectId(),
    roleName: obj.roleName ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    isUsed: obj.isUsed ?? faker.datatype.boolean(),
    recipient: obj.recipient ?? faker.helpers.arrayElement([ROLE_NAMES.THIEF]),
  });
}

function bulkCreateFakeGameAdditionalCards(length: number): GameAdditionalCard[] {
  return Array.from(Array(length)).map(() => createFakeGameAdditionalCard());
}

export { bulkCreateFakeGameAdditionalCards, createFakeGameAdditionalCard };