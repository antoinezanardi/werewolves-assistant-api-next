import { getModelToken } from "@nestjs/mongoose";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model, Types } from "mongoose";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../../../../../src/modules/game/enums/game-history-record.enum";
import { WITCH_POTIONS } from "../../../../../../../src/modules/game/enums/game-play.enum";
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
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordAllVotePlay, createFakeGameHistoryRecordBigBadWolfEatPlay, createFakeGameHistoryRecordGuardProtectPlay, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordPlayVoting, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeAncientAlivePlayer, createFakeSeerAlivePlayer, createFakeWitchAlivePlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
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

  async function populate(gameHistoryRecords: GameHistoryRecord[]): Promise<GameHistoryRecord[]> {
    return models.gameHistoryRecord.insertMany(gameHistoryRecords);
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
        toInsert: createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: createFakeGameHistoryRecordPlayVoting({ result: "President election" as GAME_HISTORY_RECORD_VOTING_RESULTS }) }) }),
        errorMessage: "GameHistoryRecord validation failed: play.voting.result: `President election` is not a valid enum value for path `result`.",
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

  describe("getLastGameHistoryTieInVotesRecord", () => {
    it("should return no record when there is no vote play in the history.", async() => {
      const gameId = createFakeObjectId();
      await models.gameHistoryRecord.insertMany([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId)).resolves.toBeNull();
    });

    it("should return no record when there is no tie in vote play in the history.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GAME_HISTORY_RECORD_VOTING_RESULTS.DEATH });
      await models.gameHistoryRecord.insertMany([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId)).resolves.toBeNull();
    });

    it("should return no record when there gameId is not the good one.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE });
      await models.gameHistoryRecord.insertMany([
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
      ]);

      await expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(otherGameId)).resolves.toBeNull();
    });

    it("should return the last tie in vote game history play record when called.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2020-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2021-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ voting: gameHistoryRecordPlayTieVoting }), createdAt: new Date("2024-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId);

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[3]) as GameHistoryRecord);
    });
  });

  describe("getGameHistoryWitchUsesSpecificPotionRecords", () => {
    it("should get no record when there are no witch play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecordPlayTieVoting = createFakeGameHistoryRecordPlayVoting({ result: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ voting: gameHistoryRecordPlayTieVoting }) }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WITCH_POTIONS.LIFE);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get no record when there are no witch using life potion play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.DEATH })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WITCH_POTIONS.LIFE);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of witch using life potion for this gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.LIFE })] }) }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.LIFE }),
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.DEATH }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.LIFE })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WITCH_POTIONS.LIFE);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });

    it("should get no record when there are no witch using death potion play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.LIFE })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WITCH_POTIONS.DEATH);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of witch using death potion for this gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.DEATH })] }) }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.LIFE }),
              createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.DEATH }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ drankPotion: WITCH_POTIONS.DEATH })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WITCH_POTIONS.DEATH);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryVileFatherOfWolvesInfectedRecords", () => {
    it("should get no record when there are no eat play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryVileFatherOfWolvesInfectedRecords(gameId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });

    it("should get records of vile father of wolves infected for this gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: false })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: true })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: true })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryVileFatherOfWolvesInfectedRecords(gameId);
      const expectedRecords = [gameHistoryRecords[2]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryJudgeRequestRecords", () => {
    it("should get no record when there are no vote with judge request play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryJudgeRequestRecords(gameId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });
    
    it("should get records of stuttering judge requesting another vote for this gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: true }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: true }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryJudgeRequestRecords(gameId);
      const expectedRecords = [gameHistoryRecords[1]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryWerewolvesEatAncientRecords", () => {
    it("should get no record when there are no eat play.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay() }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWerewolvesEatAncientRecords(gameId);

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>([]);
    });
    
    it("should get records of ancient eaten by any kind of werewolves for this gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeWitchAlivePlayer() }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordBigBadWolfEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({
          gameId: otherGameId, play: createFakeGameHistoryRecordWerewolvesEatPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeWitchAlivePlayer() }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordBigBadWolfEatPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryWerewolvesEatAncientRecords(gameId);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[3]];

      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getGameHistoryAncientProtectedFromWerewolvesRecords", () => {
    it("should get game history where ancient is protected from werewolves records for gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordGuardProtectPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() })] }) }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() })] }) }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer(), drankPotion: WITCH_POTIONS.LIFE }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer(), drankPotion: WITCH_POTIONS.DEATH }),
            ],
          }),
        }),
        createFakeGameHistoryRecord({
          gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay({
            targets: [
              createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer(), drankPotion: WITCH_POTIONS.DEATH }),
              createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer(), drankPotion: WITCH_POTIONS.LIFE }),
            ],
          }),
        }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getGameHistoryAncientProtectedFromWerewolvesRecords(gameId);
      const expectedRecords = [gameHistoryRecords[1], gameHistoryRecords[5]];
      
      expect(toJSON(records)).toStrictEqual<GameHistoryRecord[]>(toJSON(expectedRecords) as GameHistoryRecord[]);
    });
  });

  describe("getPreviousGameHistoryRecord", () => {
    it("should get no record when game doesn't have history yet.", async() => {
      const gameId = createFakeObjectId();
      const otherGameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordGuardProtectPlay() }),
        createFakeGameHistoryRecord({ gameId: otherGameId, play: createFakeGameHistoryRecordAllVotePlay() }),
      ];
      await populate(gameHistoryRecords);
      const records = await repositories.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(toJSON(records)).toBeNull();
    });

    it("should get previous game history record for gameId when called.", async() => {
      const gameId = createFakeObjectId();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay(), createdAt: new Date("2020-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordWitchUsePotionsPlay(), createdAt: new Date("2021-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordGuardProtectPlay(), createdAt: new Date("2022-01-01") }),
        createFakeGameHistoryRecord({ gameId, play: createFakeGameHistoryRecordAllVotePlay(), createdAt: new Date("2023-01-01") }),
      ];
      await populate(gameHistoryRecords);
      const record = await repositories.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(toJSON(record)).toStrictEqual<GameHistoryRecord>(toJSON(gameHistoryRecords[3]) as GameHistoryRecord);
    });
  });
});