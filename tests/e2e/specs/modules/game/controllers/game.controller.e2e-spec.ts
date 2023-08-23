import { faker } from "@faker-js/faker";
import type { BadRequestException, NotFoundException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { Model, Types } from "mongoose";
import { stringify } from "qs";
import { gameAdditionalCardsThiefRoleNames } from "../../../../../../src/modules/game/constants/game-additional-card/game-additional-card.constant";
import { defaultGameOptions } from "../../../../../../src/modules/game/constants/game-options/game-options.constant";
import type { CreateGamePlayerDto } from "../../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../../../../../../src/modules/game/dto/create-game/create-game.dto";
import type { GetGameRandomCompositionDto } from "../../../../../../src/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import type { MakeGamePlayDto } from "../../../../../../src/modules/game/dto/make-game-play/make-game-play.dto";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../../../../../../src/modules/game/enums/game-play.enum";
import { GAME_PHASES, GAME_STATUSES } from "../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import type { GameAdditionalCard } from "../../../../../../src/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameHistoryRecord } from "../../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameOptions } from "../../../../../../src/modules/game/schemas/game-options/game-options.schema";
import type { GamePlay } from "../../../../../../src/modules/game/schemas/game-play/game-play.schema";
import { Game } from "../../../../../../src/modules/game/schemas/game.schema";
import type { Player } from "../../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../src/modules/role/enums/role.enum";
import { createFakeCreateGameAdditionalCardDto } from "../../../../../factories/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto.factory";
import { createFakeGameOptionsDto } from "../../../../../factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { createFakeCreateThiefGameOptionsDto } from "../../../../../factories/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto.factory";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto, createFakeCreateGameWithPlayersDto } from "../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayDto } from "../../../../../factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGameAdditionalCard } from "../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord } from "../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeCompositionGameOptions } from "../../../../../factories/game/schemas/game-options/composition-game-options.schema.factory";
import { createFakeGameOptions } from "../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions } from "../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "../../../../../factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlaySource } from "../../../../../factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlayAllVote, createFakeGamePlayCupidCharms, createFakeGamePlayLoversMeetEachOther, createFakeGamePlaySeerLooks, createFakeGamePlayThiefChoosesCard, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats } from "../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "../../../../../factories/game/schemas/game.schema.factory";
import { createFakeSeenBySeerPlayerAttribute } from "../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../factories/game/schemas/player/player.schema.factory";
import { createObjectIdFromString } from "../../../../../helpers/mongoose/mongoose.helper";
import { toJSON } from "../../../../../helpers/object/object.helper";
import type { ExceptionResponse } from "../../../../../types/exception/exception.types";
import { initNestApp } from "../../../../helpers/nest-app.helper";

