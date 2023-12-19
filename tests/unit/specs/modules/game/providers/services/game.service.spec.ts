import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { GameStatuses } from "@/modules/game/enums/game.enum";
import * as GamePhaseHelper from "@/modules/game/helpers/game-phase/game-phase.helper";
import * as GamePlayHelper from "@/modules/game/helpers/game-play/game-play.helper";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePhaseService } from "@/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/game-play-maker.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { GameVictoryService } from "@/modules/game/providers/services/game-victory/game-victory.service";
import { GameService } from "@/modules/game/providers/services/game.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enum";
import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import { BadResourceMutationException } from "@/shared/exception/types/bad-resource-mutation-exception.type";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeMakeGamePlayDto } from "@tests/factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGamePlaySurvivorsVote } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameVictory } from "@tests/factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game Service", () => {
  let mocks: {
    gameService: {
      handleGamePhaseCompletion: jest.SpyInstance;
      updateGame: jest.SpyInstance;
      setGameAsOver: jest.SpyInstance;
    };
    gameRepository: {
      find: jest.SpyInstance;
      findOne: jest.SpyInstance;
      create: jest.SpyInstance;
      updateOne: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      generateCurrentGameHistoryRecordToInsert: jest.SpyInstance;
      createGameHistoryRecord: jest.SpyInstance;
    };
    gamePlayService: {
      getUpcomingNightPlays: jest.SpyInstance;
      proceedToNextGamePlay: jest.SpyInstance;
      refreshUpcomingPlays: jest.SpyInstance;
      augmentCurrentGamePlay: jest.SpyInstance;
    };
    gamePlayValidatorService: { validateGamePlayWithRelationsDto: jest.SpyInstance };
    gamePlayMakerService: { makeGamePlay: jest.SpyInstance };
    gamePhaseService: {
      applyEndingGamePhaseOutcomes: jest.SpyInstance;
      switchPhaseAndAppendGamePhaseUpcomingPlays: jest.SpyInstance;
      applyStartingGamePhaseOutcomes: jest.SpyInstance;
    };
    gameVictoryService: {
      isGameOver: jest.SpyInstance;
      generateGameVictoryData: jest.SpyInstance;
    };
    playerAttributeService: {
      decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes: jest.SpyInstance;
    };
    gamePhaseHelper: { isGamePhaseOver: jest.SpyInstance };
    gamePlayHelper: { createMakeGamePlayDtoWithRelations: jest.SpyInstance };
  };
  let services: { game: GameService };
  let repositories: { game: GameRepository };

  beforeEach(async() => {
    mocks = {
      gameService: {
        handleGamePhaseCompletion: jest.fn(),
        updateGame: jest.fn(),
        setGameAsOver: jest.fn(),
      },
      gameRepository: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        updateOne: jest.fn(),
      },
      gameHistoryRecordService: {
        generateCurrentGameHistoryRecordToInsert: jest.fn(),
        createGameHistoryRecord: jest.fn(),
      },
      gamePlayService: {
        getUpcomingNightPlays: jest.fn(),
        proceedToNextGamePlay: jest.fn(),
        refreshUpcomingPlays: jest.fn(),
        augmentCurrentGamePlay: jest.fn(),
      },
      gamePlayValidatorService: { validateGamePlayWithRelationsDto: jest.fn() },
      gamePlayMakerService: { makeGamePlay: jest.fn() },
      gamePhaseService: {
        applyEndingGamePhaseOutcomes: jest.fn(),
        switchPhaseAndAppendGamePhaseUpcomingPlays: jest.fn(),
        applyStartingGamePhaseOutcomes: jest.fn(),
      },
      gameVictoryService: {
        isGameOver: jest.fn(),
        generateGameVictoryData: jest.fn(),
      },
      playerAttributeService: { decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes: jest.fn() },
      gamePhaseHelper: { isGamePhaseOver: jest.spyOn(GamePhaseHelper, "isGamePhaseOver").mockImplementation() },
      gamePlayHelper: { createMakeGamePlayDtoWithRelations: jest.spyOn(GamePlayHelper, "createMakeGamePlayDtoWithRelations").mockImplementation() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameRepository,
          useValue: mocks.gameRepository,
        },
        {
          provide: GameHistoryRecordService,
          useValue: mocks.gameHistoryRecordService,
        },
        {
          provide: GamePlayService,
          useValue: mocks.gamePlayService,
        },
        {
          provide: GamePlayValidatorService,
          useValue: mocks.gamePlayValidatorService,
        },
        {
          provide: GamePlayMakerService,
          useValue: mocks.gamePlayMakerService,
        },
        {
          provide: GamePhaseService,
          useValue: mocks.gamePhaseService,
        },
        {
          provide: GameVictoryService,
          useValue: mocks.gameVictoryService,
        },
        {
          provide: PlayerAttributeService,
          useValue: mocks.playerAttributeService,
        },
        {
          provide: GameHistoryRecordRepository,
          useValue: {},
        },
        GamePlayVoteService,
        GameService,
      ],
    }).compile();

    services = { game: module.get<GameService>(GameService) };
    repositories = { game: module.get<GameRepository>(GameRepository) };
  });

  describe("getGames", () => {
    it("should get all games when called.", async() => {
      await services.game.getGames();

      expect(repositories.game.find).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("createGame", () => {
    const createdGame = createFakeGameWithCurrentPlay();
    
    beforeEach(() => {
      mocks.gamePlayService.augmentCurrentGamePlay.mockReturnValue(createdGame);
      mocks.gameRepository.create.mockResolvedValue(createdGame);
      mocks.gameService.updateGame = jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockResolvedValue(createdGame);
    });

    it("should throw error when can't generate upcoming plays.", async() => {
      mocks.gamePlayService.getUpcomingNightPlays.mockReturnValue([]);
      const toCreateGame = createFakeCreateGameDto();
      const exception = new UnexpectedException("createGame", UnexpectedExceptionReasons.CANT_GENERATE_GAME_PLAYS);

      await expect(services.game.createGame(toCreateGame)).rejects.toThrow(exception);
    });

    it("should call createGame repository method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getUpcomingNightPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);
      const expectedGame = createFakeCreateGameDto({
        ...toCreateGame,
        currentPlay: createFakeGamePlaySurvivorsVote(),
        upcomingPlays: [],
      });

      expect(repositories.game.create).toHaveBeenCalledExactlyOnceWith(expectedGame);
    });

    it("should call augmentCurrentGamePlay method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getUpcomingNightPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);

      expect(mocks.gamePlayService.augmentCurrentGamePlay).toHaveBeenCalledExactlyOnceWith(createdGame);
    });

    it("should call updateGame repository method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getUpcomingNightPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(createdGame._id, createdGame);
    });
  });

  describe("cancelGame", () => {
    const existingPlayingGame = createFakeGame({ status: GameStatuses.PLAYING });

    beforeEach(() => {
      mocks.gameService.updateGame = jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockResolvedValue(existingPlayingGame);
    });

    it("should throw error when game is not playing.", async() => {
      const canceledGame = createFakeGame({ status: GameStatuses.CANCELED });
      const expectedException = new BadResourceMutationException(ApiResources.GAMES, canceledGame._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);

      await expect(services.game.cancelGame(canceledGame)).rejects.toStrictEqual<BadResourceMutationException>(expectedException);
    });

    it("should call update method when game can be canceled.", async() => {
      await services.game.cancelGame(existingPlayingGame);

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(existingPlayingGame._id, { status: GameStatuses.CANCELED });
    });
  });

  describe("makeGamePlay", () => {
    const players = [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
    ];
    const game = createFakeGame({ status: GameStatuses.PLAYING, players, currentPlay: createFakeGamePlaySurvivorsVote() });
    const play = createFakeMakeGamePlayWithRelationsDto();

    beforeEach(() => {
      mocks.gamePlayHelper.createMakeGamePlayDtoWithRelations.mockReturnValue(play);
      mocks.gamePlayMakerService.makeGamePlay.mockResolvedValue(game);
      mocks.gamePlayService.refreshUpcomingPlays.mockReturnValue(game);
      mocks.gamePlayService.proceedToNextGamePlay.mockReturnValue(game);
      mocks.gamePlayService.augmentCurrentGamePlay.mockReturnValue(game);
      mocks.gameVictoryService.isGameOver.mockReturnValue(false);
      mocks.gameService.handleGamePhaseCompletion = jest.spyOn(services.game as unknown as { handleGamePhaseCompletion }, "handleGamePhaseCompletion").mockResolvedValue(game);
      mocks.gameService.updateGame = jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockReturnValue(game);
      mocks.gameService.setGameAsOver = jest.spyOn(services.game as unknown as { setGameAsOver }, "setGameAsOver").mockReturnValue(game);
    });

    it("should throw an error when game is not playing.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const canceledGame = createFakeGame({ status: GameStatuses.CANCELED });
      const expectedException = new BadResourceMutationException(ApiResources.GAMES, canceledGame._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);

      await expect(services.game.makeGamePlay(canceledGame, makeGamePlayDto)).rejects.toStrictEqual<BadResourceMutationException>(expectedException);
    });

    it("should call play validator method when called.", async() => {
      const clonedGame = createFakeGame(game);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gamePlayValidatorService.validateGamePlayWithRelationsDto).toHaveBeenCalledExactlyOnceWith(play, clonedGame);
    });

    it("should call play maker method when called.", async() => {
      const clonedGame = createFakeGame(game);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gamePlayMakerService.makeGamePlay).toHaveBeenCalledExactlyOnceWith(play, clonedGame);
    });

    it("should call remove obsolete upcoming plays method when called.", async() => {
      const clonedGame = createFakeGame(game);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gamePlayService.refreshUpcomingPlays).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call proceed to next game play method when called.", async() => {
      const clonedGame = createFakeGame(game);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gamePlayService.proceedToNextGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call handle game phase completion method when phase is ending.", async() => {
      const clonedGame = createFakeGame(game);
      mocks.gamePhaseHelper.isGamePhaseOver.mockReturnValue(true);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gameService.handleGamePhaseCompletion).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call generate current game history record method when called.", async() => {
      const clonedGame = createFakeGame(game);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordToInsert).toHaveBeenCalledExactlyOnceWith(clonedGame, game, play);
    });

    it("should call createGameHistoryRecord method when called.", async() => {
      const clonedGame = createFakeGame(game);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const currentGameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      mocks.gameHistoryRecordService.generateCurrentGameHistoryRecordToInsert.mockReturnValue(currentGameHistoryRecordToInsert);
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gameHistoryRecordService.createGameHistoryRecord).toHaveBeenCalledExactlyOnceWith(currentGameHistoryRecordToInsert);
    });

    it("should call update method when called.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(game._id, game);
    });

    it("should call set game over method when the game is done.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const gameVictoryData = createFakeGameVictory();
      mocks.gameVictoryService.isGameOver.mockReturnValue(true);
      mocks.gameVictoryService.generateGameVictoryData.mockReturnValue(gameVictoryData);
      mocks.gamePlayMakerService.makeGamePlay.mockReturnValue(game);
      mocks.gamePlayService.proceedToNextGamePlay.mockReturnValue(game);
      mocks.gamePlayService.refreshUpcomingPlays.mockReturnValue(game.upcomingPlays);
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(mocks.gameService.setGameAsOver).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should augment current game play when the game is not over.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(mocks.gamePlayService.augmentCurrentGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should not augment current game play when the game is over.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      mocks.gameVictoryService.isGameOver.mockReturnValue(true);
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(mocks.gamePlayService.augmentCurrentGamePlay).not.toHaveBeenCalled();
    });
  });

  describe("validateGameIsPlaying", () => {
    it("should throw error when game is not playing.", () => {
      const game = createFakeGame({ status: GameStatuses.CANCELED });
      const expectedException = new BadResourceMutationException(ApiResources.GAMES, game._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);

      expect(() => services.game["validateGameIsPlaying"](game)).toThrow(expectedException);
    });

    it("should not throw error when game is playing.", () => {
      const game = createFakeGame({ status: GameStatuses.PLAYING });

      expect(() => services.game["validateGameIsPlaying"](game)).not.toThrow();
    });
  });

  describe("handleGamePhaseCompletion", () => {
    const game = createFakeGame();

    beforeEach(() => {
      mocks.gamePhaseService.applyEndingGamePhaseOutcomes.mockResolvedValue(game);
      mocks.playerAttributeService.decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes.mockReturnValue(game);
      mocks.gamePhaseService.switchPhaseAndAppendGamePhaseUpcomingPlays.mockReturnValue(game);
      mocks.gamePhaseService.applyStartingGamePhaseOutcomes.mockReturnValue(game);
      mocks.gamePlayService.proceedToNextGamePlay.mockReturnValue(game);
      mocks.gamePlayService.refreshUpcomingPlays.mockReturnValue(game);
    });

    it("should call apply ending phase outcomes method when called.", async() => {
      await services.game["handleGamePhaseCompletion"](game);

      expect(mocks.gamePhaseService.applyEndingGamePhaseOutcomes).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call decrease remaining phases attributes to players method when called.", async() => {
      await services.game["handleGamePhaseCompletion"](game);

      expect(mocks.playerAttributeService.decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call switch phase method when called.", async() => {
      await services.game["handleGamePhaseCompletion"](game);

      expect(mocks.gamePhaseService.switchPhaseAndAppendGamePhaseUpcomingPlays).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call apply starting phase outcomes method when called.", async() => {
      await services.game["handleGamePhaseCompletion"](game);

      expect(mocks.gamePhaseService.applyStartingGamePhaseOutcomes).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call proceed to next game play method when called.", async() => {
      await services.game["handleGamePhaseCompletion"](game);

      expect(mocks.gamePlayService.proceedToNextGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should not call handle game phase completion method when phase is not ending.", async() => {
      mocks.gamePhaseHelper.isGamePhaseOver.mockReturnValue(false);
      const handleGamePhaseCompletionSpy = jest.spyOn(services.game as unknown as { handleGamePhaseCompletion }, "handleGamePhaseCompletion");
      await services.game["handleGamePhaseCompletion"](game);

      expect(handleGamePhaseCompletionSpy).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call handle game phase completion method when phase is ending.", async() => {
      mocks.gamePhaseHelper.isGamePhaseOver.mockReturnValue(false);
      mocks.gamePhaseHelper.isGamePhaseOver.mockReturnValueOnce(true);
      const handleGamePhaseCompletionSpy = jest.spyOn(services.game as unknown as { handleGamePhaseCompletion }, "handleGamePhaseCompletion");
      await services.game["handleGamePhaseCompletion"](game);

      expect(handleGamePhaseCompletionSpy).toHaveBeenCalledTimes(2);
      expect(handleGamePhaseCompletionSpy).toHaveBeenNthCalledWith(1, game);
      expect(handleGamePhaseCompletionSpy).toHaveBeenNthCalledWith(2, game);
    });
  });

  describe("updateGame", () => {
    it("should throw an error when game not found by update repository method.", async() => {
      const unknownObjectId = createFakeObjectId();
      mocks.gameRepository.updateOne.mockResolvedValue(null);
      const expectedException = new ResourceNotFoundException(ApiResources.GAMES, unknownObjectId.toString());

      await expect(services.game["updateGame"](unknownObjectId, { status: GameStatuses.OVER })).rejects.toStrictEqual<ResourceNotFoundException>(expectedException);
    });

    it("should return updated game when called.", async() => {
      const game = createFakeGame();
      const gameDataToUpdate: Partial<Game> = { status: GameStatuses.OVER };
      mocks.gameRepository.updateOne.mockResolvedValue(game);

      await expect(services.game["updateGame"](game._id, gameDataToUpdate)).resolves.toStrictEqual<Game>(game);
      expect(mocks.gameRepository.updateOne).toHaveBeenCalledExactlyOnceWith({ _id: game._id }, gameDataToUpdate);
    });
  });

  describe("setGameAsOver", () => {
    it("should set game as over when called.", () => {
      const game = createFakeGame({ status: GameStatuses.PLAYING });
      const gameVictoryData = createFakeGameVictory();
      mocks.gameVictoryService.generateGameVictoryData.mockReturnValue(gameVictoryData);
      const expectedGame = createFakeGame({
        ...game,
        status: GameStatuses.OVER,
        victory: gameVictoryData,
      });

      expect(services.game["setGameAsOver"](game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("updateGameAsOver", () => {
    beforeEach(() => {
      mocks.gameService.setGameAsOver = jest.spyOn(services.game as unknown as { setGameAsOver }, "setGameAsOver").mockImplementation();
      mocks.gameService.updateGame = jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockImplementation();
    });

    it("should set game as over when called.", async() => {
      const game = createFakeGame();
      mocks.gameService.setGameAsOver.mockReturnValue(game);
      await services.game["updateGameAsOver"](game);

      expect(mocks.gameService.setGameAsOver).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call update game when called.", async() => {
      const game = createFakeGame();
      mocks.gameService.setGameAsOver.mockReturnValue(game);
      await services.game["updateGameAsOver"](game);

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(game._id, game);
    });
  });
});