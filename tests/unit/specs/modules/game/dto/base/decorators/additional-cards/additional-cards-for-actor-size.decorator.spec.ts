import { getAdditionalCardsForActorSizeDefaultMessage, isAdditionalCardsForActorSizeRespected } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-actor-size.decorator";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import type { ValidationArguments } from "class-validator";

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
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return true when cards are defined but there is no actor in players.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
          ],
        }),
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return false when cards are not an array.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: null,
        expected: false,
      },
      {
        test: "should return false when some card is not an object.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          null,
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
        ],
        expected: false,
      },
      {
        test: "should return false when some card is not an object with expected structure.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          { bad: "structure" },
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
        ],
        expected: false,
      },
      {
        test: "should return false when cards length is 0.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
        ],
        expected: false,
      },
      {
        test: "should return false when cards length exceed the max.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
        ],
        expected: false,
      },
      {
        test: "should return true when cards size respects the options.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
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
      expect(getAdditionalCardsForActorSizeDefaultMessage()).toBe("additionalCards length for actor must be between 1 and 5");
    });
  });
});