import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";
import type { CreateGameDto } from "../../../src/game/dto/create-game.dto";
import { GAME_PHASES, GAME_STATUSES } from "../../../src/game/enums/game.enum";
import { GameModule } from "../../../src/game/game.module";
import { Game } from "../../../src/game/schemas/game.schema";
import { E2eTestModule } from "../../../src/test/e2e-test.module";

describe("Game Module", () => {
  let app: NestFastifyApplication;
  let model: Model<Game>;

  const toCreateGames: CreateGameDto[] = [
    {},
    {},
    {},
  ];

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, GameModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    model = module.get<Model<Game>>(getModelToken(Game.name));
    await app.init();
  });

  afterEach(async() => {
    await model.deleteMany();
  });

  afterAll(async() => {
    await app.close();
  });

  describe("GET /games", () => {
    it("should get no games when no populate yet.", async() => {
      const response = await app.inject({ method: "GET", url: "/games" });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toStrictEqual<Game[]>([]);
    });

    it("should get 3 games when 3 games were created.", async() => {
      await model.create(toCreateGames);
      const response = await app.inject({ method: "GET", url: "/games" });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveLength(3);
    });
  });

  describe("POST /games", () => {
    it.each([
      { toCreate: toCreateGames[0] },
      { toCreate: toCreateGames[1] },
      { toCreate: toCreateGames[2] },
    ])(`should create game when game to create %# is provided.`, async({ toCreate }) => {
      const response = await app.inject({ method: "POST", url: "/games", payload: toCreate });
      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        _id: expect.any(String) as string,
        phase: GAME_PHASES.NIGHT,
        status: GAME_STATUSES.PLAYING,
        turn: 1,
        tick: 1,
        createdAt: expect.any(String) as string,
        updatedAt: expect.any(String) as string,
      });
    });
  });
});