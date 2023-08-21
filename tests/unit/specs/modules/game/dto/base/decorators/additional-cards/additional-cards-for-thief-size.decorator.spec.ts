import type { ValidationArguments } from "class-validator";
import { getAdditionalCardsForThiefSizeDefaultMessage, isAdditionalCardsForThiefSizeRespected } from "../../../../../../../../../src/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-size.decorator";
import { ROLE_NAMES } from "../../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeCreateGameAdditionalCardDto } from "../../../../../../../../factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateThiefGameOptionsDto } from "../../../../../../../../factories/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto.factory";
import { createFakeCreateGameDto } from "../../../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGameOptions } from "../../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions } from "../../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";

describe("Additional Cards For Thief Size Decorator", () => {
  describe("isAdditionalCardsForThiefSizeRespected", () => {
    it("should return true when cards are not defined.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 2 }) }) });
      const createGameDto = createFakeCreateGameDto({ options });
      const validationArguments: ValidationArguments = {
        value: undefined,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsForThiefSizeRespected(undefined, validationArguments)).toBe(true);
    });

    it("should return false when cards are not an array.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 2 }) }) });
      const createGameDto = createFakeCreateGameDto({ options });
      const validationArguments: ValidationArguments = {
        value: null,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsForThiefSizeRespected(null, validationArguments)).toBe(false);
    });
    
    it("should return false when cards size doesn't respect the options.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 2 }) }) });
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.VILLAGER, recipient: ROLE_NAMES.THIEF }),
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.VILLAGER, recipient: ROLE_NAMES.THIEF }),
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.VILLAGER, recipient: ROLE_NAMES.THIEF }),
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.VILLAGER, recipient: ROLE_NAMES.THIEF }),
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.VILLAGER, recipient: ROLE_NAMES.THIEF }),
      ];
      const createGameDto = createFakeCreateGameDto({ options, additionalCards });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsForThiefSizeRespected(additionalCards, validationArguments)).toBe(false);
    });

    it("should return true when cards size doesn't respect the options.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 2 }) }) });
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.VILLAGER, recipient: ROLE_NAMES.THIEF }),
        createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.VILLAGER, recipient: ROLE_NAMES.THIEF }),
      ];
      const createGameDto = createFakeCreateGameDto({ options, additionalCards });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsForThiefSizeRespected(additionalCards, validationArguments)).toBe(true);
    });
  });

  describe("getAdditionalCardsForThiefSizeDefaultMessage", () => {
    it("should default decorator message when called.", () => {
      expect(getAdditionalCardsForThiefSizeDefaultMessage()).toBe("additionalCards length must be equal to options.roles.thief.additionalCardsCount");
    });
  });
});