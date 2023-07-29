import { faker } from "@faker-js/faker";
import type { BadRequestException, NotFoundException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model, Types } from "mongoose";
import { stringify } from "qs";
import { defaultGameOptions } from "../../../../../../src/modules/game/constants/game-options/game-options.constant";
import type { CreateGamePlayerDto } from "../../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../../../../../../src/modules/game/dto/create-game/create-game.dto";
import type { GetGameRandomCompositionDto } from "../../../../../../src/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import type { MakeGamePlayDto } from "../../../../../../src/modules/game/dto/make-game-play/make-game-play.dto";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../../../../../../src/modules/game/enums/game-play.enum";
import { GAME_PHASES, GAME_STATUSES } from "../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import { GameModule } from "../../../../../../src/modules/game/game.module";
import type { GameOptions } from "../../../../../../src/modules/game/schemas/game-options/game-options.schema";
import { Game } from "../../../../../../src/modules/game/schemas/game.schema";
import type { Player } from "../../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../src/modules/role/enums/role.enum";
import { E2eTestModule } from "../../../../../../src/modules/test/e2e-test.module";
import { fastifyServerDefaultOptions } from "../../../../../../src/server/constants/server.constant";
import { createFakeGameOptionsDto } from "../../../../../factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto, createFakeCreateGameWithPlayersDto } from "../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayDto } from "../../../../../factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGamePlayAllVote, createFakeGamePlaySeerLooks, createFakeGamePlayWerewolvesEat } from "../../../../../factories/game/schemas/game-play/game-play.schema.factory";
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
  let models: { game: Model<Game> };

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        E2eTestModule,
        GameModule,
      ],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter(fastifyServerDefaultOptions));
    models = { game: module.get<Model<Game>>(getModelToken(Game.name)) };

    await initNestApp(app);
  });

  afterEach(async() => {
    await models.game.deleteMany();
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

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json()).toStrictEqual<Game>({
        _id: expect.any(String) as Types.ObjectId,
        phase: GAME_PHASES.NIGHT,
        status: GAME_STATUSES.PLAYING,
        turn: 1,
        tick: 1,
        players: expectedPlayers,
        currentPlay: { source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.ELECT_SHERIFF },
        upcomingPlays: [
          { source: ROLE_NAMES.CUPID, action: GAME_PLAY_ACTIONS.CHARM },
          { source: ROLE_NAMES.SEER, action: GAME_PLAY_ACTIONS.LOOK },
          { source: PLAYER_GROUPS.LOVERS, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER },
          { source: PLAYER_GROUPS.WEREWOLVES, action: GAME_PLAY_ACTIONS.EAT },
          { source: ROLE_NAMES.WHITE_WEREWOLF, action: GAME_PLAY_ACTIONS.EAT },
        ],
        options: defaultGameOptions,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });

    it(`should create game with different options when called with options specified and some omitted.`, async() => {
      const options: Partial<GameOptions> = {
        roles: {
          areRevealedOnDeath: false,
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
      const expectedOptions = createFakeGameOptionsDto({ ...options, composition: { isHidden: defaultGameOptions.composition.isHidden } });
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
      const game = createFakeGame({
        status: GAME_STATUSES.PLAYING,
        currentPlay: createFakeGamePlayAllVote(),
        players,
      });
      await models.game.create(game);
      const payload = createFakeMakeGamePlayDto({ targets: [{ playerId: players[0]._id }] });
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
        currentPlay: createFakeGamePlayAllVote(),
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
      const expectedGame = createFakeGame({
        ...game,
        tick: game.tick + 1,
        currentPlay: createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES }),
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
        currentPlay: createFakeGamePlaySeerLooks(),
        upcomingPlays: [createFakeGamePlayWerewolvesEat()],
        players,
      });
      await models.game.create(game);
      const payload = createFakeMakeGamePlayDto({ targets: [{ playerId: players[0]._id }] });
      const expectedGame = createFakeGame({
        ...game,
        tick: game.tick + 1,
        currentPlay: createFakeGamePlayWerewolvesEat(),
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
});