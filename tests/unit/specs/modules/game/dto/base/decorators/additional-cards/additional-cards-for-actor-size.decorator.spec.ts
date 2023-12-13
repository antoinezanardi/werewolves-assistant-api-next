import type { ValidationArguments } from "class-validator";

import { getAdditionalCardsForActorSizeDefaultMessage, isAdditionalCardsForActorSizeRespected } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-actor-size.decorator";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { createFakeCreateActorGameOptionsDto, createFakeRolesGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto.factory";
import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";

describe("Additional Cards For Actor Size Decorator", () => {
  describe("isAdditionalCardsForActorSizeRespected", () => {
    it.each<{
      test: string;
      additionalCards: unknown;
      createGameDto: CreateGameDto;
      expected: boolean;
    }>([
      {
        test: "should return true when cards are not defined.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return true when cards are defined but there is no actor in players.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
          ],
        }),
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return false when cards are not an array.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        additionalCards: null,
        expected: false,
      },
      {
        test: "should return false when some card is not an object.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          null,
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
        ],
        expected: false,
      },
      {
        test: "should return false when some card is not an object with expected structure.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          { bad: "structure" },
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
        ],
        expected: false,
      },
      {
        test: "should return false when cards size doesn't respect the default options.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.THIEF }),
        ],
        expected: false,
      },
      {
        test: "should return false when cards size doesn't respect the changed options set to 5.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
          options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptionsDto({ actor: createFakeCreateActorGameOptionsDto({ additionalCardsCount: 5 }) }) }),
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
        ],
        expected: false,
      },
      {
        test: "should return true when cards size respects the options.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
          createFakeCreateGameAdditionalCardDto({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR }),
        ],
        expected: true,
      },
    ])("$test", ({ additionalCards, createGameDto, expected }) => {
      const object = createFakeCreateGameDto({
        ...createGameDto,
        additionalCards: additionalCards as CreateGameAdditionalCardDto[],
      });
      const validationArguments: ValidationArguments = {
        value: additionalCards,
        object,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(isAdditionalCardsForActorSizeRespected(additionalCards, validationArguments)).toBe(expected);
    });
  });

  describe("getAdditionalCardsForActorSizeDefaultMessage", () => {
    it("should default decorator message when called.", () => {
      expect(getAdditionalCardsForActorSizeDefaultMessage()).toBe("additionalCards length for actor must be equal to options.roles.actor.additionalCardsCount");
    });
  });
});