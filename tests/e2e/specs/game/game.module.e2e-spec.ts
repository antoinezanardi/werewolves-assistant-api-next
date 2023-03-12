import { faker } from "@faker-js/faker";
import type { BadRequestException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";
import type { CreateGameDto } from "../../../../src/game/dto/create-game/create-game.dto";
import { GAME_PHASES, GAME_STATUSES } from "../../../../src/game/enums/game.enum";
import { GameModule } from "../../../../src/game/game.module";
import { defaultGameOptions } from "../../../../src/game/schemas/game-options/constants/game-options.constant";
import type { GameOptions } from "../../../../src/game/schemas/game-options/schemas/game-options.schema";
import { Game } from "../../../../src/game/schemas/game.schema";
import type { Player } from "../../../../src/game/schemas/player/schemas/player.schema";
import { ROLE_NAMES } from "../../../../src/role/enums/role.enum";
import { E2eTestModule } from "../../../../src/test/e2e-test.module";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "../../../factories/game/dto/create-game/create-game.dto.factory";
import { bulkCreateFakeGames } from "../../../factories/game/schemas/game.schema.factory";
import { initNestApp } from "../../helpers/nest-app.helper";

describe("Game Module", () => {
  let app: NestFastifyApplication;
  let model: Model<Game>;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        E2eTestModule,
        GameModule,
      ],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    model = module.get<Model<Game>>(getModelToken(Game.name));

    await initNestApp(app);
  });

  afterEach(async() => {
    await model.deleteMany();
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
      await model.create(bulkCreateFakeGames(3));
      const response = await app.inject({
        method: "GET",
        url: "/games",
      });
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json<Game[]>()).toHaveLength(3);
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
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(4, [{ name: faker.datatype.string(31) }]) }),
        test: "one of the player name is too long",
        errorMessage: "players.0.name must be shorter than or equal to 30 characters",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { name: "John", role: ROLE_NAMES.THREE_BROTHERS },
            { name: "John" },
          ]),
        }),
        test: "two players have the same name",
        errorMessage: "players.name must be unique",
      },
      {
        payload: createFakeCreateGameDto({ players: bulkCreateFakeCreateGamePlayerDto(4, [{ role: ROLE_NAMES.THREE_BROTHERS }]) }),
        test: "there is only one brother in the same game",
        errorMessage: "players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: ROLE_NAMES.WITCH },
            { role: ROLE_NAMES.WITCH },
          ]),
        }),
        test: "there is two witches in the same game",
        errorMessage: "players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: ROLE_NAMES.WEREWOLF },
            { role: ROLE_NAMES.WHITE_WEREWOLF },
            { role: ROLE_NAMES.WEREWOLF },
            { role: ROLE_NAMES.WEREWOLF },
          ]),
        }),
        test: "there is no villager in game's composition",
        errorMessage: "one of the players.role must have at least one role from `villagers` side",
      },
      {
        payload: createFakeCreateGameDto({
          players: bulkCreateFakeCreateGamePlayerDto(4, [
            { role: ROLE_NAMES.VILLAGER },
            { role: ROLE_NAMES.PIED_PIPER },
            { role: ROLE_NAMES.WITCH },
            { role: ROLE_NAMES.SEER },
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
            { role: ROLE_NAMES.VILLAGER, position: 0 },
            { role: ROLE_NAMES.PIED_PIPER, position: 1 },
            { role: ROLE_NAMES.WITCH, position: 2 },
            { role: ROLE_NAMES.SEER, position: 666 },
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
      const payload = createFakeCreateGameDto();
      const response = await app.inject({
        method: "POST",
        url: "/games",
        payload,
      });
      const expectedPlayers = payload.players.map<Player>(player => ({
        _id: expect.any(String) as string,
        name: player.name,
        role: player.role,
      }));
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json()).toMatchObject<Game>({
        _id: expect.any(String) as string,
        phase: GAME_PHASES.NIGHT,
        status: GAME_STATUSES.PLAYING,
        turn: 1,
        tick: 1,
        players: expectedPlayers,
        options: defaultGameOptions,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });

    it(`should create game with different options when called with options specified.`, async() => {
      const options: GameOptions = {
        composition: { isHidden: false },
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
      const payload = createFakeCreateGameDto({ options });
      const response = await app.inject({
        method: "POST",
        url: "/games",
        payload,
      });
      const expectedPlayers = payload.players.map<Player>(player => ({
        _id: expect.any(String) as string,
        name: player.name,
        role: player.role,
      }));
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.json()).toMatchObject<Game>({
        _id: expect.any(String) as string,
        phase: GAME_PHASES.NIGHT,
        status: GAME_STATUSES.PLAYING,
        turn: 1,
        tick: 1,
        players: expectedPlayers,
        options,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });
});