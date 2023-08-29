import type { ValidationArguments } from "class-validator";

import { areAdditionalCardsRolesMaxInGameRespected, getAdditionalCardsRolesMaxInGameDefaultMessage } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-roles-max-in-game.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";

describe("Additional Cards Roles Max in Game Decorator", () => {
  describe("areAdditionalCardsRolesMaxInGameRespected", () => {
    it("should return true when additional cards are not defined.", () => {
      const additionalCards = undefined;
      const players = [
        createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ name: "JB", role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: RoleNames.VILLAGER } }),
        createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: RoleNames.THIEF } }),
      ];
      const game = createFakeCreateGameDto({ additionalCards, players });
      const validationArguments: ValidationArguments = {
        object: game,
        property: "additionalCards",
        targetName: "CreateGameDto",
        constraints: [],
        value: additionalCards,
      };

      expect(areAdditionalCardsRolesMaxInGameRespected(additionalCards, validationArguments)).toBe(true);
    });

    it("should return false when players cards are not defined.", () => {
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WEREWOLF }),
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER_VILLAGER }),
      ];
      const game = createFakeCreateGameDto({ additionalCards }, { players: undefined });
      const validationArguments: ValidationArguments = {
        object: game,
        property: "additionalCards",
        targetName: "CreateGameDto",
        constraints: [],
        value: additionalCards,
      };

      expect(areAdditionalCardsRolesMaxInGameRespected(additionalCards, validationArguments)).toBe(false);
    });

    it("should return false when at least one role max in game is not respected due to additional cards only.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ name: "JB", role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: RoleNames.VILLAGER } }),
        createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: RoleNames.THIEF } }),
      ];
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WITCH }),
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WITCH }),
      ];
      const game = createFakeCreateGameDto({ additionalCards, players });
      const validationArguments: ValidationArguments = {
        object: game,
        property: "additionalCards",
        targetName: "CreateGameDto",
        constraints: [],
        value: additionalCards,
      };

      expect(areAdditionalCardsRolesMaxInGameRespected(additionalCards, validationArguments)).toBe(false);
    });

    it("should return false when at least one role max in game is not respected due to additional cards and player roles together.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ name: "JB", role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: RoleNames.THIEF } }),
      ];
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WEREWOLF }),
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WITCH }),
      ];
      const game = createFakeCreateGameDto({ additionalCards, players });
      const validationArguments: ValidationArguments = {
        object: game,
        property: "additionalCards",
        targetName: "CreateGameDto",
        constraints: [],
        value: additionalCards,
      };

      expect(areAdditionalCardsRolesMaxInGameRespected(additionalCards, validationArguments)).toBe(false);
    });

    it("should return true when at every role max in game are respected among additional cards and player roles together.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ name: "JB", role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: RoleNames.THIEF } }),
      ];
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.WEREWOLF }),
        createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.HUNTER }),
      ];
      const game = createFakeCreateGameDto({ additionalCards, players });
      const validationArguments: ValidationArguments = {
        object: game,
        property: "additionalCards",
        targetName: "CreateGameDto",
        constraints: [],
        value: additionalCards,
      };

      expect(areAdditionalCardsRolesMaxInGameRespected(additionalCards, validationArguments)).toBe(true);
    });
  });

  describe("getAdditionalCardsRolesMaxInGameDefaultMessage", () => {
    it("should return additional cards roles max in game default message when called.", () => {
      expect(getAdditionalCardsRolesMaxInGameDefaultMessage()).toBe("additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles");
    });
  });
});