import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";

import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlaySurvivorsElectSheriff } from "@/modules/game/helpers/game-play/game-play.factory";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import type { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import type { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.type";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";

import { createFakeGetGameHistoryDto } from "@tests/factories/game/dto/get-game-history/get-game-history.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordPlayVote, createFakeGameHistoryRecordPlayVoting } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerDeathPotionByWitchDeath, createFakePlayerVoteBySurvivorsDeath, createFakePlayerVoteScapegoatedBySurvivorsDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAngelAlivePlayer, createFakeHunterAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeDeadPlayer, createFakePlayer, createFakePlayerRole } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game History Record Service", () => {
  let mocks: {
    gameHistoryRecordService: {
      validateGameHistoryRecordToInsertData: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlayToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordRevealedPlayersToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordDeadPlayersToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlayVotingToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlayVotingResultToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlaySourceToInsert: jest.SpyInstance;
    };
    gameHistoryRecordRepository: {
      create: jest.SpyInstance;
      getLastGameHistoryDefenderProtectsRecord: jest.SpyInstance;
      getLastGameHistoryTieInVotesRecord: jest.SpyInstance;
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getGameHistoryAccursedWolfFatherInfectedRecords: jest.SpyInstance;
      getGameHistoryJudgeRequestRecords: jest.SpyInstance;
      getGameHistoryJudgeChoosesHisSignRecords: jest.SpyInstance;
      getGameHistoryWerewolvesEatElderRecords: jest.SpyInstance;
      getGameHistoryElderProtectedFromWerewolvesRecords: jest.SpyInstance;
      getPreviousGameHistoryRecord: jest.SpyInstance;
      getGameHistory: jest.SpyInstance;
      getGameHistoryPhaseRecords: jest.SpyInstance;
      getGameHistoryGamePlayRecords: jest.SpyInstance;
      getGameHistoryGamePlayMadeByPlayerRecords: jest.SpyInstance;
    };
    gameRepository: { findOne: jest.SpyInstance };
    gamePlayVoteService: { getNominatedPlayers: jest.SpyInstance };
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };
  let services: { gameHistoryRecord: GameHistoryRecordService };
  let repositories: { gameHistoryRecord: GameHistoryRecordRepository };

  beforeEach(async() => {
    mocks = {
      gameHistoryRecordService: {
        validateGameHistoryRecordToInsertData: jest.fn(),
        generateCurrentGameHistoryRecordPlayToInsert: jest.fn(),
        generateCurrentGameHistoryRecordRevealedPlayersToInsert: jest.fn(),
        generateCurrentGameHistoryRecordDeadPlayersToInsert: jest.fn(),
        generateCurrentGameHistoryRecordPlayVotingToInsert: jest.fn(),
        generateCurrentGameHistoryRecordPlayVotingResultToInsert: jest.fn(),
        generateCurrentGameHistoryRecordPlaySourceToInsert: jest.fn(),

      },
      gameHistoryRecordRepository: {
        create: jest.fn(),
        getLastGameHistoryDefenderProtectsRecord: jest.fn(),
        getLastGameHistoryTieInVotesRecord: jest.fn(),
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn(),
        getGameHistoryAccursedWolfFatherInfectedRecords: jest.fn(),
        getGameHistoryJudgeRequestRecords: jest.fn(),
        getGameHistoryJudgeChoosesHisSignRecords: jest.fn(),
        getGameHistoryWerewolvesEatElderRecords: jest.fn(),
        getGameHistoryElderProtectedFromWerewolvesRecords: jest.fn(),
        getPreviousGameHistoryRecord: jest.fn(),
        getGameHistory: jest.fn(),
        getGameHistoryPhaseRecords: jest.fn(),
        getGameHistoryGamePlayRecords: jest.fn(),
        getGameHistoryGamePlayMadeByPlayerRecords: jest.fn(),
      },
      gameRepository: { findOne: jest.fn() },
      gamePlayVoteService: { getNominatedPlayers: jest.fn() },
      unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() },
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
        {
          provide: GamePlayVoteService,
          useValue: mocks.gamePlayVoteService,
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

      expect(repositories.gameHistoryRecord.create).toHaveBeenCalledExactlyOnceWith(validPlay);
    });
  });

  describe("getLastGameHistoryDefenderProtectsRecord", () => {
    it("should get game history when defender protected when called.", async() => {
      const defenderPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistoryDefenderProtectsRecord(gameId, defenderPlayerId);

      expect(repositories.gameHistoryRecord.getLastGameHistoryDefenderProtectsRecord).toHaveBeenCalledExactlyOnceWith(gameId, defenderPlayerId);
    });
  });

  describe("getLastGameHistoryTieInVotesRecord", () => {
    it("should get game history when all voted and there was a tie when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, GamePlayActions.VOTE);

      expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord).toHaveBeenCalledExactlyOnceWith(gameId, GamePlayActions.VOTE);
    });
  });

  describe("getGameHistoryWitchUsesSpecificPotionRecords", () => {
    it("should get game history records when witch used life potion when called.", async() => {
      const witchPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, WitchPotions.LIFE);

      expect(repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, witchPlayerId, WitchPotions.LIFE);
    });

    it("should get game history records when witch used death potion when called.", async() => {
      const witchPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, WitchPotions.DEATH);

      expect(repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, witchPlayerId, WitchPotions.DEATH);
    });
  });

  describe("getGameHistoryAccursedWolfFatherInfectedRecords", () => {
    it("should get game history records when accursed wolf-father infected a player when called.", async() => {
      const accursedWolfFatherPlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectedRecords(gameId, accursedWolfFatherPlayerId);

      expect(repositories.gameHistoryRecord.getGameHistoryAccursedWolfFatherInfectedRecords).toHaveBeenCalledExactlyOnceWith(gameId, accursedWolfFatherPlayerId);
    });
  });

  describe("getGameHistoryJudgeRequestRecords", () => {
    it("should get game history records when stuttering judge requested another vote when called.", async() => {
      const stutteringJudgePlayerId = createFakeObjectId();
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryJudgeRequestRecords(gameId, stutteringJudgePlayerId);

      expect(repositories.gameHistoryRecord.getGameHistoryJudgeRequestRecords).toHaveBeenCalledExactlyOnceWith(gameId, stutteringJudgePlayerId);
    });
  });

  describe("didJudgeMakeHisSign", () => {
    it("should return true when there are records of stuttering judge make his sign.", async() => {
      mocks.gameHistoryRecordRepository.getGameHistoryJudgeChoosesHisSignRecords.mockResolvedValueOnce([createFakeGameHistoryRecordPlay()]);

      await expect(services.gameHistoryRecord.didJudgeMakeHisSign(createFakeObjectId())).resolves.toBe(true);
    });

    it("should return false when there are no records of stuttering judge make his sign.", async() => {
      mocks.gameHistoryRecordRepository.getGameHistoryJudgeChoosesHisSignRecords.mockResolvedValueOnce([]);

      await expect(services.gameHistoryRecord.didJudgeMakeHisSign(createFakeObjectId())).resolves.toBe(false);
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

  describe("getGameHistoryPhaseRecords", () => {
    it("should call getGameHistoryPhaseRecords method when called.", async() => {
      const game = createFakeGame();
      await services.gameHistoryRecord.getGameHistoryPhaseRecords(game._id, game.turn, game.phase);

      expect(mocks.gameHistoryRecordRepository.getGameHistoryPhaseRecords).toHaveBeenCalledExactlyOnceWith(game._id, game.turn, game.phase);
    });
  });

  describe("getPreviousGameHistoryRecord", () => {
    it("should previous game history record when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(repositories.gameHistoryRecord.getPreviousGameHistoryRecord).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("generateCurrentGameHistoryRecordToInsert", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert = jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlayToInsert }, "generateCurrentGameHistoryRecordPlayToInsert").mockImplementation();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordRevealedPlayersToInsert = jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordRevealedPlayersToInsert }, "generateCurrentGameHistoryRecordRevealedPlayersToInsert").mockImplementation();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordDeadPlayersToInsert = jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordDeadPlayersToInsert }, "generateCurrentGameHistoryRecordDeadPlayersToInsert").mockImplementation();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingToInsert = jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlayVotingToInsert }, "generateCurrentGameHistoryRecordPlayVotingToInsert").mockImplementation();
    });
    
    it("should throw error when there is no current play for the game.", () => {
      const baseGame = createFakeGame();
      const newGame = createFakeGame();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const interpolations = { gameId: baseGame._id };
      const mockedError = "error";
      mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException.mockReturnValue(mockedError);

      expect(() => services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play)).toThrow(mockedError);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("generateCurrentGameHistoryRecordToInsert", interpolations);
    });
    
    it("should generate current game history to insert when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      const expectedCurrentGameHistoryToInsert = createFakeGameHistoryRecordToInsert({
        gameId: baseGame._id,
        turn: baseGame.turn,
        phase: baseGame.phase,
        tick: baseGame.tick,
        play: expectedCurrentGameHistoryPlayToInsert,
      });
      
      expect(services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play)).toStrictEqual<GameHistoryRecordToInsert>(expectedCurrentGameHistoryToInsert);
    });

    it("should call generateCurrentGameHistoryRecordPlayToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, play);
    });

    it("should call generateCurrentGameHistoryRecordRevealedPlayersToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordRevealedPlayersToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame);
    });

    it("should call generateCurrentGameHistoryRecordDeadPlayersToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordDeadPlayersToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame);
    });
    
    it("should call generateCurrentGameHistoryRecordPlayVotingToInsert method when called with votes.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay({ votes: [] });
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      const gameHistoryRecordToInsert = {
        gameId: baseGame._id,
        turn: baseGame.turn,
        phase: baseGame.phase,
        tick: baseGame.tick,
        play: expectedCurrentGameHistoryPlayToInsert,
        revealedPlayers: undefined,
        deadPlayers: undefined,
      };
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame, gameHistoryRecordToInsert);
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

  describe("generateCurrentGameHistoryRecordDeadPlayersToInsert", () => {
    it("should generate current game history dead players when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0], isAlive: false }),
        createFakePlayer({ ...players[1] }),
        createFakePlayer({ ...players[2], isAlive: false }),
        createFakePlayer({ ...players[3] }),
        createFakePlayer({ ...players[4] }),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordDeadPlayersToInsert"](baseGame, newGame)).toStrictEqual<Player[]>([
        newPlayers[0],
        newPlayers[2],
      ]);
    });

    it("should return undefined when there is no dead players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0] }),
        createFakePlayer({ ...players[1] }),
        createFakePlayer({ ...players[2] }),
        createFakePlayer({ ...players[3] }),
        createFakePlayer({ ...players[4] }),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordDeadPlayersToInsert"](baseGame, newGame)).toBeUndefined();
    });
  });

  describe("generateCurrentGameHistoryRecordRevealedPlayersToInsert", () => {
    it("should generate current game history revealed players but alive when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: true }) }),
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ isAlive: false, role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[1], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[2], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[3], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[4], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeAngelAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordRevealedPlayersToInsert"](baseGame, newGame)).toStrictEqual<Player[]>([
        newPlayers[0],
        newPlayers[2],
      ]);
    });

    it("should return undefined when there is no new revealed players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: true }) }),
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ isAlive: false, role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakePlayer({ ...players[1], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[2], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakePlayer({ ...players[3], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[4], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeAngelAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordRevealedPlayersToInsert"](baseGame, newGame)).toBeUndefined();
    });
  });

  describe("generateCurrentGameHistoryRecordPlayToInsert", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlaySourceToInsert = jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlaySourceToInsert }, "generateCurrentGameHistoryRecordPlaySourceToInsert").mockImplementation();
    });

    it("should generate current game history record play to insert when called.", () => {
      const game = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto({
        doesJudgeRequestAnotherVote: true,
        targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: true })],
        votes: [createFakeGameHistoryRecordPlayVote()],
        chosenCard: createFakeGameAdditionalCard(),
        chosenSide: RoleSides.VILLAGERS,
      });
      const expectedGameHistoryRecordPlaySource = { name: undefined, players: undefined };
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlaySourceToInsert.mockReturnValue(expectedGameHistoryRecordPlaySource);
      const expectedGameHistoryRecordPlay = createFakeGameHistoryRecordPlay({
        action: game.currentPlay.action,
        didJudgeRequestAnotherVote: play.doesJudgeRequestAnotherVote,
        targets: play.targets,
        votes: play.votes,
        chosenCard: play.chosenCard,
        chosenSide: play.chosenSide,
      }, { source: expectedGameHistoryRecordPlaySource });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayToInsert"](game, play)).toStrictEqual<GameHistoryRecordPlay>(expectedGameHistoryRecordPlay);
    });
  });

  describe("generateCurrentGameHistoryRecordPlayVotingResultToInsert", () => {
    it("should return sheriff election when there is a sheriff in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsElectSheriff() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer({ ...players[1], attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.SHERIFF_ELECTION);
    });

    it("should return tie when there is no sheriff in the game after election.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsElectSheriff() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.TIE);
    });

    it("should return skipped when there are no vote set.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: undefined });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.SKIPPED);
    });

    it("should return skipped when votes are empty.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.SKIPPED);
    });

    it("should return death when there is at least one dead player from votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const deadPlayers = [
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() }),
      ];
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.DEATH);
    });

    it("should return death when there is at least one dead player from scapegoat votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteScapegoatedBySurvivorsDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.DEATH);
    });

    it("should return inconsequential when there is no death from votes and current play was already after a tie.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }) });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.INCONSEQUENTIAL);
    });

    it("should return inconsequential when there is no death from votes, current play was not already after a tie but only one player was nominated.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }) });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.INCONSEQUENTIAL);
    });

    it("should return tie when there is no death from votes, current play was not after a tie and there are several nominated players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }) });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.TIE);
    });
  });

  describe("generateCurrentGameHistoryRecordPlayVotingToInsert", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert = jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlayVotingResultToInsert }, "generateCurrentGameHistoryRecordPlayVotingResultToInsert").mockImplementation();
    });
    
    it("should generate current game history record play voting when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      const expectedCurrentGameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({
        result: GameHistoryRecordVotingResults.DEATH,
        nominatedPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert)).toStrictEqual<GameHistoryRecordPlayVoting>(expectedCurrentGameHistoryRecordPlayVoting);
    });
    
    it("should generate current game history record play voting without nominated players when no nominated players are found.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      const nominatedPlayers = [];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      const expectedCurrentGameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ result: GameHistoryRecordVotingResults.DEATH });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert)).toStrictEqual<GameHistoryRecordPlayVoting>(expectedCurrentGameHistoryRecordPlayVoting);
    });

    it("should call getNominatedPlayers method with undefined votes when called without votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

      expect(mocks.gamePlayVoteService.getNominatedPlayers).toHaveBeenCalledExactlyOnceWith(undefined, game);
    });

    it("should call getNominatedPlayers method with votes when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] }) });
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

      expect(mocks.gamePlayVoteService.getNominatedPlayers).toHaveBeenCalledExactlyOnceWith(gameHistoryRecordToInsert.play.votes, game);
    });

    it("should call generateCurrentGameHistoryRecordPlayVotingResultToInsert method when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] }) });
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

      expect(mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert).toHaveBeenCalledExactlyOnceWith(game, newGame, nominatedPlayers, gameHistoryRecordToInsert);
    });
  });

  describe("generateCurrentGameHistoryRecordPlaySourceToInsert", () => {
    it("should generate current game history record play source when called.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const expectedPlayers = [players[0], players[1], players[3]];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createGamePlaySurvivorsElectSheriff({ source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: expectedPlayers }) }), players });
      const expectedGameHistoryRecordPlaySource = createFakeGameHistoryRecordPlaySource({
        name: game.currentPlay.source.name,
        players: expectedPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlaySourceToInsert"](game)).toStrictEqual<GameHistoryRecordPlaySource>(expectedGameHistoryRecordPlaySource);
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
        play: createFakeGameHistoryRecordPlay({ source: { name: PlayerAttributeNames.SHERIFF, players: [fakePlayer] } }),
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_SOURCE],
      },
      {
        test: "should throw resource not found error when a target is not in the game.",
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PlayerAttributeNames.SHERIFF,
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
            name: PlayerAttributeNames.SHERIFF,
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
            name: PlayerAttributeNames.SHERIFF,
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
            name: PlayerAttributeNames.SHERIFF,
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
          name: PlayerAttributeNames.SHERIFF,
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
        play: createFakeGameHistoryRecordPlay({ source: { name: PlayerAttributeNames.SHERIFF, players: existingGame.players } }),
        revealedPlayers: existingGame.players,
        deadPlayers: existingGame.players.map(player => createFakeDeadPlayer(player as DeadPlayer)),
      });

      await expect(services.gameHistoryRecord["validateGameHistoryRecordToInsertData"](validPlay)).resolves.not.toThrow();
    });
  });
});