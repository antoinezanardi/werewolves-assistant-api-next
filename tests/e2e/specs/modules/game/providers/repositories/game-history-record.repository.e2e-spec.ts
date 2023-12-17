import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import type { Model, Types } from "mongoose";

import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.type";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import type { RoleSides } from "@/modules/role/enums/role.enum";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { ApiSortOrder } from "@/shared/api/enums/api.enum";
import { toJSON } from "@/shared/misc/helpers/object.helper";

import { truncateAllCollections } from "@tests/e2e/helpers/mongoose.helper";
import { initNestApp } from "@tests/e2e/helpers/nest-app.helper";
import { createFakeGetGameHistoryDto } from "@tests/factories/game/dto/get-game-history/get-game-history.dto.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordBigBadWolfEatPlay, createFakeGameHistoryRecordDefenderProtectPlay, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordPlayVoting, createFakeGameHistoryRecordStutteringJudgeChooseSignPlay, createFakeGameHistoryRecordSurvivorsElectSheriffPlay, createFakeGameHistoryRecordSurvivorsVotePlay, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePlayCupidCharms, createFakeGamePlayPiedPiperCharms } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeAccursedWolfFatherAlivePlayer, createFakeElderAlivePlayer, createFakeSeerAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
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
        toInsert: createFakeGameHistoryRecord({ phase: "Noon" as GamePhases }),
        errorMessage: "GameHistoryRecord validation failed: phase: `Noon` is not a valid enum value for path `phase`.",
      },
      {
        test: "should not create history record when players in play's source is empty.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ source: { name: PlayerAttributeNames.SHERIFF, players: [] } }) }),
        errorMessage: "GameHistoryRecord validation failed: play.source.players: Path `play.source.players` length is less than minimum allowed value (1).",
      },
      {
        test: "should not create history record when source in play's source is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ source: { name: "Bad source" as GamePlaySourceName, players: [createFakePlayer()] } }) }),
        errorMessage: "GameHistoryRecord validation failed: play.source.name: `Bad source` is not a valid enum value for path `name`.",
      },
      {
        test: "should not create history record when potion in play's target is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: createFakePlayer(), drankPotion: "Love Potion" as WitchPotions }] }) }),
        errorMessage: "GameHistoryRecord validation failed: play.targets.0.drankPotion: `Love Potion` is not a valid enum value for path `drankPotion`.",
      },
      {
        test: "should not create history record when voting result is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: createFakeGameHistoryRecordPlayVoting({ result: "President election" as GameHistoryRecordVotingResults }) }) }),
        errorMessage: "GameHistoryRecord validation failed: play.voting.result: `President election` is not a valid enum value for path `result`.",
      },
      {
        test: "should not create history record when chosen side is not in enum.",
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ chosenSide: "Dark side" as RoleSides }) }),
        errorMessage: "GameHistoryRecord validation failed: play.chosenSide: `Dark side` is not a valid enum value for path `chosenSide`.",
      },
    ])("$test", async({ toInsert, errorMessage }) => {
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert(toInsert);

      await expect(repositories.gameHistoryRecord.create(gameHistoryRecordToInsert)).rejects.toThrow(errorMessage);
    });

    it("should create history record when called.", async() => {
      const gameHistoryRecordPlayToInsert = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ name: RoleNames.SEER, players: [createFakePlayer()] }) });
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
              name: RoleNames.DEFENDER,
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
              name: RoleNames.DEFENDER,
              players,
            }),
          }),
          createdAt: new Date("2020-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
          createdAt: new Date("2021-01-01"),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.DEFENDER,
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
              name: RoleNames.DEFENDER,
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

  describe("getLastGameHistoryTieInVotesRecord", () => {
    it("should return no record when there is no vote play in the history.", async() => {
      const gameId = createFakeObjectId();
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, GamePlayActions.VOTE)).resolves.toBeNull();
    });

    it("should return no record when there is no tie in vote play in the history.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GameHistoryRecordVotingResults.DEATH });
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, GamePlayActions.VOTE)).resolves.toBeNull();
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GameHistoryRecordVotingResults.TIE });
      await populate([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(otherGameId, GamePlayActions.VOTE)).resolves.toBeNull();
    });

    it("should return the last tie in vote game history play record when called.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GameHistoryRecordVotingResults.TIE });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2020-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2021-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2024-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsElectSheriffPlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2025-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, GamePlayActions.VOTE);

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
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GameHistoryRecordVotingResults.TIE });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({
            source: createFakeGameHistoryRecordPlaySource({
              name: PlayerGroups.WEREWOLVES,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, WitchPotions.LIFE);

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
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.DEATH })],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.LIFE })],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
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
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, WitchPotions.LIFE);

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
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.LIFE })],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.LIFE }),
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.DEATH }),
            ],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.LIFE })],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, WitchPotions.LIFE);
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
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.LIFE })],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, WitchPotions.DEATH);

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
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.DEATH })],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.LIFE }),
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.DEATH }),
            ],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WitchPotions.DEATH })],
            source: createFakeGameHistoryRecordPlaySource({
              name: RoleNames.WITCH,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, WitchPotions.DEATH);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryAccursedWolfFatherInfectedRecords", () => {
    it("should get no record when there are no eat play.", async() => {
      const accursedWolfFatherPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectedRecords(gameId, accursedWolfFatherPlayerId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of accursed wolf-father infected for this gameId when called.", async() => {
      const accursedWolfFatherPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakeAccursedWolfFatherAlivePlayer({ _id: accursedWolfFatherPlayerId }),
        createFakePlayer(),
      ];
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: false })],
            source: createFakeGameHistoryRecordPlaySource({
              name: PlayerGroups.WEREWOLVES,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: true })],
            source: createFakeGameHistoryRecordPlaySource({
              name: PlayerGroups.WEREWOLVES,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: true })],
            source: createFakeGameHistoryRecordPlaySource({
              name: PlayerGroups.WEREWOLVES,
              players: [
                createFakePlayer(),
                createFakePlayer(),
                createFakePlayer(),
              ],
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: true })],
            source: createFakeGameHistoryRecordPlaySource({
              name: PlayerGroups.WEREWOLVES,
              players,
            }),
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectedRecords(gameId, accursedWolfFatherPlayerId);
      const expectedRecords = [gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryJudgeRequestRecords", () => {
    it("should get no record when there are no vote with judge request play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryJudgeRequestRecords(gameId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of stuttering judge requesting another vote for this gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: true }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: true }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryJudgeRequestRecords(gameId);
      const expectedRecords = [gameHistoryRecords[1]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryJudgeChoosesHisSignRecords", () => {
    it("should get no records when stuttering judge did not choose his sign for game id.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordStutteringJudgeChooseSignPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordStutteringJudgeChooseSignPlay({ action: GamePlayActions.VOTE }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ action: GamePlayActions.CHOOSE_SIGN }) }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryJudgeChoosesHisSignRecords(gameId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records when stuttering judge chose his sign for game id.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordStutteringJudgeChooseSignPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordStutteringJudgeChooseSignPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordStutteringJudgeChooseSignPlay({ action: GamePlayActions.VOTE }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ action: GamePlayActions.CHOOSE_SIGN }) }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryJudgeChoosesHisSignRecords(gameId);
      const expectedRecords = [gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryWerewolvesEatElderRecords", () => {
    it("should get no record when there are no eat play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordDefenderProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWerewolvesEatElderRecords(gameId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of elder eaten by any kind of werewolves for this gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeWitchAlivePlayer() }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordBigBadWolfEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeWitchAlivePlayer() }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordBigBadWolfEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWerewolvesEatElderRecords(gameId);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[3]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryElderProtectedFromWerewolvesRecords", () => {
    it("should get game history where elder is protected from werewolves records for gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: false }), createdAt: new Date("2023-01-01") }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId: otherGameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() })] }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordDefenderProtectPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() })] }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer(), drankPotion: WitchPotions.LIFE }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer(), drankPotion: WitchPotions.DEATH }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId,
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer(), drankPotion: WitchPotions.DEATH }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer(), drankPotion: WitchPotions.LIFE }),
            ],
          }),
        }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryElderProtectedFromWerewolvesRecords(gameId);
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
      const play = createFakeGameHistoryRecordPlay({ source: createFakeGameHistoryRecordPlaySource({ name: PlayerGroups.WEREWOLVES }) });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: GamePhases.DAY, play }),
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: GamePhases.NIGHT, play }),
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: GamePhases.DAY, play }),
        createFakeGameHistoryRecord({ gameId, turn: 2, phase: GamePhases.DAY, play }),
        createFakeGameHistoryRecord({ gameId, turn: 1, phase: GamePhases.DAY, play }),
        createFakeGameHistoryRecord({ gameId: otherGameId, phase: GamePhases.DAY, turn: 1, play }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryPhaseRecords(gameId, 1, GamePhases.DAY);
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
          action: GamePlayActions.CHARM,
          source: createFakeGameHistoryRecordPlaySource({ name: RoleNames.CUPID }),
        }),
      }),
      createFakeGameHistoryRecord({
        gameId: otherGameId,
        play: createFakeGameHistoryRecordPlay({
          action: GamePlayActions.CHARM,
          source: createFakeGameHistoryRecordPlaySource({ name: RoleNames.PIED_PIPER }),
        }),
      }),
      createFakeGameHistoryRecord({
        gameId,
        play: createFakeGameHistoryRecordPlay({
          action: GamePlayActions.CHARM,
          source: createFakeGameHistoryRecordPlaySource({ name: RoleNames.CUPID }),
          cause: GamePlayCauses.ANGEL_PRESENCE,
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
        gamePlay: createFakeGamePlayCupidCharms({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        expectedRecords: [gameHistoryRecords[2]],
      },
    ])(`$test`, async({ gameId: id, gamePlay, expectedRecords }) => {
      const records = await repositories.gameHistoryRecord.getGameHistoryGamePlayRecords(id, gamePlay);
      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });
});