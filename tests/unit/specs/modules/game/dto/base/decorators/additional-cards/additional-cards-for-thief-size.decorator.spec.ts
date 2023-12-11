import type { ValidationArguments } from "class-validator";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import { getAdditionalCardsForThiefSizeDefaultMessage, isAdditionalCardsForThiefSizeRespected } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-size.decorator";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateThiefGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";

describe("Additional Cards For Thief Size Decorator", () => {
  describe("isAdditionalCardsForThiefSizeRespected", () => {
    it.each<{
      test: string;
      createGameDto: CreateGameDto;
      additionalCards: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when cards are not defined.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THIEF } }),
          ],
        }),
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return true when cards are defined but there is not thief among players.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        additionalCards: [
          null,
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
        ],
        expected: true,
      },
      {
        test: "should return false when cards are not an array.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THIEF } }),
          ],
        }),
        additionalCards: null,
        expected: false,
      },
      {
        test: "should return false when every cards is not an object with expected structure.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THIEF } }),
          ],
        }),
        additionalCards: [
          { bad: "structure" },
          { bad: "structure" },
        ],
        expected: false,
      },
      {
        test: "should return false when some card is not an object with expected structure.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THIEF } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
          { bad: "structure" },
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
        ],
        expected: false,
      },
      {
        test: "should return false when cards size doesn't respect the options.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THIEF } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
        ],
        expected: false,
      },
      {
        test: "should return true when cards size doesn't respect the options.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THIEF } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
        ],
        expected: true,
      },
    ])("$test", ({ additionalCards, createGameDto, expected }) => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 2 }) }) });
      const object = createFakeCreateGameDto({
        ...createGameDto,
        additionalCards: additionalCards as CreateGameAdditionalCardDto[],
        options,
      });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object,
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