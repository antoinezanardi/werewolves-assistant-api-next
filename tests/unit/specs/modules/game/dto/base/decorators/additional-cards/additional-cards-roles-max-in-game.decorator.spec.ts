import type { ValidationArguments } from "class-validator";

import { areAdditionalCardsRolesMaxInGameRespected, getAdditionalCardsRolesMaxInGameDefaultMessage } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-roles-max-in-game.decorator";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";

import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";

describe("Additional Cards Roles Max in Game Decorator", () => {
  describe("areAdditionalCardsRolesMaxInGameRespected", () => {
    it.each<{
      test: string;
      additionalCards: CreateGameAdditionalCardDto[] | undefined;
      validationArguments: ValidationArguments;
      expected: boolean;
    }>([
      {
        test: "should return true when additional cards are not defined.",
        additionalCards: undefined,
        validationArguments: {
          value: undefined,
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "seer" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: true,
      },
      {
        test: "should return false when game player cards are not defined.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
          ],
          object: createFakeCreateGameDto({}, { players: undefined }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: false,
      },
      {
        test: "should return false when one of the roles is not found in game additional cards.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "hunter" }, { roleName: "unknown" }),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "hunter" }),
          ],
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "seer" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "witch" } }),
              createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: false,
      },
      {
        test: "should return false when at least one role max in game is not respected due to additional cards only.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "witch" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "witch" }),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto({ roleName: "witch" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "witch" }),
          ],
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "seer" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "villager" } }),
              createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: false,
      },
      {
        test: "should return false when at least one role max in game is not respected due to additional cards and player roles together.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "witch" }),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "witch" }),
          ],
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "seer" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "witch" } }),
              createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: false,
      },
      {
        test: "should return true when every role max in game are respected among additional cards and player roles together.",
        additionalCards: [
          createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
          createFakeCreateGameAdditionalCardDto({ roleName: "hunter" }),
        ],
        validationArguments: {
          value: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "hunter" }),
          ],
          object: createFakeCreateGameDto({
            players: [
              createFakeCreateGamePlayerDto({ name: "Antoine", role: { name: "seer" } }),
              createFakeCreateGamePlayerDto({ name: "JB", role: { name: "werewolf" } }),
              createFakeCreateGamePlayerDto({ name: "Olivia", role: { name: "witch" } }),
              createFakeCreateGamePlayerDto({ name: "Thomas", role: { name: "thief" } }),
            ],
          }),
          constraints: [],
          targetName: "",
          property: "additionalCards",
        },
        expected: true,
      },
    ])("$test", ({ additionalCards, validationArguments, expected }) => {
      expect(areAdditionalCardsRolesMaxInGameRespected(additionalCards, validationArguments)).toBe(expected);
    });
  });

  describe("getAdditionalCardsRolesMaxInGameDefaultMessage", () => {
    it("should return additional cards roles max in game default message when called.", () => {
      expect(getAdditionalCardsRolesMaxInGameDefaultMessage()).toBe("additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles");
    });
  });
});