describe("Game Controller", () => {
  let app: NestFastifyApplication;
  let models: {
    game: Model<Game>;
    gameHistoryRecord: Model<GameHistoryRecord>;
  };

  beforeAll(async() => {
    const { app: server, module } = await initNestApp();
    app = server;
    models = {
      game: module.get<Model<Game>>(getModelToken(Game.name)),
      gameHistoryRecord: module.get<Model<GameHistoryRecord>>(getModelToken(GameHistoryRecord.name)),
    };
  });

  afterEach(async() => {
    await Promise.all([
      models.game.deleteMany(),
      models.gameHistoryRecord.deleteMany(),
    ]);
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
        createFakeGameWithCurrentPlay(),
        createFakeGameWithCurrentPlay(),
        createFakeGameWithCurrentPlay(),
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
    it.each<{ query: Record<string, unknown>; test: string; errorMessage: string }>([
      {
        query: { players: undefined },
        test: "there is not enough players",
        errorMessage: "players must contain at least 4 elements",
      },
      {
        query: { players: [{ name: "Antoine" }] },
        test: "there is not enough players",
        errorMessage: "players must contain at least 4 elements",
      },
      {
        query: { players: bulkCreateFakeCreateGamePlayerDto(45) },
        test: "the maximum of players is reached",
        errorMessage: "players must contain no more than 40 elements",
      },
      {
        query: { players: bulkCreateFakeCreateGamePlayerDto(4, [{ name: "" }]) },
        test: "one of the player name is too short",
        errorMessage: "players.0.name must be longer than or equal to 1 characters",
      },
      {
        query: { players: bulkCreateFakeCreateGamePlayerDto(4, [{ name: faker.string.sample(31) }]) },
        test: "one of the player name is too long",
        errorMessage: "players.0.name must be shorter than or equal to 30 characters",
      },
      {
        query: {
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { name: "John" },
            { name: "John" },
          ]),
        },
        test: "two players have the same name",
        errorMessage: "players.name must be unique",
      },
      {
        query: {
          "players": bulkCreateFakeCreateGamePlayerDto(4),
          "excluded-roles": [ROLE_NAMES.WEREWOLF, ROLE_NAMES.SEER],
        },
        test: "werewolf is in excluded roles",
        errorMessage: "excludedRoles should not contain villager, werewolf values",
      },
      {
        query: {
          players: bulkCreateFakeCreateGamePlayerDto(4),
          excludedRoles: [ROLE_NAMES.VILLAGER, ROLE_NAMES.SEER],
        },
        test: "villager is in excluded roles",
        errorMessage: "excludedRoles should not contain villager, werewolf values",
      },
      {
        query: {
          players: bulkCreateFakeCreateGamePlayerDto(4),
          excludedRoles: [ROLE_NAMES.SEER, ROLE_NAMES.SEER],
        },
        test: "there is twice the same excluded role",
        errorMessage: "excluded roles must be unique",
      },
    ])("should not allow getting random game composition when $test [#$#].", async({
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
        players: bulkCreateFakeCreateGamePlayerDto(40, [
          { name: "1" },
          { name: "2" },
          { name: "3" },
          { name: "4" },
          { name: "5" },
          { name: "6" },
          { name: "7" },
          { name: "8" },
          { name: "9" },
          { name: "10" },
          { name: "11" },
          { name: "12" },
          { name: "13" },
          { name: "14" },
          { name: "15" },
          { name: "16" },
          { name: "17" },
          { name: "18" },
          { name: "19" },
          { name: "20" },
          { name: "21" },
          { name: "22" },
          { name: "23" },
          { name: "24" },
          { name: "25" },
          { name: "26" },
          { name: "27" },
          { name: "28" },
          { name: "29" },
          { name: "30" },
          { name: "31" },
          { name: "32" },
          { name: "33" },
          { name: "34" },
          { name: "35" },
          { name: "36" },
          { name: "37" },
          { name: "38" },
          { name: "39" },
          { name: "40" },
        ]), arePowerfulVillagerRolesPrioritized: false,
      };
      const response = await app.inject({
        method: "GET",
        url: "/games/random-composition",
        query: stringify(query),
      });
      const players = response.json<CreateGamePlayerDto[]>();

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(players).toSatisfyAll<CreateGamePlayerDto>(({ role, side }) =>
        role.current !== undefined && role.current === role.original &&
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
      const game = createFakeGameWithCurrentPlay();
      await models.game.create(game);
      const response = await app.inject({
        method: "GET",
        url: `/games/${game._id.toString()}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game>()).toStrictEqual<Game>({
        ...toJSON(game) as Game,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });

  describe("POST /games", () => {
    it.each<{ payload: CreateGameDto; test: string; errorMessage: string }>([
      {
        payload: createFakeCreateGameDto({}, { players: undefined }),
        test: "no players are provided",
        errorMessage: "players must be an array",
      },
      {
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(3) }),
        test: "the minimum of players is not reached",
        errorMessage: "players must contain at least 4 elements",
      },
      {
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(45) }),
        test: "the maximum of players is reached",
        errorMessage: "players must contain no more than 40 elements",
      },
      {
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(4, [{ name: "" }]) }),
        test: "one of the player name is too short",
        errorMessage: "players.0.name must be longer than or equal to 1 characters",
      },
      {
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(4, [{ name: faker.string.sample(31) }]) }),
        test: "one of the player name is too long",
        errorMessage: "players.0.name must be shorter than or equal to 30 characters",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { name: "John", role: { name: ROLE_NAMES.THREE_BROTHERS } },
            { name: "John" },
          ]),
        }),
        test: "two players have the same name",
        errorMessage: "players.name must be unique",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.THREE_BROTHERS } },
            { role: { name: ROLE_NAMES.VILLAGER_VILLAGER } },
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.SEER } },
          ]),
        }),
        test: "there is only one brother in the same game",
        errorMessage: "players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.WITCH } },
          ]),
        }),
        test: "there is two witches in the same game",
        errorMessage: "players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.WEREWOLF } },
          ]),
        }),
        test: "there is no villager in game's composition",
        errorMessage: "one of the players.role must have at least one role from `villagers` side",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.VILLAGER } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.SEER } },
          ]),
        }),
        test: "there is no werewolf in game's composition",
        errorMessage: "one of the players.role must have at least one role from `werewolves` side",
      },
      {
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(4, [{ position: -1 }]) }),
        test: "one of the player position is lower than 0",
        errorMessage: "players.0.position must not be less than 0",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.VILLAGER }, position: 0 },
            { role: { name: ROLE_NAMES.PIED_PIPER }, position: 1 },
            { role: { name: ROLE_NAMES.WITCH }, position: 2 },
            { role: { name: ROLE_NAMES.SEER }, position: 666 },
          ]),
        }),
        test: "one of the player position is not consistent faced to others",
        errorMessage: "players.position must be all set or all undefined. Please check that every player has unique position, from 0 to players.length - 1",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.THIEF } },
          ]),
        }),
        test: "thief is in the game but additional cards are not set",
        errorMessage: "additionalCards must be set if there is a player with role `thief`",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.VILLAGER } },
          ]),
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
          ],
        }),
        test: "thief is not in the game but additional cards are set",
        errorMessage: "additionalCards can't be set if there is no player with role `thief`",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.THIEF } },
          ]),
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
          ],
        }),
        test: "thief additional cards are more than the expected default limit",
        errorMessage: "additionalCards length must be equal to options.roles.thief.additionalCardsCount",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.THIEF } },
          ]),
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeCreateThiefGameOptionsDto({ additionalCardsCount: 4 }) }) }),
        }),
        test: "thief additional cards are less than the expected limit defined in options",
        errorMessage: "additionalCards length must be equal to options.roles.thief.additionalCardsCount",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.THIEF } },
          ]),
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.THIEF, recipient: ROLE_NAMES.THIEF }),
          ],
        }),
        test: "one thief additional card is the thief himself",
        errorMessage: `additionalCards.roleName must be one of the following values: ${gameAdditionalCardsThiefRoleNames.toString()}`,
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.THIEF } },
          ]),
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.TWO_SISTERS, recipient: ROLE_NAMES.THIEF }),
          ],
        }),
        test: "one thief additional card is is not available for thief",
        errorMessage: `additionalCards.roleName must be one of the following values: ${gameAdditionalCardsThiefRoleNames.toString()}`,
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.THIEF } },
          ]),
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.DOG_WOLF, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.DOG_WOLF, recipient: ROLE_NAMES.THIEF }),
          ],
        }),
        test: "two thief additional role cards exceed the maximum occurrences in game possible",
        errorMessage: "additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: { name: ROLE_NAMES.WEREWOLF } },
            { role: { name: ROLE_NAMES.PIED_PIPER } },
            { role: { name: ROLE_NAMES.WITCH } },
            { role: { name: ROLE_NAMES.THIEF } },
          ]),
          additionalCards: [
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WITCH, recipient: ROLE_NAMES.THIEF }),
            createFakeCreateGameAdditionalCardDto({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
          ],
        }),
        test: "one thief additional role card exceeds the maximum occurrences in game possible because another player has it",
        errorMessage: "additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
    ])("should not allow game creation when $test [#$#].", async({
      payload,
      errorMessage,
    }) => {
      const response = await app.inject({
        method: "POST",
        url: "/games",
        payload,
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.json<BadRequestException>().message).toContainEqual(errorMessage);
    });

    it(`should create game when called.`, async() => {
      const payload = createFakeCreateGameDto({
        players: bulkCreateFakeCreateGamePlayerDto(6, [
          { role: { name: ROLE_NAMES.VILLAGER }, name: "Antoine" },
          { role: { name: ROLE_NAMES.WEREWOLF }, name: "Mathis" },
          { role: { name: ROLE_NAMES.VILLAGER_VILLAGER }, name: "Virgil" },
          { role: { name: ROLE_NAMES.WHITE_WEREWOLF }, name: "JB" },
          { role: { name: ROLE_NAMES.CUPID }, name: "Doudou" },
          { role: { name: ROLE_NAMES.SEER }, name: "Juju" },
        ]),
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
          isRevealed: player.role.name === ROLE_NAMES.VILLAGER_VILLAGER,
        },
        side: {
          current: [ROLE_NAMES.VILLAGER, ROLE_NAMES.VILLAGER_VILLAGER, ROLE_NAMES.CUPID, ROLE_NAMES.SEER].includes(player.role.name) ? ROLE_SIDES.VILLAGERS : ROLE_SIDES.WEREWOLVES,
          original: [ROLE_NAMES.VILLAGER, ROLE_NAMES.VILLAGER_VILLAGER, ROLE_NAMES.CUPID, ROLE_NAMES.SEER].includes(player.role.name) ? ROLE_SIDES.VILLAGERS : ROLE_SIDES.WEREWOLVES,
        },
        attributes: [],
        position: index,
        isAlive: true,
      }));
      const expectedGame: Game = {
        _id: expect.any(String) as Types.ObjectId,
        phase: GAME_PHASES.NIGHT,
        status: GAME_STATUSES.PLAYING,
        turn: 1,
        tick: 1,
        players: expectedPlayers,
        currentPlay: {
          action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
          source: { name: PLAYER_GROUPS.ALL, players: expectedPlayers },
        },
        upcomingPlays: toJSON([
          createFakeGamePlayCupidCharms(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayLoversMeetEachOther(),
          createFakeGamePlayWerewolvesEat(),
          createFakeGamePlayWhiteWerewolfEats(),
        ]) as GamePlay[],
        options: defaultGameOptions,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      };

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json()).toStrictEqual<Game>(expectedGame);
    });
    
    it(`should create game with additional cards when thief is in the game.`, async() => {
      const payload = createFakeCreateGameDto({
        players: bulkCreateFakeCreateGamePlayerDto(6, [
          { role: { name: ROLE_NAMES.THIEF }, name: "Antoine" },
          { role: { name: ROLE_NAMES.WEREWOLF }, name: "Mathis" },
          { role: { name: ROLE_NAMES.VILLAGER_VILLAGER }, name: "Virgil" },
          { role: { name: ROLE_NAMES.WHITE_WEREWOLF }, name: "JB" },
          { role: { name: ROLE_NAMES.CUPID }, name: "Doudou" },
          { role: { name: ROLE_NAMES.SEER }, name: "Juju" },
        ]),
        additionalCards: [
          createFakeGameAdditionalCard({ roleName: ROLE_NAMES.WEREWOLF, recipient: ROLE_NAMES.THIEF }),
          createFakeGameAdditionalCard({ roleName: ROLE_NAMES.VILE_FATHER_OF_WOLVES, recipient: ROLE_NAMES.THIEF }),
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
          isRevealed: player.role.name === ROLE_NAMES.VILLAGER_VILLAGER,
        },
        side: {
          current: [ROLE_NAMES.VILLAGER, ROLE_NAMES.VILLAGER_VILLAGER, ROLE_NAMES.CUPID, ROLE_NAMES.SEER, ROLE_NAMES.THIEF].includes(player.role.name) ? ROLE_SIDES.VILLAGERS : ROLE_SIDES.WEREWOLVES,
          original: [ROLE_NAMES.VILLAGER, ROLE_NAMES.VILLAGER_VILLAGER, ROLE_NAMES.CUPID, ROLE_NAMES.SEER, ROLE_NAMES.THIEF].includes(player.role.name) ? ROLE_SIDES.VILLAGERS : ROLE_SIDES.WEREWOLVES,
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
      const expectedGame: Game = {
        _id: expect.any(String) as Types.ObjectId,
        phase: GAME_PHASES.NIGHT,
        status: GAME_STATUSES.PLAYING,
        turn: 1,
        tick: 1,
        players: expectedPlayers,
        currentPlay: {
          action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
          source: { name: PLAYER_GROUPS.ALL, players: expectedPlayers },
        },
        upcomingPlays: toJSON([
          createFakeGamePlayThiefChoosesCard(),
          createFakeGamePlayCupidCharms(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayLoversMeetEachOther(),
          createFakeGamePlayWerewolvesEat(),
          createFakeGamePlayWhiteWerewolfEats(),
        ]) as GamePlay[],
        additionalCards: expectedGameAdditionalCards,
        options: defaultGameOptions,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      };

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json()).toStrictEqual<Game>(expectedGame);
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
              phase: GAME_PHASES.DAY,
            },
            hasDoubledVote: false,
          },
          bigBadWolf: { isPowerlessIfWerewolfDies: false },
          whiteWerewolf: { wakingUpInterval: 5 },
          seer: {
            isTalkative: false,
            canSeeRoles: false,
          },
          littleGirl: { isProtectedByGuard: true },
          guard: { canProtectTwice: true },
          ancient: {
            livesCountAgainstWerewolves: 1,
            doesTakeHisRevenge: false,
          },
          idiot: { doesDieOnAncientDeath: false },
          twoSisters: { wakingUpInterval: 0 },
          threeBrothers: { wakingUpInterval: 5 },
          fox: { isPowerlessIfMissesWerewolf: false },
          bearTamer: { doesGrowlIfInfected: false },
          stutteringJudge: { voteRequestsCount: 3 },
          wildChild: { isTransformationRevealed: true },
          dogWolf: { isChosenSideRevealed: true },
          thief: {
            mustChooseBetweenWerewolves: false,
            additionalCardsCount: 4,
          },
          piedPiper: {
            charmedPeopleCountPerNight: 1,
            isPowerlessIfInfected: false,
          },
          raven: { markPenalty: 5 },
        },
      };
      const payload = createFakeCreateGameWithPlayersDto({}, { options });
      const expectedOptions = createFakeGameOptionsDto({
        ...options,
        composition: createFakeCompositionGameOptions({ isHidden: defaultGameOptions.composition.isHidden }),
        votes: createFakeVotesGameOptions({ canBeSkipped: defaultGameOptions.votes.canBeSkipped }),
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
      const game = createFakeGameWithCurrentPlay({ status: GAME_STATUSES.CANCELED });
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
      const game = createFakeGameWithCurrentPlay({ status: GAME_STATUSES.PLAYING });
      await models.game.create(game);
      const response = await app.inject({
        method: "DELETE",
        url: `/games/${game._id.toString()}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game>()).toStrictEqual<Game>({
        ...toJSON(game) as Game,
        status: GAME_STATUSES.CANCELED,
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

    it.each<{ payload: MakeGamePlayDto; test: string; errorMessage: string }>([
      {
        payload: createFakeMakeGamePlayDto({ targets: [{ playerId: createObjectIdFromString("507f1f77bcf86cd799439011") }, { playerId: createObjectIdFromString("507f1f77bcf86cd799439011") }] }),
        test: "player ids in targets must be unique",
        errorMessage: "targets.playerId must be unique",
      },
      {
        payload: createFakeMakeGamePlayDto({
          votes: [
            { sourceId: createObjectIdFromString("507f1f77bcf86cd799439011"), targetId: createObjectIdFromString("507f1f77bcf86cd799439012") },
            { sourceId: createObjectIdFromString("507f1f77bcf86cd799439011"), targetId: createObjectIdFromString("507f1f77bcf86cd799439012") },
          ],
        }),
        test: "player ids in targets must be unique",
        errorMessage: "votes.sourceId must be unique",
      },
    ])("should not allow game play when $test [#$#].", async({
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
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({
        status: GAME_STATUSES.PLAYING,
        upcomingPlays: [createFakeGamePlayAllVote()],
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
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const game = createFakeGame({
        status: GAME_STATUSES.PLAYING,
        currentPlay: createFakeGamePlayAllVote(),
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
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({
        status: GAME_STATUSES.PLAYING,
        currentPlay: createFakeGamePlayAllVote({ source: createFakeGamePlaySource({ name: PLAYER_GROUPS.ALL, players }) }),
        upcomingPlays: [createFakeGamePlaySeerLooks()],
        players,
      });
      await models.game.create(game);
      const payload = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: players[0]._id, targetId: players[1]._id },
          { sourceId: players[1]._id, targetId: players[0]._id },
        ],
      });
      const expectedCurrentPlay = createFakeGamePlayAllVote({
        cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES,
        source: createFakeGamePlaySource({ name: PLAYER_GROUPS.ALL, players }),
      });
      const expectedGame = createFakeGame({
        ...game,
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
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
    
    it("should make a game play when called with targets.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({
        status: GAME_STATUSES.PLAYING,
        currentPlay: createFakeGamePlaySeerLooks({ source: createFakeGamePlaySource({ name: ROLE_NAMES.SEER, players: [players[1]] }) }),
        upcomingPlays: [createFakeGamePlayWerewolvesEat()],
        players,
      });
      await models.game.create(game);
      const payload = createFakeMakeGamePlayDto({ targets: [{ playerId: players[0]._id }] });
      const expectedCurrentPlay = createFakeGamePlayWerewolvesEat({
        source: createFakeGamePlaySource({
          name: PLAYER_GROUPS.WEREWOLVES,
          players: [createFakePlayer({ ...players[0], attributes: [createFakeSeenBySeerPlayerAttribute()] }), players[3]],
        }),
      });
      const expectedGame = createFakeGame({
        ...game,
        tick: game.tick + 1,
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
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });

  describe("GET /games/:id/history", () => {
    afterEach(async() => {
      await models.gameHistoryRecord.deleteMany();
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
      const game = createFakeGameWithCurrentPlay();
      const secondGame = createFakeGameWithCurrentPlay();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: game._id }),
        createFakeGameHistoryRecord({ gameId: game._id }),
        createFakeGameHistoryRecord({ gameId: game._id }),
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
      const game = createFakeGameWithCurrentPlay();
      const secondGame = createFakeGameWithCurrentPlay();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: game._id }),
        createFakeGameHistoryRecord({ gameId: game._id }),
        createFakeGameHistoryRecord({ gameId: game._id }),
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
  });
});