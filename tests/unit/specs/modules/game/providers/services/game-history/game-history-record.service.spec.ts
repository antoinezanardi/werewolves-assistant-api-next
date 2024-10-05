import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record/game-history-record.types";

import { ApiResources } from "@/shared/api/enums/api.enums";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enum";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { createFakeGetGameHistoryDto } from "@tests/factories/game/dto/get-game-history/get-game-history.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecordPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeDeadPlayer, createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { when } from "jest-when";

describe("Game History Record Service", () => {
  let mocks: {
    gameHistoryRecordService: {
      validateGameHistoryRecordToInsertData: jest.SpyInstance;
    };
    gameHistoryRecordRepository: {
      create: jest.SpyInstance;
      getLastGameHistoryDefenderProtectsRecord: jest.SpyInstance;
      getLastGameHistorySurvivorsVoteRecord: jest.SpyInstance;
      getLastGameHistoryTieInVotesRecord: jest.SpyInstance;
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getLastGameHistoryAccursedWolfFatherInfectsRecord: jest.SpyInstance;
      getGameHistoryStutteringJudgeRequestsAnotherVoteRecords: jest.SpyInstance;
      getGameHistoryJudgeChoosesHisSignRecords: jest.SpyInstance;
      getGameHistoryWerewolvesEatElderRecords: jest.SpyInstance;
      getGameHistoryElderProtectedFromWerewolvesRecords: jest.SpyInstance;
      getPreviousGameHistoryRecord: jest.SpyInstance;
      getGameHistory: jest.SpyInstance;
      getGameHistoryRecordsForTurnAndPhases: jest.SpyInstance;
      getGameHistoryGamePlayRecords: jest.SpyInstance;
      getGameHistoryGamePlayMadeByPlayerRecords: jest.SpyInstance;
      getGameHistoryAccursedWolfFatherInfectsWithTargetRecords: jest.SpyInstance;
    };
    gameRepository: { findOne: jest.SpyInstance };
  };
  let services: { gameHistoryRecord: GameHistoryRecordService };
  let repositories: { gameHistoryRecord: GameHistoryRecordRepository };

  beforeEach(async() => {
    mocks = {
      gameHistoryRecordService: {
        validateGameHistoryRecordToInsertData: jest.fn(),
      },
      gameHistoryRecordRepository: {
        create: jest.fn(),
        getLastGameHistoryDefenderProtectsRecord: jest.fn(),
        getLastGameHistorySurvivorsVoteRecord: jest.fn(),
        getLastGameHistoryTieInVotesRecord: jest.fn(),
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn(),
        getLastGameHistoryAccursedWolfFatherInfectsRecord: jest.fn(),
        getGameHistoryStutteringJudgeRequestsAnotherVoteRecords: jest.fn(),
        getGameHistoryJudgeChoosesHisSignRecords: jest.fn(),
        getGameHistoryWerewolvesEatElderRecords: jest.fn(),
        getGameHistoryElderProtectedFromWerewolvesRecords: jest.fn(),
        getPreviousGameHistoryRecord: jest.fn(),
        getGameHistory: jest.fn(),
        getGameHistoryRecordsForTurnAndPhases: jest.fn(),
        getGameHistoryGamePlayRecords: jest.fn(),
        getGameHistoryGamePlayMadeByPlayerRecords: jest.fn(),
        getGameHistoryAccursedWolfFatherInfectsWithTargetRecords: jest.fn(),
      },
      gameRepository: { findOne: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameHistoryRecordRepository,
          useValue: mocks.gameHistoryRecordRepository,
        },
        {
          provide: GameRepository,
          useValue: mocks.gameRepository,
        },
        GameHistoryRecordService,
      ],
    }).compile();

    services = { gameHistoryRecord: module.get<GameHistoryRecordService>(GameHistoryRecordService) };
    repositories = { gameHistoryRecord: module.get<GameHistoryRecordRepository>(GameHistoryRecordRepository) };
  });

  describe("createGameHistoryRecord", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.validateGameHistoryRecordToInsertData = jest.spyOn(services.gameHistoryRecord as unknown as { validateGameHistoryRecordToInsertData }, "validateGameHistoryRecordToInsertData").mockImplementation();
    });

    it("should create game history record when called with valid data.", async() => {
      mocks.gameHistoryRecordService.validateGameHistoryRecordToInsertData.mockImplementation();
      const validPlay = createFakeGameHistoryRecordToInsert({
        gameId: createFakeObjectId(),
        play: createFakeGameHistoryRecordPlay(),
      });
      await services.gameHistoryRecord.createGameHistoryRecord(validPlay);

      expect(mocks.gameHistoryRecordRepository.create).toHaveBeenCalledExactlyOnceWith(validPlay);
    });
  });

  describe("getLastGameHistoryDefenderProtectsRecord", () => {
    it("should get game history when defender protected when called.", async() => {
      const defenderPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistoryDefenderProtectsRecord(gameId, defenderPlayerId);

      expect(mocks.gameHistoryRecordRepository.getLastGameHistoryDefenderProtectsRecord).toHaveBeenCalledExactlyOnceWith(gameId, defenderPlayerId);
    });
  });

  describe("getLastGameHistorySurvivorsVoteRecord", () => {
    it("should get last game history when survivors voted when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistorySurvivorsVoteRecord(gameId);

      expect(mocks.gameHistoryRecordRepository.getLastGameHistorySurvivorsVoteRecord).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("getLastGameHistoryTieInVotesRecord", () => {
    it("should get game history when all voted and there was a tie when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, "vote");

      expect(mocks.gameHistoryRecordRepository.getLastGameHistoryTieInVotesRecord).toHaveBeenCalledExactlyOnceWith(gameId, "vote");
    });
  });

  describe("getGameHistoryWitchUsesSpecificPotionRecords", () => {
    it("should get game history records when witch used life potion when called.", async() => {
      const witchPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, "life");

      expect(mocks.gameHistoryRecordRepository.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, witchPlayerId, "life");
    });

    it("should get game history records when witch used death potion when called.", async() => {
      const witchPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, "death");

      expect(mocks.gameHistoryRecordRepository.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, witchPlayerId, "death");
    });
  });

  describe("getGameHistoryAccursedWolfFatherInfectsWithTargetRecords", () => {
    it("should get game history records when accursed wolf-father infected a player when called.", async() => {
      const accursedWolfFatherPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(gameId, accursedWolfFatherPlayerId);

      expect(mocks.gameHistoryRecordRepository.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords).toHaveBeenCalledExactlyOnceWith(gameId, accursedWolfFatherPlayerId);
    });
  });

  describe("getLastGameHistoryAccursedWolfFatherInfectsRecord", () => {
    it("should get last game history records when accursed wolf-father infected a player when called.", async() => {
      const accursedWolfFatherPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistoryAccursedWolfFatherInfectsRecord(gameId, accursedWolfFatherPlayerId);

      expect(mocks.gameHistoryRecordRepository.getLastGameHistoryAccursedWolfFatherInfectsRecord).toHaveBeenCalledExactlyOnceWith(gameId, accursedWolfFatherPlayerId);
    });
  });

  describe("getGameHistoryStutteringJudgeRequestsAnotherVoteRecords", () => {
    it("should get game history records when stuttering judge requested another vote when called.", async() => {
      const stutteringJudgePlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryStutteringJudgeRequestsAnotherVoteRecords(gameId, stutteringJudgePlayerId);

      expect(mocks.gameHistoryRecordRepository.getGameHistoryStutteringJudgeRequestsAnotherVoteRecords).toHaveBeenCalledExactlyOnceWith(gameId, stutteringJudgePlayerId);
    });
  });

  describe("getGameHistoryWerewolvesEatElderRecords", () => {
    it("should get game history records when any kind of werewolves eat elder when called.", async() => {
      const elderPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWerewolvesEatElderRecords(gameId, elderPlayerId);

      expect(repositories.gameHistoryRecord.getGameHistoryWerewolvesEatElderRecords).toHaveBeenCalledExactlyOnceWith(gameId, elderPlayerId);
    });
  });

  describe("getGameHistoryElderProtectedFromWerewolvesRecords", () => {
    it("should get game history records when elder is protected from werewolves when called.", async() => {
      const elderPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryElderProtectedFromWerewolvesRecords(gameId, elderPlayerId);

      expect(repositories.gameHistoryRecord.getGameHistoryElderProtectedFromWerewolvesRecords).toHaveBeenCalledExactlyOnceWith(gameId, elderPlayerId);
    });
  });

  describe("getGameHistoryRecordsForTurnAndPhases", () => {
    it("should call getGameHistoryRecordsForTurnAndPhases method when called.", async() => {
      const game = createFakeGame();
      await services.gameHistoryRecord.getGameHistoryRecordsForTurnAndPhases(game._id, game.turn, [game.phase.name]);

      expect(mocks.gameHistoryRecordRepository.getGameHistoryRecordsForTurnAndPhases).toHaveBeenCalledExactlyOnceWith(game._id, game.turn, [game.phase.name]);
    });
  });

  describe("getPreviousGameHistoryRecord", () => {
    it("should previous game history record when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(repositories.gameHistoryRecord.getPreviousGameHistoryRecord).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("getGameHistory", () => {
    it("should call getGameHistory repository method when called.", async() => {
      const game = createFakeGame();
      const getGameHistoryDto = createFakeGetGameHistoryDto();
      await services.gameHistoryRecord.getGameHistory(game._id, getGameHistoryDto);

      expect(mocks.gameHistoryRecordRepository.getGameHistory).toHaveBeenCalledExactlyOnceWith(game._id, getGameHistoryDto);
    });
  });

  describe("hasGamePlayBeenMade", () => {
    it("should call getGameHistoryGamePlayMadeByPlayerRecords repository method when called.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlay();
      mocks.gameHistoryRecordRepository.getGameHistoryGamePlayRecords.mockResolvedValueOnce([]);
      await services.gameHistoryRecord.hasGamePlayBeenMade(game._id, gamePlay);

      expect(mocks.gameHistoryRecordRepository.getGameHistoryGamePlayRecords).toHaveBeenCalledExactlyOnceWith(game._id, gamePlay, { limit: 1 });
    });

    it("should return false when there is no game play record.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlay();
      mocks.gameHistoryRecordRepository.getGameHistoryGamePlayRecords.mockResolvedValueOnce([]);

      await expect(services.gameHistoryRecord.hasGamePlayBeenMade(game._id, gamePlay)).resolves.toBe(false);
    });

    it("should return true when there is a game play record.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlay();
      mocks.gameHistoryRecordRepository.getGameHistoryGamePlayRecords.mockResolvedValueOnce([createFakeGameHistoryRecordPlay()]);

      await expect(services.gameHistoryRecord.hasGamePlayBeenMade(game._id, gamePlay)).resolves.toBe(true);
    });
  });

  describe("hasGamePlayBeenMadeByPlayer", () => {
    it("should call getGameHistoryGamePlayMadeByPlayerRecords repository method when called.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlay();
      const player = createFakePlayer();
      mocks.gameHistoryRecordRepository.getGameHistoryGamePlayMadeByPlayerRecords.mockResolvedValueOnce([]);
      await services.gameHistoryRecord.hasGamePlayBeenMadeByPlayer(game._id, gamePlay, player);

      expect(mocks.gameHistoryRecordRepository.getGameHistoryGamePlayMadeByPlayerRecords).toHaveBeenCalledExactlyOnceWith(game._id, gamePlay, player, { limit: 1 });
    });

    it("should return false when there is no game play record.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlay();
      const player = createFakePlayer();
      mocks.gameHistoryRecordRepository.getGameHistoryGamePlayMadeByPlayerRecords.mockResolvedValueOnce([]);

      await expect(services.gameHistoryRecord.hasGamePlayBeenMadeByPlayer(game._id, gamePlay, player)).resolves.toBe(false);
    });

    it("should return true when there is a game play record.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlay();
      const player = createFakePlayer();
      mocks.gameHistoryRecordRepository.getGameHistoryGamePlayMadeByPlayerRecords.mockResolvedValueOnce([createFakeGameHistoryRecordPlay()]);

      await expect(services.gameHistoryRecord.hasGamePlayBeenMadeByPlayer(game._id, gamePlay, player)).resolves.toBe(true);
    });
  });

  describe("validateGameHistoryRecordToInsertPlayData", () => {
    const fakeGameAdditionalCards = [
      createFakeGameAdditionalCard(),
      createFakeGameAdditionalCard(),
      createFakeGameAdditionalCard(),
    ];
    const players = [
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
    ];
    const fakeGame = createFakeGame({ players, additionalCards: fakeGameAdditionalCards });
    const fakePlayer = createFakePlayer();
    const fakeCard = createFakeGameAdditionalCard();

    it.each<{
      test: string;
      play: GameHistoryRecordPlay;
      errorParameters: [ApiResources, string, ResourceNotFoundReasons];
    }>([
      {
        test: "should throw resource not found error when source is not in the game.",
        play: createFakeGameHistoryRecordPlay({ source: { name: "sheriff", players: [fakePlayer] } }),
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_SOURCE],
      },
      {
        test: "should throw resource not found error when a target is not in the game.",
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: "sheriff",
            players: fakeGame.players,
          },
          targets: [{ player: fakePlayer }],
        }),
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_TARGET],
      },
      {
        test: "should throw resource not found error when a vote source is not in the game.",
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: "sheriff",
            players: fakeGame.players,
          },
          votes: [{ source: fakePlayer, target: fakeGame.players[0] }],
        }),
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE],
      },
      {
        test: "should throw resource not found error when a vote target is not in the game.",
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: "sheriff",
            players: fakeGame.players,
          },
          votes: [{ target: fakePlayer, source: fakeGame.players[0] }],
        }),
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET],
      },
      {
        test: "should throw resource not found error when chosen card is not in the game.",
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: "sheriff",
            players: fakeGame.players,
          },
          chosenCard: fakeCard,
        }),
        errorParameters: [ApiResources.GAME_ADDITIONAL_CARDS, fakeCard._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_CHOSEN_CARD],
      },
    ])("$test", ({ play, errorParameters }) => {
      const expectedException = new ResourceNotFoundException(...errorParameters);

      expect(() => services.gameHistoryRecord["validateGameHistoryRecordToInsertPlayData"](play, fakeGame)).toThrow(expectedException);
    });

    it("should not throw any errors when called with valid play data.", () => {
      const validPlay = createFakeGameHistoryRecordPlay({
        source: {
          name: "sheriff",
          players: fakeGame.players,
        },
        targets: [{ player: fakeGame.players[0] }],
        votes: [{ target: fakeGame.players[1], source: fakeGame.players[0] }],
        chosenCard: fakeGameAdditionalCards[1],
      });

      expect(() => services.gameHistoryRecord["validateGameHistoryRecordToInsertPlayData"](validPlay, fakeGame)).not.toThrow();
    });
  });

  describe("validateGameHistoryRecordToInsertData", () => {
    const existingId = createFakeObjectId();
    const existingGame = createFakeGame();
    const fakePlayer = createFakePlayer();
    const fakeDeadPlayer = createFakeDeadPlayer();
    const unknownId = createFakeObjectId();

    beforeEach(() => {
      when(mocks.gameRepository.findOne).calledWith({ _id: unknownId.toJSON() }).mockResolvedValue(null);
      when(mocks.gameRepository.findOne).calledWith({ _id: existingId.toJSON() }).mockResolvedValue(existingGame);
    });

    it.each<{
      test: string;
      gameHistoryRecord: GameHistoryRecordToInsert;
      errorParameters: [ApiResources, string, ResourceNotFoundReasons];
    }>([
      {
        test: "should throw resource not found error when game is not found with specified gameId.",
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: unknownId }),
        errorParameters: [ApiResources.GAMES, unknownId.toString(), ResourceNotFoundReasons.UNKNOWN_GAME_PLAY_GAME_ID],
      },
      {
        test: "should throw resource not found error when a revealed player is not in the game.",
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, revealedPlayers: [fakePlayer] }),
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_REVEALED_PLAYER],
      },
      {
        test: "should throw resource not found error when a dead player is not in the game.",
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, deadPlayers: [fakeDeadPlayer] }),
        errorParameters: [ApiResources.PLAYERS, fakeDeadPlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_DEAD_PLAYER],
      },
    ])("$test", async({ gameHistoryRecord, errorParameters }) => {
      const expectedException = new ResourceNotFoundException(...errorParameters);

      await expect(services.gameHistoryRecord["validateGameHistoryRecordToInsertData"](gameHistoryRecord)).rejects.toStrictEqual<ResourceNotFoundException>(expectedException);
    });

    it("should not throw any errors when called with valid data.", async() => {
      const validPlay = createFakeGameHistoryRecordToInsert({
        gameId: existingId,
        play: createFakeGameHistoryRecordPlay({ source: { name: "sheriff", players: existingGame.players } }),
        revealedPlayers: existingGame.players,
        deadPlayers: existingGame.players.map(player => createFakeDeadPlayer(player as DeadPlayer)),
      });

      await expect(services.gameHistoryRecord["validateGameHistoryRecordToInsertData"](validPlay)).resolves.not.toThrow();
    });
  });
});