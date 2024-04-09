import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import type { Model, Types } from "mongoose";

import type { RoleSide } from "@/modules/role/types/role.types";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { GameHistoryRecordToInsert, GameHistoryRecordVotingResult } from "@/modules/game/types/game-history-record/game-history-record.types";
import type { GamePlaySourceName, WitchPotion } from "@/modules/game/types/game-play/game-play.types";
import type { GamePhase } from "@/modules/game/types/game.types";

import { ApiSortOrder } from "@/shared/api/enums/api.enums";
import { toJSON } from "@/shared/misc/helpers/object.helpers";

import { truncateAllCollections } from "@tests/e2e/helpers/mongoose.helpers";
import { initNestApp } from "@tests/e2e/helpers/nest-app.helpers";
import { createFakeGetGameHistoryDto } from "@tests/factories/game/dto/get-game-history/get-game-history.dto.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay, createFakeGameHistoryRecordBigBadWolfEatPlay, createFakeGameHistoryRecordDefenderProtectPlay, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordPlayVoting, createFakeGameHistoryRecordStutteringJudgeRequestsAnotherVotePlay, createFakeGameHistoryRecordSurvivorsElectSheriffPlay, createFakeGameHistoryRecordSurvivorsVotePlay, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePlayCupidCharms, createFakeGamePlayPiedPiperCharms, createFakeGamePlayWerewolvesEat } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeElderAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game History Record Repository", () => {
  let app: NestFastifyApplication;
  let testingModule: TestingModule;
  let models: { gameHistoryRecord: Model<GameHistoryRecord> };
  let repositories: { gameHistoryRecord: GameHistoryRecordRepository };

  beforeAll(async() => {
    const { app: server, module } = await initNestApp();
    app = server;
    testingModule = module;

    repositories = { gameHistoryRecord: app.get<GameHistoryRecordRepository>(GameHistoryRecordRepository) };
    models = { gameHistoryRecord: module.get<Model<GameHistoryRecord>>(getModelToken(GameHistoryRecord.name)) };
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

  async function populate(gameHistoryRecords: GameHistoryRecord[]): Promise<GameHistoryRecord[]> {
    return models.gameHistoryRecord.insertMany(gameHistoryRecords);
  }

  describe("getGameHistory", () => {
    it("should get nothing when there are no record.", async() => {
      const gameId = createFakeObjectId();
      const getGameHistoryDto = createFakeGetGameHistoryDto();

      await expect(repositories.gameHistoryRecord.getGameHistory(gameId, getGameHistoryDto)).resolves.toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get all ascending records when called with gameId with records with default get game history dto.", async() => {
      const gameId = createFakeObjectId();
      const getGameHistoryDto = createFakeGetGameHistoryDto();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2023-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistory(gameId, getGameHistoryDto);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(gameHistoryRecords) as GameHistoryRecord[]);
    });

    it("should get only one record when called with get game history dto limit set to 1.", async() => {
      const gameId = createFakeObjectId();
      const getGameHistoryDto = createFakeGetGameHistoryDto({ limit: 1 });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsElectSheriffPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay(), createdAt: new Date("2023-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2024-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistory(gameId, getGameHistoryDto);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([toJSON(gameHistoryRecords[0]) as GameHistoryRecord]);
    });

    it("should get records in descending order when called with get game history dto order set to DESC.", async() => {
      const gameId = createFakeObjectId();
      const getGameHistoryDto = createFakeGetGameHistoryDto({ order: ApiSortOrder.DESC });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsElectSheriffPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay(), createdAt: new Date("2023-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2024-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistory(gameId, getGameHistoryDto);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(gameHistoryRecords.reverse()) as GameHistoryRecord[]);
    });
  });

  describe("create", () => {
    it.each<{
      test: string;
      toInsert: GameHistoryRecordToInsert;
      errorMessage: string;
    }>([
      {
        test: "should not create history record when turn is lower than 1.",
        toInsert: createFakeGameHistoryRecord({ turn: 0 }),
        errorMessage: "GameHistoryRecord validation failed: turn: Path `turn` (0) is less than minimum allowed value (1).",
      },
      {
        test: "should not create history record when tick is lower than 1.",
        toInsert: createFakeGameHistoryRecord({ tick: -1 }),
        errorMessage: "GameHistoryRecord validation failed: tick: Path `tick` (-1) is less than minimum allowed value (1).",
      },
      {
        test: "should not create history record when phase is not in enum.",
        toInsert: createFakeGameHistoryRecord({ phase: "Noon" as GamePhase }),
        errorMessage: "GameHistoryRecord validation failed: phase: `Noon` is not a valid enum value for path `phase`.",
      },
      {
        test: "should not create history record when players in play's source is empty.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ source: { name: "sheriff", players: [] } }) }),
        errorMessage: "GameHistoryRecord validation failed: play.source.players: Path `play.source.players` length is less than minimum allowed value (1).",
      },
      {
        test: "should not create history record when source in play's source is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ source: { name: "Bad source" as GamePlaySourceName, players: [createFakePlayer()] } }) }),
        errorMessage: "GameHistoryRecord validation failed: play.source.name: `Bad source` is not a valid enum value for path `name`.",
      },
      {
        test: "should not create history record when potion in play's target is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: createFakePlayer(), drankPotion: "Love Potion" as WitchPotion }] }) }),
        errorMessage: "GameHistoryRecord validation failed: play.targets.0.drankPotion: `Love Potion` is not a valid enum value for path `drankPotion`.",
      },
      {
        test: "should not create history record when voting result is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: createFakeGameHistoryRecordPlayVoting({ result: "President election" as GameHistoryRecordVotingResult }) }) }),
        errorMessage: "GameHistoryRecord validation failed: play.voting.result: `President election` is not a valid enum value for path `result`.",
      },
      {
        test: "should not create history record when chosen side is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ chosenSide: "Dark side" as RoleSide }) }),
        errorMessage: "GameHistoryRecord validation failed: play.chosenSide: `Dark side` is not a valid enum value for path `chosenSide`.",
      },
    ])("$test", async({ toInsert, errorMessage }) => {
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert(toInsert);

      await expect(repositories.gameHistoryRecord.create(gameHistoryRecordToInsert)).rejects.toThrow(errorMessage);
    });

    it("should create history record when called.", async() => {
      const gameHistoryRecordPlayToInsert = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ name: "seer", players: [createFakePlayer()] }) });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlayToInsert });
      const gameHistoryRecord = await repositories.gameHistoryRecord.create(gameHistoryRecordToInsert);

      expect(toJSON(gameHistoryRecord)).toStrictEqual<GameHistoryRecord>({
        ...(toJSON(gameHistoryRecordToInsert) as GameHistoryRecordToInsert),
        _id: expect.any(String) as Types.ObjectId,
        createdAt: expect.any(String) as Date,
      });
    });
  });

  describe("getLastGameHistoryDefenderProtectsRecord", () => {
    it("should return no record when there is no defender play in the history.", async() => {
      const defenderPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryDefenderProtectsRecord(gameId, defenderPlayerId)).resolves.toBeNull();
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const defenderPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer({ _id: defenderPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordDefenderProtectPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "defender",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryDefenderProtectsRecord(otherGameId, defenderPlayerId)).resolves.toBeNull();
    });

    it("should return the last defender game history play record when called.", async() => {
      const defenderPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer({ _id: defenderPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "defender",
              players,
            }),
          }),
          createdAt: new Date("2020-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
          createdAt: new Date("2021-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "defender",
              players,
            }),
          }),
          createdAt: new Date("2022-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay(),
          createdAt: new Date("2023-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "defender",
              players: [createFakePlayer()],
            }),
          }),
          createdAt: new Date("2024-01-01"),
        }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getLastGameHistoryDefenderProtectsRecord(gameId, defenderPlayerId);

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[2]) as GameHistoryRecord);
    });
  });

  describe("getLastGameHistorySurvivorsVoteRecord", () => {
    it("should return no record when there is no defender play in the history.", async() => {
      const gameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistorySurvivorsVoteRecord(gameId)).resolves.toBeNull();
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordSurvivorsVotePlay(),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistorySurvivorsVoteRecord(otherGameId)).resolves.toBeNull();
    });

    it("should one record when game history contains one survivors vote.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay(),
          createdAt: new Date("2019-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordSurvivorsVotePlay(),
          createdAt: new Date("2020-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordSurvivorsVotePlay(),
          createdAt: new Date("2021-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordSurvivorsVotePlay(),
          createdAt: new Date("2022-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordSurvivorsElectSheriffPlay(),
          createdAt: new Date("2023-01-01"),
        }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getLastGameHistorySurvivorsVoteRecord(gameId);

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[2]) as GameHistoryRecord);
    });
  });

  describe("getLastGameHistoryTieInVotesRecord", () => {
    it("should return no record when there is no vote play in the history.", async() => {
      const gameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, "vote")).resolves.toBeNull();
    });

    it("should return no record when there is no tie in vote play in the history.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: "death" });
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, "vote")).resolves.toBeNull();
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: "tie" });
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(otherGameId, "vote")).resolves.toBeNull();
    });

    it("should return the last tie in vote game history play record when called.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: "tie" });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2020-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2021-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2024-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsElectSheriffPlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2025-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, "vote");

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[3]) as GameHistoryRecord);
    });
  });

  describe("getGameHistoryWitchUsesSpecificPotionRecords", () => {
    it("should get no record when there are no witch play.", async() => {
      const witchPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeWitchAlivePlayer({ _id: witchPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: "tie" });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "werewolves",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, "life");

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get no record when there are no witch using life potion play.", async() => {
      const witchPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeWitchAlivePlayer({ _id: witchPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: "death" })],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: "life" })],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players: [
                createFakePlayer(),
                createFakePlayer(),
                createFakePlayer(),
              ],
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, "life");

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of witch using life potion for this gameId when called.", async() => {
      const witchPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeWitchAlivePlayer({ _id: witchPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: "life" })],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ drankPotion: "life" }),
              createFakeGameHistoryRecordPlayTarget({ drankPotion: "death" }),
            ],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: "life" })],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, "life");
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });

    it("should get no record when there are no witch using death potion play.", async() => {
      const witchPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeWitchAlivePlayer({ _id: witchPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: "life" })],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, "death");

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of witch using death potion for this gameId when called.", async() => {
      const witchPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeWitchAlivePlayer({ _id: witchPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: "death" })],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ drankPotion: "life" }),
              createFakeGameHistoryRecordPlayTarget({ drankPotion: "death" }),
            ],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: "death" })],
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, "death");
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryAccursedWolfFatherInfectsWithTargetRecords", () => {
    it("should return no record when there is no infect play in the history.", async() => {
      const accursedWolfFatherId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakePlayer() })] }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakePlayer() })] }),
        }),
      ]);
      const records = await repositories.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(gameId, accursedWolfFatherId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const accursedWolfFatherId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer({ _id: accursedWolfFatherId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players: [players[1]],
            }),
            targets: [createFakeGameHistoryRecordPlayTarget({ player: players[2] })],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);
      const records = await repositories.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(otherGameId, accursedWolfFatherId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should return records of accursed wolf father infecting with target for this gameId when called.", async() => {
      const accursedWolfFatherId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer({ _id: accursedWolfFatherId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players: [players[1]],
            }),
            targets: [createFakeGameHistoryRecordPlayTarget({ player: players[2] })],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players: [players[1]],
            }),
            targets: [createFakeGameHistoryRecordPlayTarget({ player: players[2] })],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players: [players[1]],
            }),
            targets: [createFakeGameHistoryRecordPlayTarget({ player: players[2] })],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay(),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players: [createFakePlayer()],
            }),
            targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakePlayer() })],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players: [players[1]],
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players: [players[1]],
            }),
            targets: [],
          }),
        }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(gameId, accursedWolfFatherId);
      const expectedRecords = [gameHistoryRecords[0], gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getLastGameHistoryAccursedWolfFatherInfectsRecord", () => {
    it("should return no record when there is no infect play in the history.", async() => {
      const accursedWolfFatherId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryAccursedWolfFatherInfectsRecord(gameId, accursedWolfFatherId)).resolves.toBeNull();
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const accursedWolfFatherId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer({ _id: accursedWolfFatherId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryAccursedWolfFatherInfectsRecord(otherGameId, accursedWolfFatherId)).resolves.toBeNull();
    });

    it("should return the last accursed wolf father infects game history play record when called.", async() => {
      const accursedWolfFatherId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer({ _id: accursedWolfFatherId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players,
            }),
          }),
          createdAt: new Date("2020-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "witch",
              players,
            }),
          }),
          createdAt: new Date("2021-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players,
            }),
          }),
          createdAt: new Date("2022-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay(),
          createdAt: new Date("2023-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "accursed-wolf-father",
              players: [createFakePlayer()],
            }),
          }),
          createdAt: new Date("2024-01-01"),
        }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getLastGameHistoryAccursedWolfFatherInfectsRecord(gameId, accursedWolfFatherId);

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[2]) as GameHistoryRecord);
    });
  });

  describe("getGameHistoryStutteringJudgeRequestsAnotherVoteRecords", () => {
    it("should get no record when there are no vote with judge request play.", async() => {
      const stutteringJudgePlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeStutteringJudgeAlivePlayer({ _id: stutteringJudgePlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "survivors",
              players: [
                players[1],
                players[2],
              ],
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryStutteringJudgeRequestsAnotherVoteRecords(gameId, stutteringJudgePlayerId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of stuttering judge requesting another vote for this gameId when called.", async() => {
      const stutteringJudgePlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeStutteringJudgeAlivePlayer({ _id: stutteringJudgePlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: true }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordStutteringJudgeRequestsAnotherVotePlay({
            didJudgeRequestAnotherVote: true,
            source: createFakeGameHistoryRecordPlaySource({
              name: "stuttering-judge",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordStutteringJudgeRequestsAnotherVotePlay({
            didJudgeRequestAnotherVote: false,
            source: createFakeGameHistoryRecordPlaySource({
              name: "stuttering-judge",
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordStutteringJudgeRequestsAnotherVotePlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: "stuttering-judge",
              players,
            }),
            didJudgeRequestAnotherVote: true,
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordStutteringJudgeRequestsAnotherVotePlay({
            didJudgeRequestAnotherVote: true,
            source: createFakeGameHistoryRecordPlaySource({
              name: "stuttering-judge",
              players: [
                createFakePlayer(),
                createFakePlayer(),
              ],
            }),
          }),
        }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryStutteringJudgeRequestsAnotherVoteRecords(gameId, stutteringJudgePlayerId);
      const expectedRecords = [gameHistoryRecords[1]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryWerewolvesEatElderRecords", () => {
    it("should get no record when there are no eat play.", async() => {
      const elderPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWerewolvesEatElderRecords(gameId, elderPlayerId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of elder eaten by any kind of werewolves for this gameId when called.", async() => {
      const elderPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeElderAlivePlayer({ _id: elderPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: players[1] }),
              createFakeGameHistoryRecordPlayTarget({ player: players[0] }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordBigBadWolfEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: players[1] })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: players[1] }),
              createFakeGameHistoryRecordPlayTarget({ player: players[0] }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordBigBadWolfEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: players[0] })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: players[2] }),
              createFakeGameHistoryRecordPlayTarget({ player: players[0] }),
            ],
          }),
        }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWerewolvesEatElderRecords(gameId, elderPlayerId);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[3]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryElderProtectedFromWerewolvesRecords", () => {
    it("should get game history where elder is protected from werewolves records for gameId when called.", async() => {
      const elderPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeElderAlivePlayer({ _id: elderPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }), createdAt: new Date("2023-01-01") }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: players[0] }),
              createFakeGameHistoryRecordPlayTarget({ player: players[1] }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: players[1] })] }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: players[0] })] }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: players[0], drankPotion: "life" }),
              createFakeGameHistoryRecordPlayTarget({ player: players[1], drankPotion: "death" }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: players[0], drankPotion: "death" }),
              createFakeGameHistoryRecordPlayTarget({ player: players[1], drankPotion: "life" }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: players[0] }),
              createFakeGameHistoryRecordPlayTarget({ player: players[2] }),
            ],
          }),
        }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryElderProtectedFromWerewolvesRecords(gameId, elderPlayerId);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[5]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getPreviousGameHistoryRecord", () => {
    it("should get no record when game doesn't have history yet.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(toJSON(records)).toBeNull();
    });

    it("should get previous game history record for gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay(), createdAt: new Date("2020-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2021-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay(), createdAt: new Date("2023-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[3]) as GameHistoryRecord);
    });
  });

  describe("getGameHistoryPhaseRecords", () => {
    it("should get 3 records when called with gameId, turn and phase.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const play = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ name: "werewolves" }) });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: "day", play }),
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: "night", play }),
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: "day", play }),
        createFakeGameHistoryRecord({ gameId, turn: 2, phase: "day", play }),
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: "day", play }),
        createFakeGameHistoryRecord({ gameId: otherGameId, phase: "day", turn: 1, play }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryPhaseRecords(gameId, 1, "day");
      const expectedRecords = [gameHistoryRecords[0], gameHistoryRecords[2], gameHistoryRecords[4]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryGamePlayRecords", () => {
    const gameId = createFakeObjectId();
    const otherGameId = createFakeObjectId();
    const gameHistoryRecords = [
      createFakeGameHistoryRecord({
        gameId,
        play: createFakeGameHistoryRecordPlay({
          action: "charm",
          source: createFakeGameHistoryRecordPlaySource({ name: "cupid" }),
        }),
      }),
      createFakeGameHistoryRecord({
        gameId: otherGameId,
        play: createFakeGameHistoryRecordPlay({
          action: "charm",
          source: createFakeGameHistoryRecordPlaySource({ name: "pied-piper" }),
        }),
      }),
      createFakeGameHistoryRecord({
        gameId,
        play: createFakeGameHistoryRecordPlay({
          action: "charm",
          source: createFakeGameHistoryRecordPlaySource({ name: "cupid" }),
          cause: "angel-presence",
        }),
      }),
    ];

    beforeEach(async() => {
      await populate(gameHistoryRecords);
    });

    it.each<{
      test: string;
      gameId: Types.ObjectId;
      gamePlay: GamePlay;
      expectedRecords: GameHistoryRecord[];
    }>([
      {
        test: "should get one record when cupid charming.",
        gameId,
        gamePlay: createFakeGamePlayCupidCharms(),
        expectedRecords: [gameHistoryRecords[0]],
      },
      {
        test: "should get no record when pied-piper charming but on wrong game.",
        gameId,
        gamePlay: createFakeGamePlayPiedPiperCharms(),
        expectedRecords: [],
      },
      {
        test: "should get one record when cupid charming because of angel presence.",
        gameId,
        gamePlay: createFakeGamePlayCupidCharms({ cause: "angel-presence" }),
        expectedRecords: [gameHistoryRecords[2]],
      },
    ])(`$test`, async({ gameId: id, gamePlay, expectedRecords }) => {
      const records = await repositories.gameHistoryRecord.getGameHistoryGamePlayRecords(id, gamePlay);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryGamePlayMadeByPlayerRecords", () => {
    const gameId = createFakeObjectId();
    const otherGameId = createFakeObjectId();
    const player = createFakePlayer();

    const gameHistoryRecords = [
      createFakeGameHistoryRecord({
        gameId,
        play: createFakeGameHistoryRecordPlay({
          action: "charm",
          source: createFakeGameHistoryRecordPlaySource({
            name: "cupid",
            players: [
              createFakePlayer(),
              player,
              createFakePlayer(),
            ],
          }),
        }),
      }),
      createFakeGameHistoryRecord({
        gameId,
        play: createFakeGameHistoryRecordPlay({
          action: "eat",
          source: createFakeGameHistoryRecordPlaySource({
            name: "werewolves",
            players: [
              createFakePlayer(),
              createFakePlayer(),
            ],
          }),
        }),
      }),
      createFakeGameHistoryRecord({
        gameId: otherGameId,
        play: createFakeGameHistoryRecordPlay({
          action: "charm",
          source: createFakeGameHistoryRecordPlaySource({
            name: "pied-piper",
            players: [
              createFakePlayer(),
              player,
              createFakePlayer(),
            ],
          }),
        }),
      }),
      createFakeGameHistoryRecord({
        gameId,
        play: createFakeGameHistoryRecordPlay({
          action: "charm",
          source: createFakeGameHistoryRecordPlaySource({
            name: "cupid",
            players: [
              createFakePlayer(),
              player,
              createFakePlayer(),
            ],
          }),
          cause: "angel-presence",
        }),
      }),
    ];

    beforeEach(async() => {
      await populate(gameHistoryRecords);
    });

    it.each<{
      test: string;
      gameId: Types.ObjectId;
      gamePlay: GamePlay;
      expectedRecords: GameHistoryRecord[];
    }>([
      {
        test: "should get one record when cupid charming.",
        gameId,
        gamePlay: createFakeGamePlayCupidCharms(),
        expectedRecords: [gameHistoryRecords[0]],
      },
      {
        test: "should get no record when pied-piper charming but on wrong game.",
        gameId,
        gamePlay: createFakeGamePlayPiedPiperCharms(),
        expectedRecords: [],
      },
      {
        test: "should get no record when werewolves eating but player is not found in game play.",
        gameId,
        gamePlay: createFakeGamePlayWerewolvesEat(),
        expectedRecords: [],
      },
      {
        test: "should get one record when cupid charming because of angel presence.",
        gameId,
        gamePlay: createFakeGamePlayCupidCharms({ cause: "angel-presence" }),
        expectedRecords: [gameHistoryRecords[3]],
      },
    ])(`$test`, async({ gameId: id, gamePlay, expectedRecords }) => {
      const records = await repositories.gameHistoryRecord.getGameHistoryGamePlayMadeByPlayerRecords(id, gamePlay, player);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });
});