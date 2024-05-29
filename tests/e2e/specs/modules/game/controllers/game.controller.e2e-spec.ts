import { faker } from "@faker-js/faker";
import type { BadRequestException, NotFoundException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import type { Model, Types } from "mongoose";
import { stringify } from "qs";

import type { GamePhase } from "@/modules/game/schemas/game-phase/game-phase.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { GetGameRandomCompositionDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import type { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES, ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES } from "@/modules/role/constants/role-set.constants";

import { ApiSortOrder } from "@/shared/api/enums/api.enums";
import { toJSON } from "@/shared/misc/helpers/object.helpers";

import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { truncateAllCollections } from "@tests/e2e/helpers/mongoose.helpers";
import { initNestApp } from "@tests/e2e/helpers/nest-app.helpers";
import { createFakeCreateGameAdditionalCardDto } from "@tests/factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { createFakeCreateActorGameOptionsDto, createFakeCreateThiefGameOptionsDto, createFakeRolesGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto.factory";
import { bulkCreateFakeCreateGamePlayerDto, createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto, createFakeCreateGameWithPlayersDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGetGameHistoryDto } from "@tests/factories/game/dto/get-game-history/get-game-history.dto.factory";
import { createFakeMakeGamePlayDto } from "@tests/factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeCompositionGameOptions } from "@tests/factories/game/schemas/game-options/composition-game-options.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlaySourceInteraction } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source.schema.factory";
import { createFakeGamePlayCupidCharms, createFakeGamePlaySeerLooks, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWolfHoundChoosesSide } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeSeenBySeerPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createObjectIdFromString } from "@tests/helpers/mongoose/mongoose.helpers";
import type { ExceptionResponse } from "@tests/types/exception/exception.types";

