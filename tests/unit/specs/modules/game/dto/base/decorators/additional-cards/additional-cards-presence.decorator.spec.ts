import type { ValidationArguments } from "class-validator";
import { getAdditionalCardsPresenceDefaultMessage, isAdditionalCardsPresenceRespected } from "../../../../../../../../../src/modules/game/dto/base/decorators/additional-cards/additional-cards-presence.decorator";
import { ROLE_NAMES } from "../../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeCreateGameAdditionalCardDto } from "../../../../../../../../factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateGamePlayerDto } from "../../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "../../../../../../../../factories/game/dto/create-game/create-game.dto.factory";

describe("Additional Cards Presence Decorator", () => {
  describe("isAdditionalCardsPresenceRespected", () => {
    it("should return false when additional cards are set but there is no thief in game.", () => {
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto(),
        createFakeCreateGameAdditionalCardDto(),
      ];
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.VILLAGER } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: ROLE_NAMES.SEER } }),
        ],
        additionalCards,
      });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsPresenceRespected(additionalCards, validationArguments)).toBe(false);
    });

    it("should return false when additional cards are not set but there is thief in game.", () => {
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.VILLAGER } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: ROLE_NAMES.THIEF } }),
        ],
      });
      const validationArguments: ValidationArguments = {
        value: undefined,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsPresenceRespected(undefined, validationArguments)).toBe(false);
    });

    it("should return false when additional cards are not an array.", () => {
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.VILLAGER } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: ROLE_NAMES.THIEF } }),
        ],
      });
      const validationArguments: ValidationArguments = {
        value: "coucou",
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsPresenceRespected("coucou", validationArguments)).toBe(false);
    });

    it("should return true when additional cards are set and a thief is in the game.", () => {
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto(),
        createFakeCreateGameAdditionalCardDto(),
      ];
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.VILLAGER } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: ROLE_NAMES.THIEF } }),
        ],
      });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsPresenceRespected(additionalCards, validationArguments)).toBe(true);
    });

    it("should return true when additional cards are not set and there is no thief is in the game.", () => {
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.VILLAGER } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: ROLE_NAMES.SEER } }),
        ],
      });
      const validationArguments: ValidationArguments = {
        value: undefined,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsPresenceRespected(undefined, validationArguments)).toBe(true);
    });
  });

  describe("getAdditionalCardsPresenceDefaultMessage", () => {
    it("should return additional cards required presence message when they are not set.", () => {
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.VILLAGER } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: ROLE_NAMES.THIEF } }),
        ],
      });
      const validationArguments: ValidationArguments = {
        value: undefined,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(getAdditionalCardsPresenceDefaultMessage(validationArguments)).toBe("additionalCards must be set if there is a player with role `thief`");
    });

    it("should return additional cards forbidden presence message when they are set.", () => {
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto(),
        createFakeCreateGameAdditionalCardDto(),
      ];
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: ROLE_NAMES.WEREWOLF } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: ROLE_NAMES.VILLAGER } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: ROLE_NAMES.SEER } }),
        ],
        additionalCards,
      });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(getAdditionalCardsPresenceDefaultMessage(validationArguments)).toBe("additionalCards can't be set if there is no player with role `thief`");
    });
  });
});