import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { instanceToPlain } from "class-transformer";
import type { Model } from "mongoose";
import type { GAME_PHASES } from "../../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../src/modules/game/enums/player.enum";
import { GameModule } from "../../../../../../../src/modules/game/game.module";
import { GameHistoryRecordRepository } from "../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameHistoryRecord } from "../../../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordToInsert } from "../../../../../../../src/modules/game/types/game-history-record.type";
import { E2eTestModule } from "../../../../../../../src/modules/test/e2e-test.module";
import { fastifyServerDefaultOptions } from "../../../../../../../src/server/constants/server.constant";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay } from "../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "../../../../../../factories/game/types/game-history-record/game-history-record.type.factory";

describe("Game History Record Repository", () => {
  let app: NestFastifyApplication;
  let model: Model<GameHistoryRecord>;
  let repository: GameHistoryRecordRepository;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, GameModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter(fastifyServerDefaultOptions));
    repository = app.get<GameHistoryRecordRepository>(GameHistoryRecordRepository);
    model = module.get<Model<GameHistoryRecord>>(getModelToken(GameHistoryRecord.name));
  });

  afterEach(async() => {
    await model.deleteMany();
  });

  afterAll(async() => {
    await app.close();
  });

  describe("create", () => {
    it.each<{ toInsert: GameHistoryRecordToInsert; errorMessage: string; test: string }>([
      {
        toInsert: createFakeGameHistoryRecord({ gameId: "123" }),
        errorMessage: "GameHistoryRecord validation failed: gameId: Cast to ObjectId failed",
        test: "gameId is not a valid ObjectId",
      },
      {
        toInsert: createFakeGameHistoryRecord({ turn: 0 }),
        errorMessage: "GameHistoryRecord validation failed: turn: Path `turn` (0) is less than minimum allowed value (1).",
        test: "turn is lower than 1",
      },
      {
        toInsert: createFakeGameHistoryRecord({ tick: -1 }),
        errorMessage: "GameHistoryRecord validation failed: tick: Path `tick` (-1) is less than minimum allowed value (1).",
        test: "tick is lower than 1",
      },
      {
        toInsert: createFakeGameHistoryRecord({ phase: "Noon" as GAME_PHASES }),
        errorMessage: "GameHistoryRecord validation failed: phase: `Noon` is not a valid enum value for path `phase`.",
        test: "phase is not in enum",
      },
      {
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ source: { name: PLAYER_ATTRIBUTE_NAMES.SHERIFF, players: [] } }) }),
        errorMessage: "GameHistoryRecord validation failed: play.source.players: Path `play.source.players` length is less than minimum allowed value (1).",
        test: "players in play's source is empty",
      },
    ])("should not create history record when $test [#$#].", async({ toInsert, errorMessage }) => {
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert(toInsert);
      await expect(repository.create(gameHistoryRecordToInsert)).rejects.toThrow(errorMessage);
    });

    it("should create history record when called.", async() => {
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      const gameHistoryRecord = await repository.create(gameHistoryRecordToInsert);
      expect(JSON.parse(JSON.stringify(gameHistoryRecord))).toMatchObject<GameHistoryRecord>({
        ...instanceToPlain(gameHistoryRecordToInsert, { excludeExtraneousValues: true }) as GameHistoryRecordToInsert,
        _id: expect.any(String) as string,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });
});