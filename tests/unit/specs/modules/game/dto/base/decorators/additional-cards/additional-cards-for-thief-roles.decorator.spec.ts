import { gameAdditionalCardsThiefRoleNames } from "@/modules/game/constants/game-additional-card/game-additional-card.constant";
import { areAdditionalCardsForThiefRolesRespected, getAdditionalCardsForThiefRolesDefaultMessage } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-roles.decorator";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";

describe("Additional Cards For Thief Roles Decorator", () => {
  describe("areAdditionalCardsForThiefRolesRespected", () => {
    it("should return true when additional cards are not defined.", () => {
      const additionalCards = undefined;

      expect(areAdditionalCardsForThiefRolesRespected(additionalCards)).toBe(true);
    });

    it("should return false when at least one additional card role is not for thief.", () => {
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF }),
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.THIEF }),
      ];

      expect(areAdditionalCardsForThiefRolesRespected(additionalCards)).toBe(false);
    });

    it("should return true when all additional cards roles are for thief.", () => {
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF }),
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.LITTLE_GIRL }),
      ];

      expect(areAdditionalCardsForThiefRolesRespected(additionalCards)).toBe(true);
    });
  });

  describe("getAdditionalCardsForThiefRolesDefaultMessage", () => {
    it("should return additional cards for thief roles default message when called.", () => {
      expect(getAdditionalCardsForThiefRolesDefaultMessage()).toBe(`additionalCards.roleName must be one of the following values: ${gameAdditionalCardsThiefRoleNames.toString()}`);
    });
  });
});