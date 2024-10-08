import { areAdditionalCardsForThiefRolesRespected, getAdditionalCardsForThiefRolesDefaultMessage } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-roles.decorator";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import { ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES } from "@/modules/role/constants/role-set.constants";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";

describe("Additional Cards For Thief Roles Decorator", () => {
  describe("areAdditionalCardsForThiefRolesRespected", () => {
    it.each<{
      test: string;
      additionalCards: CreateGameAdditionalCardDto[] | undefined;
      expected: boolean;
    }>([
      {
        test: "should return true when additional cards are not defined.",
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return true when there is no additional cards for thief.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "thief", recipient: "actor" }),
        ],
        expected: true,
      },
      {
        test: "should return false when at least one additional card role is not for thief.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "thief", recipient: "thief" }),
        ],
        expected: false,
      },
      {
        test: "should return true when all additional cards roles are for thief.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "little-girl", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "thief", recipient: "actor" }),
        ],
        expected: true,
      },
    ])("$test", ({ additionalCards, expected }) => {
      expect(areAdditionalCardsForThiefRolesRespected(additionalCards)).toBe(expected);
    });
  });

  describe("getAdditionalCardsForThiefRolesDefaultMessage", () => {
    it("should return additional cards for thief roles default message when called.", () => {
      expect(getAdditionalCardsForThiefRolesDefaultMessage()).toBe(`additionalCards.roleName for thief must be one of the following values: ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`);
    });
  });
});