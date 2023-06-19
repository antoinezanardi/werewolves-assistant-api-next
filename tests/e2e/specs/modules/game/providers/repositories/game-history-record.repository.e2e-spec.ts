import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model, Types } from "mongoose";
import type { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../../../../../src/modules/game/enums/game-history-record.enum";
import type { WITCH_POTIONS } from "../../../../../../../src/modules/game/enums/game-play.enum";
import type { GAME_PHASES } from "../../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../src/modules/game/enums/player.enum";
import { GameModule } from "../../../../../../../src/modules/game/game.module";
import { GameHistoryRecordRepository } from "../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameHistoryRecord } from "../../../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordToInsert } from "../../../../../../../src/modules/game/types/game-history-record.type";
import type { GameSource } from "../../../../../../../src/modules/game/types/game.type";
import type { ROLE_SIDES } from "../../../../../../../src/modules/role/enums/role.enum";
import { E2eTestModule } from "../../../../../../../src/modules/test/e2e-test.module";
import { fastifyServerDefaultOptions } from "../../../../../../../src/server/constants/server.constant";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordGuardProtectPlay, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../../factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "../../../../../../factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "../../../../../../factories/shared/mongoose/mongoose.factory";
import { toJSON } from "../../../../../../helpers/object/object.helper";

describe("Game History Record Repository", () => {
  let app: NestFastifyApplication;
  let models: { gameHistoryRecord: Model<GameHistoryRecord> };
  let repositories: { gameHistoryRecord: GameHistoryRecordRepository };

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({ imports: [E2eTestModule, GameModule] }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter(fastifyServerDefaultOptions));

    repositories = { gameHistoryRecord: app.get<GameHistoryRecordRepository>(GameHistoryRecordRepository) };
    models = { gameHistoryRecord: module.get<Model<GameHistoryRecord>>(getModelToken(GameHistoryRecord.name)) };
  });

  afterEach(async() => {
    await models.gameHistoryRecord.deleteMany();
  });

  afterAll(async() => {
    await app.close();
  });

  async function populate(gameHistoryRecords: GameHistoryRecord[]): Promise<void> {
    await models.gameHistoryRecord.insertMany(gameHistoryRecords);
  }

  describe("create", () => {
    it.each<{ toInsert: GameHistoryRecordToInsert; errorMessage: string; test: string }>([
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
      {
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ source: { name: "Bad source" as GameSource, players: bulkCreateFakePlayers(1) } }) }),
        errorMessage: "GameHistoryRecord validation failed: play.source.name: `Bad source` is not a valid enum value for path `name`.",
        test: "source in play's source is not in enum",
      },
      {
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: createFakePlayer(), drankPotion: "Love Potion" as WITCH_POTIONS }] }) }),
        errorMessage: "GameHistoryRecord validation failed: play.targets.0.drankPotion: `Love Potion` is not a valid enum value for path `drankPotion`.",
        test: "potion in play's target is not in enum",
      },
      {
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ votingResult: "President election" as GAME_HISTORY_RECORD_VOTING_RESULTS }) }),
        errorMessage: "GameHistoryRecord validation failed: play.votingResult: `President election` is not a valid enum value for path `votingResult`.",
        test: "voting result is not in enum",
      },
      {
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ chosenSide: "Dark side" as ROLE_SIDES }) }),
        errorMessage: "GameHistoryRecord validation failed: play.chosenSide: `Dark side` is not a valid enum value for path `chosenSide`.",
        test: "chosen side is not in enum",
      },
    ])("should not create history record when $test [#$#].", async({ toInsert, errorMessage }) => {
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert(toInsert);

      await expect(repositories.gameHistoryRecord.create(gameHistoryRecordToInsert)).rejects.toThrow(errorMessage);
    });

    it("should create history record when called.", async() => {
      const gameHistoryRecordPlayToInsert = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ players: [createFakePlayer()] }) });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlayToInsert });
      const gameHistoryRecord = await repositories.gameHistoryRecord.create(gameHistoryRecordToInsert);

      expect(toJSON(gameHistoryRecord)).toStrictEqual<GameHistoryRecord>({
        ...(toJSON(gameHistoryRecordToInsert) as GameHistoryRecordToInsert),
        _id: expect.any(String) as Types.ObjectId,
        createdAt: expect.any(String) as Date,
        updatedAt: expect.any(String) as Date,
      });
    });
  });

  describe("getLastGameHistoryGuardProtectsRecord", () => {
    it("should return no record when there is no guard play in the history.", async() => {
      const gameId = createFakeObjectId();
      await models.gameHistoryRecord.insertMany([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);
      
      await expect(repositories.gameHistoryRecord.getLastGameHistoryGuardProtectsRecord(gameId)).resolves.toBeNull();
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      await models.gameHistoryRecord.insertMany([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryGuardProtectsRecord(otherGameId)).resolves.toBeNull();
    });

    it("should return the last guard game history play record when called.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay(), createdAt: new Date("2020-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2021-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2023-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getLastGameHistoryGuardProtectsRecord(gameId);

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[2]) as GameHistoryRecord);
    });
  });
});