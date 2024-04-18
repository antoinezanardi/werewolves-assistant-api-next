import type { ValidationArguments } from "class-validator";

import { getAdditionalCardsPresenceDefaultMessage, isAdditionalCardsPresenceRespected } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-presence.decorator";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";

describe("Additional Cards Presence Decorator", () => {
  describe("isAdditionalCardsPresenceRespected", () => {
    it.each<{
      test: string;
      additionalCards: unknown;
      validationArguments: ValidationArguments;
      expected: boolean;
    }>([
      {
        test: "should return false when additional cards are set but there is no thief in game.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto(),
          createFakeCreateGameAdditionalCardDto(),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto(),
            createFakeCreateGameAdditionalCardDto(),
          ],
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "seer" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: false,
      },
      {
        test: "should return false when additional cards are not set but there is thief in game.",
        additionalCards: undefined,
        validationArguments: {
          value: undefined,
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: false,
      },
      {
        test: "should return false when additional cards are not an array.",
        additionalCards: "coucou",
        validationArguments: {
          value: "coucou",
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: false,
      },
      {
        test: "should return true when additional cards are set and a thief is in the game.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto(),
          createFakeCreateGameAdditionalCardDto(),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto(),
            createFakeCreateGameAdditionalCardDto(),
          ],
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: true,
      },
      {
        test: "should return true when additional cards are set and an actor is in the game.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto(),
          createFakeCreateGameAdditionalCardDto(),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto(),
            createFakeCreateGameAdditionalCardDto(),
          ],
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "actor" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: true,
      },
      {
        test: "should return true when additional cards are not set and there is no thief is in the game.",
        additionalCards: undefined,
        validationArguments: {
          value: undefined,
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "seer" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: true,
      },
    ])("$test", ({ additionalCards, validationArguments, expected }) => {
      expect(isAdditionalCardsPresenceRespected(additionalCards, validationArguments)).toBe(expected);
    });
  });

  describe("getAdditionalCardsPresenceDefaultMessage", () => {
    it("should return additional cards required presence message when they are not set.", () => {
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "thief" } }),
        ],
      });
      const validationArguments: ValidationArguments = {
        value: undefined,
        object: createGameDto,
        constraints: [],
        targetName: "",
        property: "additionalCards",
      };

      expect(getAdditionalCardsPresenceDefaultMessage(validationArguments)).toBe("additionalCards must be set if there is a player with one of the following roles : thief,actor");
    });

    it("should return additional cards forbidden presence message when they are set.", () => {
      const additionalCards = [
        createFakeCreateGameAdditionalCardDto(),
        createFakeCreateGameAdditionalCardDto(),
      ];
      const createGameDto = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "werewolf" } }),
          createFakeCreateGamePlayerDto({ name: "JB", role: { name: "villager" } }),
          createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "seer" } }),
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

      expect(getAdditionalCardsPresenceDefaultMessage(validationArguments)).toBe("additionalCards can't be set if there is no player with one of the following roles : thief,actor");
    });
  });
});