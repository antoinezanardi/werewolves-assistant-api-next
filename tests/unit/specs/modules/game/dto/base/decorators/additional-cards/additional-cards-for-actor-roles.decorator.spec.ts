import { areAdditionalCardsForActorRolesRespected, getAdditionalCardsForActorRolesDefaultMessage } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-actor-roles.decorator";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import { ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES } from "@/modules/role/constants/role.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";

describe("Additional Cards For Actor Roles Decorator", () => {
  describe("areAdditionalCardsForActorRolesRespected", () => {
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
        test: "should return true when there is no additional cards for actor.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.THIEF }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.THIEF, recipient: RoleNames.THIEF }),
        ],
        expected: true,
      },
      {
        test: "should return false when at least one additional card role is not for actor.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.SEER, recipient: RoleNames.ACTOR }),
        ],
        expected: false,
      },
      {
        test: "should return true when all additional cards roles are for actor.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.SEER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.LITTLE_GIRL, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.THIEF, recipient: RoleNames.THIEF }),
        ],
        expected: true,
      },
    ])("$test", ({ additionalCards, expected }) => {
      expect(areAdditionalCardsForActorRolesRespected(additionalCards)).toBe(expected);
    });
  });

  describe("getAdditionalCardsForActorRolesDefaultMessage", () => {
    it("should return additional cards for actor roles default message when called.", () => {
      expect(getAdditionalCardsForActorRolesDefaultMessage()).toBe(`additionalCards.roleName for actor must be one of the following values: ${ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`);
    });
  });
});