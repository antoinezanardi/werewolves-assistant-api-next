import { getAdditionalCardsForActorSizeDefaultMessage, isAdditionalCardsForActorSizeRespected } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-actor-size.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";

describe("Additional Cards For Actor Size Decorator", () => {
  describe("isAdditionalCardsForActorSizeRespected", () => {
    it.each<{
      test: string;
      additionalCards: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when cards are not defined.",
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return false when cards are not an array.",
        additionalCards: null,
        expected: false,
      },
      {
        test: "should return false when some card is not an object with expected structure.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          { bad: "structure" },
        ],
        expected: false,
      },
      {
        test: "should return false when cards size doesn't respect the options.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
        ],
        expected: false,
      },
      {
        test: "should return true when cards size doesn't respect the options.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
        ],
        expected: true,
      },
    ])("$test", ({ additionalCards, expected }) => {
      expect(isAdditionalCardsForActorSizeRespected(additionalCards)).toBe(expected);
    });
  });

  describe("getAdditionalCardsForActorSizeDefaultMessage", () => {
    it("should default decorator message when called.", () => {
      expect(getAdditionalCardsForActorSizeDefaultMessage()).toBe("additionalCards length for actor must be equal to 3");
    });
  });
});