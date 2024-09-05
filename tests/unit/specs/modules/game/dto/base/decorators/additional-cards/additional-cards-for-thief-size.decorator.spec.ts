import { getAdditionalCardsForThiefSizeDefaultMessage, isAdditionalCardsForThiefSizeRespected } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-size.decorator";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import type { ValidationArguments } from "class-validator";

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
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
        }),
        additionalCards: undefined,
        expected: true,
      },
      {
        test: "should return true when cards are defined but there is not thief among players.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        additionalCards: [
          null,
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
        ],
        expected: true,
      },
      {
        test: "should return false when cards are not an array.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
        }),
        additionalCards: null,
        expected: false,
      },
      {
        test: "should return false when every cards is not an object with expected structure.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
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
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          { bad: "structure" },
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
        ],
        expected: false,
      },
      {
        test: "should return false when cards size empty.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
        }),
        additionalCards: [createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" })],
        expected: false,
      },
      {
        test: "should return false when cards size is too much.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "actor" }),
        ],
        expected: false,
      },
      {
        test: "should return true when cards size is between 1 and 5.",
        createGameDto: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
        }),
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "villager", recipient: "thief" }),
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

      expect(isAdditionalCardsForThiefSizeRespected(additionalCards, validationArguments)).toBe(expected);
    });
  });

  describe("getAdditionalCardsForThiefSizeDefaultMessage", () => {
    it("should default decorator message when called.", () => {
      expect(getAdditionalCardsForThiefSizeDefaultMessage()).toBe("additionalCards length for thief must be between 1 and 5");
    });
  });
});