describe("Game Controller", () => {
  let app: NestFastifyApplication;
  let testingModule: TestingModule;
  let models: {
    game: Model<Game>;
    gameHistoryRecord: Model<GameHistoryRecord>;
  };

  beforeAll(async() => {
    const { app: server, module } = await initNestApp();
    app = server;
    testingModule = module;
    models = {
      game: testingModule.get<Model<Game>>(getModelToken(Game.name)),
      gameHistoryRecord: testingModule.get<Model<GameHistoryRecord>>(getModelToken(GameHistoryRecord.name)),
    };
  });

  beforeEach(async() => {
    await truncateAllCollections(testingModule);
  });

  afterEach(async() => {
    await truncateAllCollections(testingModule);
  });

  afterAll(async() => {
    await app.close();
  });

  describe("GET /games", () => {
    it("should get no games when no populate yet.", async() => {
      const response = await app.inject({
        method: "GET",
        url: "/games",
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game[]>()).toStrictEqual<Game[]>([]);
    });

    it("should get 3 games when 3 games were created.", async() => {
      const games = [
        createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() }),
        createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() }),
        createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() }),
      ];
      await models.game.create(games);
      const response = await app.inject({
        method: "GET",
        url: "/games",
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game[]>()).toHaveLength(3);
    });
  });

  describe("GET /games/random-composition", () => {
    it.each<{
      test: string;
      query: Record<string, unknown>;
      errorMessage: string;
    }>([
      {
        test: "should not allow getting random game composition when there is not enough players.",
        query: { players: undefined },
        errorMessage: "players must contain at least 4 elements",
      },
      {
        test: "should not allow getting random game composition when there is not enough players.",
        query: { players: [{ name: "Antoine" }] },
        errorMessage: "players must contain at least 4 elements",
      },
      {
        test: "should not allow getting random game composition when the maximum of players is reached.",
        query: { players: bulkCreateFakeCreateGamePlayerDto(45) },
        errorMessage: "players must contain no more than 40 elements",
      },
      {
        test: "should not allow getting random game composition when one of the player name is too short.",
        query: {
          players: [
            createFakeCreateGamePlayerDto({ name: "" }),
            createFakeCreateGamePlayerDto({ name: "JB" }),
            createFakeCreateGamePlayerDto({ name: "Olivia" }),
            createFakeCreateGamePlayerDto({ name: "Thomas" }),
          ],
        },
        errorMessage: "players.0.name must be longer than or equal to 1 characters",
      },
      {
        test: "should not allow getting random game composition when one of the player name is too long.",
        query: {
          players: [
            createFakeCreateGamePlayerDto({ name: faker.string.sample(31) }),
            createFakeCreateGamePlayerDto({ name: "JB" }),
            createFakeCreateGamePlayerDto({ name: "Olivia" }),
            createFakeCreateGamePlayerDto({ name: "Thomas" }),
          ],
        },
        errorMessage: "players.0.name must be shorter than or equal to 30 characters",
      },
      {
        test: "should not allow getting random game composition when two players have the same name.",
        query: {
          players: [
            createFakeCreateGamePlayerDto({ name: "JB" }),
            createFakeCreateGamePlayerDto({ name: "JB" }),
          ],
        },
        errorMessage: "players.name must be unique",
      },
      {
        test: "should not allow getting random game composition when werewolf is in excluded roles",
        query: {
          "players": bulkCreateFakeCreateGamePlayerDto(4),
          "excluded-roles": ["werewolf", "seer"],
        },
        errorMessage: "excludedRoles should not contain villager, werewolf values",
      },
      {
        test: "should not allow getting random game composition when villager is in excluded roles.",
        query: {
          players: bulkCreateFakeCreateGamePlayerDto(4),
          excludedRoles: ["villager", "seer"],
        },
        errorMessage: "excludedRoles should not contain villager, werewolf values",
      },
      {
        test: "should not allow getting random game composition when there is twice the same excluded role.",
        query: {
          players: bulkCreateFakeCreateGamePlayerDto(4),
          excludedRoles: ["seer", "seer"],
        },
        errorMessage: "excluded roles must be unique",
      },
    ])("$test", async({
      query,
      errorMessage,
    }) => {
      const response = await app.inject({
        method: "GET",
        url: "/games/random-composition",
        query: stringify(query),
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toContainEqual(errorMessage);
    });

    it("should get random composition when called.", async() => {
      const query: Partial<GetGameRandomCompositionDto> = {
        players: [
          createFakeCreateGamePlayerDto({ name: "1" }),
          createFakeCreateGamePlayerDto({ name: "2" }),
          createFakeCreateGamePlayerDto({ name: "3" }),
          createFakeCreateGamePlayerDto({ name: "4" }),
          createFakeCreateGamePlayerDto({ name: "5" }),
          createFakeCreateGamePlayerDto({ name: "6" }),
          createFakeCreateGamePlayerDto({ name: "7" }),
          createFakeCreateGamePlayerDto({ name: "8" }),
          createFakeCreateGamePlayerDto({ name: "9" }),
          createFakeCreateGamePlayerDto({ name: "10" }),
          createFakeCreateGamePlayerDto({ name: "11" }),
          createFakeCreateGamePlayerDto({ name: "12" }),
          createFakeCreateGamePlayerDto({ name: "13" }),
          createFakeCreateGamePlayerDto({ name: "14" }),
          createFakeCreateGamePlayerDto({ name: "15" }),
          createFakeCreateGamePlayerDto({ name: "16" }),
          createFakeCreateGamePlayerDto({ name: "17" }),
          createFakeCreateGamePlayerDto({ name: "18" }),
          createFakeCreateGamePlayerDto({ name: "19" }),
          createFakeCreateGamePlayerDto({ name: "20" }),
          createFakeCreateGamePlayerDto({ name: "21" }),
          createFakeCreateGamePlayerDto({ name: "22" }),
          createFakeCreateGamePlayerDto({ name: "23" }),
          createFakeCreateGamePlayerDto({ name: "24" }),
          createFakeCreateGamePlayerDto({ name: "25" }),
          createFakeCreateGamePlayerDto({ name: "26" }),
          createFakeCreateGamePlayerDto({ name: "27" }),
          createFakeCreateGamePlayerDto({ name: "28" }),
          createFakeCreateGamePlayerDto({ name: "29" }),
          createFakeCreateGamePlayerDto({ name: "30" }),
          createFakeCreateGamePlayerDto({ name: "31" }),
          createFakeCreateGamePlayerDto({ name: "32" }),
          createFakeCreateGamePlayerDto({ name: "33" }),
          createFakeCreateGamePlayerDto({ name: "34" }),
          createFakeCreateGamePlayerDto({ name: "35" }),
          createFakeCreateGamePlayerDto({ name: "36" }),
          createFakeCreateGamePlayerDto({ name: "37" }),
          createFakeCreateGamePlayerDto({ name: "38" }),
          createFakeCreateGamePlayerDto({ name: "39" }),
          createFakeCreateGamePlayerDto({ name: "40" }),
        ],
        arePowerfulVillagerRolesPrioritized: false,
      };
      const response = await app.inject({
        method: "GET",
        url: "/games/random-composition",
        query: stringify(query),
      });
      const players = response.json<CreateGamePlayerDto[]>();

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(players).toSatisfyAll<CreateGamePlayerDto>(({ role, side }) => role.current !== undefined && role.current === role.original &&
      side.current !== undefined && side.current === side.original);
    });
  });

  describe("GET /game/:id", () => {
    it("should get a bad request error when id is not mongoId.", async() => {
      const response = await app.inject({
        method: "GET",
        url: "/games/123",
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toBe("Validation failed (Mongo ObjectId is expected)");
    });

    it("should get a not found error when id doesn't exist in base.", async() => {
      const unknownId = faker.database.mongodbObjectId();
      const response = await app.inject({
        method: "GET",
        url: `/games/${unknownId}`,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.json<NotFoundException>().message).toBe(`Game with id "${unknownId}" not found`);
    });

    it("should get a game when id exists in base.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      await models.game.create(game);
      const response = await app.inject({
        method: "GET",
        url: `/games/${game._id.toString()}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game>()).toStrictEqual<Game>({
        ...toJSON(game) as Game,
        _id: expect.any(String) as Types.ObjectId,
        // createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });

  describe("POST /games", () => {
    it.each<{
      test: string;
      payload: CreateGameDto;
      errorMessage: string;
    }>([
      {
        test: "should not allow game creation when no players are provided.",
        payload: createFakeCreateGameDto({}, { players: undefined }),
        errorMessage: "players must be an array",
      },
      {
        test: "should not allow game creation when the minimum of players is not reached.",
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(3) }),
        errorMessage: "players must contain at least 4 elements",
      },
      {
        test: "should not allow game creation when the maximum of players is reached.",
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(45) }),
        errorMessage: "players must contain no more than 40 elements",
      },
      {
        test: "should not allow game creation when one of the player name is too short.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ name: "" }),
            createFakeCreateGamePlayerDto({ name: "JB" }),
            createFakeCreateGamePlayerDto({ name: "Olivia" }),
            createFakeCreateGamePlayerDto({ name: "Thomas" }),
          ],
        }),
        errorMessage: "players.0.name must be longer than or equal to 1 characters",
      },
      {
        test: "should not allow game creation when one of the player name is too long.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ name: faker.string.sample(31) }),
            createFakeCreateGamePlayerDto({ name: "JB" }),
            createFakeCreateGamePlayerDto({ name: "Olivia" }),
            createFakeCreateGamePlayerDto({ name: "Thomas" }),
          ],
        }),
        errorMessage: "players.0.name must be shorter than or equal to 30 characters",
      },
      {
        test: "should not allow game creation when two players have the same name.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ name: "John", role: { name: "three-brothers" } }),
            createFakeCreateGamePlayerDto({ name: "John" }),
          ],
        }),
        errorMessage: "players.name must be unique",
      },
      {
        test: "should not allow game creation when there is only one brother in the same game.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "three-brothers" } }),
            createFakeCreateGamePlayerDto({ role: { name: "villager-villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
          ],
        }),
        errorMessage: "players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles",
      },
      {
        test: "should not allow game creation when there is two witches in the same game.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
          ],
        }),
        errorMessage: "players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
      {
        test: "should not allow game creation when there is no villager in game's composition.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "white-werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
          ],
        }),
        errorMessage: "one of the players.role must have at least one role from `villagers` side",
      },
      {
        test: "should not allow game creation when there is no werewolf in game's composition.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
          ],
        }),
        errorMessage: "one of the players.role must have at least one role from `werewolves` side",
      },
      {
        test: "should not allow game creation when one of the player position is lower than 0.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" }, position: -1 }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "seer" } }),
          ],
        }),
        errorMessage: "players.0.position must not be less than 0",
      },
      {
        test: "should not allow game creation when one of the player position is not consistent faced to others.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "villager" }, position: 0 }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" }, position: 1 }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" }, position: 2 }),
            createFakeCreateGamePlayerDto({ role: { name: "seer" }, position: 666 }),
          ],
        }),
        errorMessage: "players.position must be all set or all undefined. Please check that every player has unique position, from 0 to players.length - 1",
      },
      {
        test: "should not allow game creation when thief is in the game but additional cards are not set.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
        }),
        errorMessage: "additionalCards must be set if there is a player with one of the following roles : thief,actor",
      },
      {
        test: "should not allow game creation when thief is not in the game but additional cards are set.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
          ],
        }),
        errorMessage: "additionalCards can't be set if there is no player with one of the following roles : thief,actor",
      },
      {
        test: "should not allow game creation when thief additional cards are more than the expected default limit.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
          ],
        }),
        errorMessage: "additionalCards length for thief must be equal to options.roles.thief.additionalCardsCount",
      },
      {
        test: "should not allow game creation when thief additional cards are less than the expected limit defined in options.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 4 }) }) }),
        }),
        errorMessage: "additionalCards length for thief must be equal to options.roles.thief.additionalCardsCount",
      },
      {
        test: "should not allow game creation when one thief additional card is the thief himself.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "thief", recipient: "thief" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for thief must be one of the following values: ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when one thief additional card (thief role) is is not available for thief.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "two-sisters", recipient: "thief" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for thief must be one of the following values: ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when one thief additional card (two-sisters role) is is not available for thief.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "two-sisters" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "two-sisters", recipient: "thief" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for thief must be one of the following values: ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when one thief additional card (three-brothers role) is is not available for thief.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "three-brothers" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "two-sisters", recipient: "thief" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for thief must be one of the following values: ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when two thief additional role cards exceed the maximum occurrences in game possible.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "wolf-hound", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "wolf-hound", recipient: "thief" }),
          ],
        }),
        errorMessage: "additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
      {
        test: "should not allow game creation when one thief additional role card exceeds the maximum occurrences in game possible because another player has it.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "thief" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "witch", recipient: "thief" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "thief" }),
          ],
        }),
        errorMessage: "additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
      {
        test: "should not allow game creation when prejudiced manipulator is in the game and one of the player's group is not set",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "fox" } }),
          ],
        }),
        errorMessage: "each player must have a group if there is a player with role `prejudiced-manipulator`",
      },
      {
        test: "should not allow game creation when prejudiced manipulator is in the game and there is only one group among players",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
            createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "toto" }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "toto" }),
            createFakeCreateGamePlayerDto({ role: { name: "fox" }, group: "toto" }),
          ],
        }),
        errorMessage: "there must be exactly two groups among players when `prejudiced-manipulator` in the game",
      },
      {
        test: "should not allow game creation when prejudiced manipulator is in the game and there are three groups among players",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
            createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "tata" }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "tutu" }),
            createFakeCreateGamePlayerDto({ role: { name: "fox" }, group: "toto" }),
          ],
        }),
        errorMessage: "there must be exactly two groups among players when `prejudiced-manipulator` in the game",
      },
      {
        test: "should not allow game creation when prejudiced manipulator is in the game and one of the group name is too short",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
            createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "" }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "" }),
            createFakeCreateGamePlayerDto({ role: { name: "fox" }, group: "toto" }),
          ],
        }),
        errorMessage: "players.1.group must be longer than or equal to 1 characters",
      },
      {
        test: "should not allow game creation when prejudiced manipulator is in the game and one of the group name is too long",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
            createFakeCreateGamePlayerDto({ role: { name: "prejudiced-manipulator" }, group: "I'm the longest name for a group that you ever seen" }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "I'm the longest name for a group that you ever seen" }),
            createFakeCreateGamePlayerDto({ role: { name: "fox" }, group: "toto" }),
          ],
        }),
        errorMessage: "players.2.group must be shorter than or equal to 30 characters",
      },
      {
        test: "should not allow game creation when prejudiced manipulator is not in the game and there groups among players",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, group: "toto" }),
            createFakeCreateGamePlayerDto({ role: { name: "villager" }, group: "tata" }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" }, group: "tutu" }),
            createFakeCreateGamePlayerDto({ role: { name: "fox" }, group: "toto" }),
          ],
        }),
        errorMessage: "any player can't have a group if there is no player with role `prejudiced-manipulator`",
      },
      {
        test: "should not allow game creation when actor is in the game but additional cards are not set.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
        }),
        errorMessage: "additionalCards must be set if there is a player with one of the following roles : thief,actor",
      },
      {
        test: "should not allow game creation when actor is not in the game but additional cards are set.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "villager" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
          ],
        }),
        errorMessage: "additionalCards can't be set if there is no player with one of the following roles : thief,actor",
      },
      {
        test: "should not allow game creation when actor additional cards are more than the expected default limit.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
          ],
        }),
        errorMessage: "additionalCards length for actor must be equal to options.roles.actor.additionalCardsCount",
      },
      {
        test: "should not allow game creation when actor additional cards are more than the expected changed limit set in options.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "seer", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "hunter", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "idiot", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "elder", recipient: "actor" }),
          ],
          options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptionsDto({ actor: createFakeCreateActorGameOptionsDto({ additionalCardsCount: 1 }) }) }),
        }),
        errorMessage: "additionalCards length for actor must be equal to options.roles.actor.additionalCardsCount",
      },
      {
        test: "should not allow game creation when one actor additional card (werewolf role) is is not available for actor.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "seer", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "idiot", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "werewolf", recipient: "actor" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for actor must be one of the following values: ${ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when one actor additional card (big-bad-wolf role) is is not available for actor.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "seer", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "idiot", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "big-bad-wolf", recipient: "actor" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for actor must be one of the following values: ${ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when one actor additional card (two-sisters role) is is not available for actor.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "seer", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "idiot", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "two-sisters", recipient: "actor" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for actor must be one of the following values: ${ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when one actor additional card (actor role) is is not available for actor.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "seer", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "idiot", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "actor", recipient: "actor" }),
          ],
        }),
        errorMessage: `additionalCards.roleName for actor must be one of the following values: ${ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`,
      },
      {
        test: "should not allow game creation when one actor additional role card exceeds the maximum occurrences in game possible because another player has it.",
        payload: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: "werewolf" } }),
            createFakeCreateGamePlayerDto({ role: { name: "pied-piper" } }),
            createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
            createFakeCreateGamePlayerDto({ role: { name: "actor" } }),
          ],
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: "witch", recipient: "actor" }),
            createFakeCreateGameAdditionalCardDto({ roleName: "seer", recipient: "actor" }),
          ],
        }),
        errorMessage: "additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
    ])("$test", async({
      payload,
      errorMessage,
    }) => {
      const response = await app.inject({
        method: "POST",
        url: "/games",
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toContainEqual<string>(errorMessage);
    });

    it(`should create game when called.`, async() => {
      const payload = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ role: { name: "villager" }, name: "Antoine" }),
          createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, name: "Mathis" }),
          createFakeCreateGamePlayerDto({ role: { name: "villager-villager" }, name: "Virgil" }),
          createFakeCreateGamePlayerDto({ role: { name: "white-werewolf" }, name: "JB" }),
          createFakeCreateGamePlayerDto({ role: { name: "cupid" }, name: "Doudou" }),
          createFakeCreateGamePlayerDto({ role: { name: "seer" }, name: "Juju" }),
        ],
      }, { options: undefined });
      const response = await app.inject({
        method: "POST",
        url: "/games",
        payload,
      });
      const expectedPlayers = payload.players.map<Player>((player, index) => ({
        _id: expect.any(String) as Types.ObjectId,
        name: player.name,
        role: {
          current: player.role.name,
          original: player.role.name,
          isRevealed: player.role.name === "villager-villager",
        },
        side: {
          current: ["villager", "villager-villager", "cupid", "seer"].includes(player.role.name) ? "villagers" : "werewolves",
          original: ["villager", "villager-villager", "cupid", "seer"].includes(player.role.name) ? "villagers" : "werewolves",
        },
        attributes: [],
        position: index,
        isAlive: true,
      }));
      const expectedCurrentPlay: GamePlay = {
        type: "vote",
        action: "elect-sheriff",
        source: {
          name: "survivors",
          players: expectedPlayers,
          interactions: [
            {
              source: "survivors",
              type: "choose-as-sheriff",
              eligibleTargets: expectedPlayers,
              boundaries: { min: 1, max: 6 },
            },
          ],
        },
        occurrence: "anytime",
        canBeSkipped: false,
      };
      const expectedGame: Game = {
        _id: expect.any(String) as Types.ObjectId,
        phase: toJSON(createFakeGamePhase({ name: "night", tick: 1 })) as GamePhase,
        status: "playing",
        turn: 1,
        tick: 1,
        players: expectedPlayers,
        currentPlay: expectedCurrentPlay,
        upcomingPlays: toJSON([
          createFakeGamePlayCupidCharms(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayWerewolvesEat(),
          createFakeGamePlayWhiteWerewolfEats(),
        ]) as GamePlay[],
        options: DEFAULT_GAME_OPTIONS,
        lastGameHistoryRecord: null,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      };

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json<Game>()).toStrictEqual<Game>(expectedGame);
    });

    it(`should create game with additional cards when thief is in the game.`, async() => {
      const payload = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ role: { name: "thief" }, name: "Antoine" }),
          createFakeCreateGamePlayerDto({ role: { name: "werewolf" }, name: "Mathis" }),
          createFakeCreateGamePlayerDto({ role: { name: "villager-villager" }, name: "Virgil" }),
          createFakeCreateGamePlayerDto({ role: { name: "white-werewolf" }, name: "JB" }),
          createFakeCreateGamePlayerDto({ role: { name: "cupid" }, name: "Doudou" }),
          createFakeCreateGamePlayerDto({ role: { name: "seer" }, name: "Juju" }),
        ],
        additionalCards: [
          createFakeGameAdditionalCard({ roleName: "werewolf", recipient: "thief" }),
          createFakeGameAdditionalCard({ roleName: "accursed-wolf-father", recipient: "thief" }),
        ],
      }, { options: undefined });
      const expectedPlayers = payload.players.map<Player>((player, index) => ({
        _id: expect.any(String) as Types.ObjectId,
        name: player.name,
        role: {
          current: player.role.name,
          original: player.role.name,
          isRevealed: player.role.name === "villager-villager",
        },
        side: {
          current: ["villager", "villager-villager", "cupid", "seer", "thief"].includes(player.role.name) ? "villagers" : "werewolves",
          original: ["villager", "villager-villager", "cupid", "seer", "thief"].includes(player.role.name) ? "villagers" : "werewolves",
        },
        attributes: [],
        position: index,
        isAlive: true,
      }));
      const expectedGameAdditionalCards = payload.additionalCards?.map<GameAdditionalCard>(additionalCard => ({
        _id: expect.any(String) as Types.ObjectId,
        roleName: additionalCard.roleName,
        recipient: additionalCard.recipient,
        isUsed: false,
      }));
      const expectedCurrentPlay: GamePlay = {
        type: "vote",
        action: "elect-sheriff",
        source: {
          name: "survivors",
          players: expectedPlayers,
          interactions: [
            {
              source: "survivors",
              type: "choose-as-sheriff",
              eligibleTargets: expectedPlayers,
              boundaries: { min: 1, max: 6 },
            },
          ],
        },
        occurrence: "anytime",
        canBeSkipped: false,
      };
      const expectedGame: Game = {
        _id: expect.any(String) as Types.ObjectId,
        phase: toJSON(createFakeGamePhase({ name: "night", tick: 1 })) as GamePhase,
        status: "playing",
        turn: 1,
        tick: 1,
        players: expectedPlayers,
        currentPlay: expectedCurrentPlay,
        upcomingPlays: toJSON([
          createFakeGamePlayThiefChoosesCard(),
          createFakeGamePlayCupidCharms(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayWerewolvesEat(),
          createFakeGamePlayWhiteWerewolfEats(),
        ]) as GamePlay[],
        additionalCards: expectedGameAdditionalCards,
        options: DEFAULT_GAME_OPTIONS,
        lastGameHistoryRecord: null,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      };
      const response = await app.inject({
        method: "POST",
        url: "/games",
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json<Game>()).toStrictEqual<Game>(expectedGame);
    });

    it(`should create game with different options when called with options specified and some omitted.`, async() => {
      const options: Partial<GameOptions> = {
        roles: {
          areRevealedOnDeath: false,
          doSkipCallIfNoTarget: true,
          sheriff: {
            isEnabled: false,
            electedAt: {
              turn: 5,
              phaseName: "day",
            },
            hasDoubledVote: false,
            mustSettleTieInVotes: false,
          },
          bigBadWolf: { isPowerlessIfWerewolfDies: false },
          whiteWerewolf: { wakingUpInterval: 5 },
          seer: {
            isTalkative: false,
            canSeeRoles: false,
          },
          cupid: {
            lovers: { doRevealRoleToEachOther: true },
            mustWinWithLovers: true,
          },
          littleGirl: { isProtectedByDefender: true },
          defender: { canProtectTwice: true },
          elder: {
            livesCountAgainstWerewolves: 1,
            doesTakeHisRevenge: false,
          },
          idiot: { doesDieOnElderDeath: false },
          twoSisters: { wakingUpInterval: 0 },
          threeBrothers: { wakingUpInterval: 5 },
          fox: { isPowerlessIfMissesWerewolf: false },
          bearTamer: { doesGrowlOnWerewolvesSide: false },
          stutteringJudge: { voteRequestsCount: 3 },
          wildChild: { isTransformationRevealed: true },
          wolfHound: {
            isChosenSideRevealed: true,
            isSideRandomlyChosen: true,
          },
          thief: {
            mustChooseBetweenWerewolves: false,
            isChosenCardRevealed: true,
            additionalCardsCount: 4,
          },
          piedPiper: {
            charmedPeopleCountPerNight: 1,
            isPowerlessOnWerewolvesSide: false,
          },
          scandalmonger: { markPenalty: 5 },
          witch: { doesKnowWerewolvesTargets: false },
          prejudicedManipulator: { isPowerlessOnWerewolvesSide: false },
          actor: {
            isPowerlessOnWerewolvesSide: false,
            additionalCardsCount: 5,
          },
        },
      };
      const payload = createFakeCreateGameWithPlayersDto({}, { options });
      const expectedOptions = createFakeGameOptionsDto({
        ...options,
        composition: createFakeCompositionGameOptions({ isHidden: DEFAULT_GAME_OPTIONS.composition.isHidden }),
        votes: createFakeVotesGameOptions({ canBeSkipped: DEFAULT_GAME_OPTIONS.votes.canBeSkipped }),
      });
      const response = await app.inject({
        method: "POST",
        url: "/games",
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json<Game>().options).toStrictEqual<GameOptions>(toJSON(expectedOptions) as GameOptions);
    });
  });

  describe("DELETE /game/:id", () => {
    it("should get a bad request error when id is not mongoId.", async() => {
      const response = await app.inject({
        method: "DELETE",
        url: "/games/123",
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toBe("Validation failed (Mongo ObjectId is expected)");
    });

    it("should get a not found error when id doesn't exist in base.", async() => {
      const unknownId = faker.database.mongodbObjectId();
      const response = await app.inject({
        method: "DELETE",
        url: `/games/${unknownId}`,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.json<NotFoundException>().message).toBe(`Game with id "${unknownId}" not found`);
    });

    it("should get a bad request error when game doesn't have playing status.", async() => {
      const game = createFakeGameWithCurrentPlay({ status: "canceled", currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      await models.game.create(game);
      const response = await app.inject({
        method: "DELETE",
        url: `/games/${game._id.toString()}`,
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<ExceptionResponse>()).toStrictEqual<ExceptionResponse>({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Bad mutation for Game with id "${game._id.toString()}"`,
        error: `Game doesn't have status with value "playing"`,
      });
    });

    it("should update game status to canceled when called.", async() => {
      const game = createFakeGameWithCurrentPlay({ status: "playing", currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      await models.game.create(game);
      const response = await app.inject({
        method: "DELETE",
        url: `/games/${game._id.toString()}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game>()).toStrictEqual<Game>({
        ...toJSON(game) as Game,
        status: "canceled",
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });

  describe("POST /game/:id/play", () => {
    it("should not allow game play when game id is not a mongo id.", async() => {
      const response = await app.inject({
        method: "POST",
        url: `/games/123/play`,
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toBe("Validation failed (Mongo ObjectId is expected)");
    });

    it.each<{
      test: string;
      payload: MakeGamePlayDto;
      errorMessage: string;
    }>([
      {
        test: "should not allow game play when player ids in targets must be unique.",
        payload: createFakeMakeGamePlayDto({ targets: [{ playerId: createObjectIdFromString("507f1f77bcf86cd799439011") }, { playerId: createObjectIdFromString("507f1f77bcf86cd799439011") }] }),
        errorMessage: "targets.playerId must be unique",
      },
      {
        test: "should not allow game play when player ids in targets must be unique.",
        payload: createFakeMakeGamePlayDto({
          votes: [
            { sourceId: createObjectIdFromString("507f1f77bcf86cd799439011"), targetId: createObjectIdFromString("507f1f77bcf86cd799439012") },
            { sourceId: createObjectIdFromString("507f1f77bcf86cd799439011"), targetId: createObjectIdFromString("507f1f77bcf86cd799439012") },
          ],
        }),
        errorMessage: "votes.sourceId must be unique",
      },
    ])("$test", async({
      payload,
      errorMessage,
    }) => {
      const response = await app.inject({
        method: "POST",
        url: `/games/${faker.database.mongodbObjectId()}/play`,
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toContainEqual(errorMessage);
    });

    it("should not allow game play when game id not found.", async() => {
      const unknownId = faker.database.mongodbObjectId();
      const response = await app.inject({
        method: "POST",
        url: `/games/${unknownId}/play`,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.json<BadRequestException>().message).toBe(`Game with id "${unknownId}" not found`);
    });

    it("should not allow game play when payload contains unknown resources id.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({
        status: "playing",
        currentPlay: createFakeGamePlayWolfHoundChoosesSide(),
        upcomingPlays: [createFakeGamePlaySurvivorsVote()],
        players,
      });
      await models.game.create(game);
      const unknownPlayerId = faker.database.mongodbObjectId();
      const payload = createFakeMakeGamePlayDto({ targets: [{ playerId: createObjectIdFromString(unknownPlayerId) }] });
      const response = await app.inject({
        method: "POST",
        url: `/games/${game._id.toString()}/play`,
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.json<ExceptionResponse>()).toStrictEqual<ExceptionResponse>({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Player with id "${unknownPlayerId.toString()}" not found`,
        error: "Game Play - Player in `targets.player` is not in the game players",
      });
    });

    it("should not allow game play when payload is not valid.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const game = createFakeGame({
        status: "playing",
        currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: false }),
        players,
        options,
      });
      await models.game.create(game);
      const payload = createFakeMakeGamePlayDto({});
      const response = await app.inject({
        method: "POST",
        url: `/games/${game._id.toString()}/play`,
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<ExceptionResponse>()).toStrictEqual<ExceptionResponse>({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Bad game play payload`,
        error: "`votes` is required on this current game's state",
      });
    });

    it("should make a game play when called with votes.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const currentPlay = createFakeGamePlaySurvivorsVote({
        source: createFakeGamePlaySource({
          name: "survivors",
          players,
          interactions: [
            createFakeGamePlaySourceInteraction({
              source: "survivors",
              type: "vote",
              eligibleTargets: [players[0], players[1]],
              boundaries: { min: 1, max: 4 },
            }),
          ],
        }),
      });
      const game = createFakeGame({
        status: "playing",
        phase: createFakeGamePhase({ name: "day" }),
        currentPlay,
        upcomingPlays: [
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayWerewolvesEat(),
        ],
        players,
        options,
      });
      await models.game.create(game);
      const payload = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: players[0]._id, targetId: players[1]._id },
          { sourceId: players[1]._id, targetId: players[0]._id },
        ],
      });
      const expectedPhase = createFakeGamePhase({ ...game.phase, tick: game.phase.tick + 1 });
      const expectedCurrentPlay = createFakeGamePlaySurvivorsVote({
        causes: ["previous-votes-were-in-ties"],
        source: createFakeGamePlaySource({
          name: "survivors",
          players,
          interactions: [
            createFakeGamePlaySourceInteraction({
              source: "survivors",
              type: "vote",
              eligibleTargets: [players[1], players[0]],
              boundaries: { min: 1, max: 4 },
            }),
          ],
        }),
        canBeSkipped: false,
      });
      const expectedGame = createFakeGame({
        ...game,
        phase: expectedPhase,
        tick: game.tick + 1,
        currentPlay: expectedCurrentPlay,
      });
      const response = await app.inject({
        method: "POST",
        url: `/games/${game._id.toString()}/play`,
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game>()).toStrictEqual<Game>({
        ...toJSON(expectedGame) as Game,
        lastGameHistoryRecord: expect.any(Object) as GameHistoryRecord,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });

    it("should make a game play when called with targets.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySeerLooks({
        source: createFakeGamePlaySource({
          name: "seer",
          players: [players[1]],
          interactions: [
            createFakeGamePlaySourceInteraction({
              source: "seer",
              type: "look",
              eligibleTargets: [players[0]],
              boundaries: { min: 1, max: 1 },
            }),
          ],
        }),
      });
      const game = createFakeGame({
        phase: createFakeGamePhase({ name: "night" }),
        status: "playing",
        currentPlay,
        upcomingPlays: [createFakeGamePlayWerewolvesEat()],
        players,
      });
      await models.game.create(game);
      const payload = createFakeMakeGamePlayDto({ targets: [{ playerId: players[0]._id }] });
      const expectedCurrentPlay = createFakeGamePlayWerewolvesEat({
        source: createFakeGamePlaySource({
          name: "werewolves",
          players: [createFakePlayer({ ...players[0], attributes: [createFakeSeenBySeerPlayerAttribute()] }), players[3]],
          interactions: [
            createFakeGamePlaySourceInteraction({
              source: "werewolves",
              type: "eat",
              eligibleTargets: [players[1], players[2]],
              boundaries: { min: 1, max: 1 },
            }),
          ],
        }),
        canBeSkipped: false,
      });

      const expectedGame = createFakeGame({
        ...game,
        tick: game.tick + 1,
        phase: createFakeGamePhase({ ...game.phase, tick: game.phase.tick + 1 }),
        currentPlay: expectedCurrentPlay,
        upcomingPlays: [],
        players: [
          createFakePlayer({ ...players[0], attributes: [createFakeSeenBySeerPlayerAttribute()] }),
          players[1],
          players[2],
          players[3],
        ],
      });
      const response = await app.inject({
        method: "POST",
        url: `/games/${game._id.toString()}/play`,
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game>()).toStrictEqual<Game>({
        ...toJSON(expectedGame) as Game,
        lastGameHistoryRecord: expect.any(Object) as GameHistoryRecord,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });

  describe("GET /games/:id/history", () => {
    it.each<{
      test: string;
      query: Record<string, unknown>;
      errorMessage: string;
    }>([
      {
        test: "should get bad request error on getting game history when limit is negative.",
        query: { limit: -1 },
        errorMessage: "limit must not be less than 0",
      },
      {
        test: "should get bad request error on getting game history when limit is not a number.",
        query: { limit: "lol" },
        errorMessage: "limit must be an integer number",
      },
      {
        test: "should get bad request error on getting game history when order is not asc nor desc.",
        query: { order: "unknown" },
        errorMessage: "order must be one of the following values: asc, desc",
      },
    ])("$test", async({
      query,
      errorMessage,
    }) => {
      const response = await app.inject({
        method: "GET",
        url: `/games/${faker.database.mongodbObjectId()}/history`,
        query: stringify(query),
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toContainEqual(errorMessage);
    });

    it("should get a bad request error when id is not mongoId.", async() => {
      const response = await app.inject({
        method: "GET",
        url: "/games/123/history",
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toBe("Validation failed (Mongo ObjectId is expected)");
    });

    it("should get a not found error when id doesn't exist in base.", async() => {
      const unknownId = faker.database.mongodbObjectId();
      const response = await app.inject({
        method: "GET",
        url: `/games/${unknownId}/history`,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.json<NotFoundException>().message).toBe(`Game with id "${unknownId}" not found`);
    });

    it("should return no game history records when game doesn't have any.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const secondGame = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ name: "big-bad-wolf" }) });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay }),
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay }),
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay }),
      ];
      await models.game.insertMany([game, secondGame]);
      await models.gameHistoryRecord.insertMany(gameHistoryRecords);

      const response = await app.inject({
        method: "GET",
        url: `/games/${secondGame._id.toString()}/history`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<GameHistoryRecord[]>()).toStrictEqual([]);
    });

    it("should return 3 game history records when game have 3 records.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const secondGame = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ name: "big-bad-wolf" }) });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay, createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay, createdAt: new Date("2023-01-01") }),
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay, createdAt: new Date("2024-01-01") }),
      ];
      await models.game.insertMany([game, secondGame]);
      await models.gameHistoryRecord.insertMany(gameHistoryRecords);

      const response = await app.inject({
        method: "GET",
        url: `/games/${game._id.toString()}/history`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<GameHistoryRecord[]>()).toStrictEqual<GameHistoryRecord[]>([
        {
          ...toJSON(gameHistoryRecords[0]),
          createdAt: expect.any(String) as Date,
        },
        {
          ...toJSON(gameHistoryRecords[1]),
          createdAt: expect.any(String) as Date,
        },
        {
          ...toJSON(gameHistoryRecords[2]),
          createdAt: expect.any(String) as Date,
        },
      ] as GameHistoryRecord[]);
    });

    it("should return last recent game history record when limit is 1 and order is desc.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const getGameHistoryDto = createFakeGetGameHistoryDto({ limit: 1, order: ApiSortOrder.DESC });
      const secondGame = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ name: "big-bad-wolf" }) });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay, createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay, createdAt: new Date("2023-01-01") }),
        createFakeGameHistoryRecord({ gameId: game._id, play: gameHistoryRecordPlay, createdAt: new Date("2024-01-01") }),
      ];
      await models.game.insertMany([game, secondGame]);
      await models.gameHistoryRecord.insertMany(gameHistoryRecords);

      const response = await app.inject({
        method: "GET",
        url: `/games/${game._id.toString()}/history`,
        query: stringify(getGameHistoryDto),
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<GameHistoryRecord[]>()).toStrictEqual<GameHistoryRecord[]>([
        {
          ...toJSON(gameHistoryRecords[2]),
          createdAt: expect.any(String) as Date,
        },
      ] as GameHistoryRecord[]);
    });
  });
});