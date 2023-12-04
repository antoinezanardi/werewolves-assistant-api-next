import type { ValidationArguments } from "class-validator";

import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import { getAdditionalCardsForThiefSizeDefaultMessage, isAdditionalCardsForThiefSizeRespected } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-size.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateThiefGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";

describe("Additional Cards For Thief Size Decorator", () => {
  describe("isAdditionalCardsForThiefSizeRespected", () => {
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
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
          { bad: "structure" },
        ],
        expected: false,
      },
      {
        test: "should return false when cards size doesn't respect the options.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
        ],
        expected: false,
      },
      {
        test: "should return true when cards size doesn't respect the options.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
        ],
        expected: true,
      },
    ])("$test", ({ additionalCards, expected }) => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 2 }) }) });
      const createGameDto = createFakeCreateGameDto({ options, additionalCards: additionalCards as CreateGameAdditionalCardDto[] });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsForThiefSizeRespected(additionalCards, validationArguments)).toBe(expected);
    });
  });

  describe("getAdditionalCardsForThiefSizeDefaultMessage", () => {
    it("should default decorator message when called.", () => {
      expect(getAdditionalCardsForThiefSizeDefaultMessage()).toBe("additionalCards length for thief must be equal to options.roles.thief.additionalCardsCount");
    });
  });
});