import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record/game-history-record.repository";
import { GameEventsGeneratorService } from "@/modules/game/providers/services/game-event/game-events-generator.service";
import { GameFeedbackService } from "@/modules/game/providers/services/game-feedback/game-feedback.service";
import { GameHistoryRecordToInsertGeneratorService } from "@/modules/game/providers/services/game-history/game-history-record-to-insert-generator.service";
import * as GamePhaseHelper from "@/modules/game/helpers/game-phase/game-phase.helpers";
import * as GamePlayHelper from "@/modules/game/helpers/game-play/game-play.helpers";
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

import { ApiResources } from "@/shared/api/enums/api.enums";
import { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enums";
import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enums";
import { BadResourceMutationException } from "@/shared/exception/types/bad-resource-mutation-exception.types";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.types";

import { createFakeCreateGameFeedbackDto } from "@tests/factories/game/dto/create-game-feedback/create-game-feedback.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeMakeGamePlayDto } from "@tests/factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGameFeedback } from "@tests/factories/game/schemas/game-feedback/game-feedback.factory";
import { createFakeGameHistoryRecord } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakeGamePlaySurvivorsVote } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameVictory } from "@tests/factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { getError } from "@tests/helpers/exception/exception.helpers";

describe("Game Service", () => {
  let mocks: {
    gameService: {
      handleTwilightPhaseCompletion: jest.SpyInstance;
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
      createGameHistoryRecord: jest.SpyInstance;
    };
    gameHistoryRecordToInsertGeneratorService: { generateCurrentGameHistoryRecordToInsert: jest.SpyInstance };
    gamePlayService: {
      getPhaseUpcomingPlays: jest.SpyInstance;
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
      isTwilightPhaseOver: jest.SpyInstance;
    };
    gameVictoryService: {
      isGameOver: jest.SpyInstance;
      generateGameVictoryData: jest.SpyInstance;
    };
    playerAttributeService: {
      decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes: jest.SpyInstance;
    };
    gameEventsGeneratorService: { generateGameEventsFromGameAndLastRecord: jest.SpyInstance };
    gameFeedbackService: { createGameFeedback: jest.SpyInstance };
    gamePhaseHelper: { isGamePhaseOver: jest.SpyInstance };
    gamePlayHelper: { createMakeGamePlayDtoWithRelations: jest.SpyInstance };
  };
  let services: { game: GameService };
  let repositories: { game: GameRepository };

  beforeEach(async() => {
    mocks = {
      gameService: {
        handleTwilightPhaseCompletion: jest.fn(),
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
        createGameHistoryRecord: jest.fn(),
      },
      gameHistoryRecordToInsertGeneratorService: { generateCurrentGameHistoryRecordToInsert: jest.fn() },
      gamePlayService: {
        getPhaseUpcomingPlays: jest.fn(),
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
        isTwilightPhaseOver: jest.fn(),
      },
      gameVictoryService: {
        isGameOver: jest.fn(),
        generateGameVictoryData: jest.fn(),
      },
      gameEventsGeneratorService: { generateGameEventsFromGameAndLastRecord: jest.fn() },
      gameFeedbackService: { createGameFeedback: jest.fn() },
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
          provide: GameHistoryRecordToInsertGeneratorService,
          useValue: mocks.gameHistoryRecordToInsertGeneratorService,
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
          provide: GameEventsGeneratorService,
          useValue: mocks.gameEventsGeneratorService,
        },
        {
          provide: GameFeedbackService,
          useValue: mocks.gameFeedbackService,
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
    const createdGame = createFakeGameWithCurrentPlay({ phase: createFakeGamePhase({ name: "twilight", tick: 1 }) });

    beforeEach(() => {
      mocks.gamePlayService.augmentCurrentGamePlay.mockReturnValue(createdGame);
      mocks.gameRepository.create.mockResolvedValue(createdGame);
      mocks.gameService.updateGame = jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockResolvedValue(createdGame);
    });

    it("should throw error when can't generate upcoming plays.", async() => {
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([]);
      const toCreateGame = createFakeCreateGameDto();
      const exceptedError = new UnexpectedException("createGame", UnexpectedExceptionReasons.CANT_GENERATE_GAME_PLAYS);
      const error = await getError<UnexpectedException>(async() => services.game.createGame(toCreateGame));

      expect(error).toStrictEqual<UnexpectedException>(exceptedError);
      expect(error).toHaveProperty("options", { description: "Can't generate game plays" });
    });

    it("should call createGame repository method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);
      const expectedGame = createFakeCreateGameDto({
        ...toCreateGame,
        currentPlay: createFakeGamePlaySurvivorsVote(),
        upcomingPlays: [],
      });

      expect(repositories.game.create).toHaveBeenCalledExactlyOnceWith(expectedGame);
    });

    it("should call createGame repository method with distinct player groups when player have groups.", async() => {
      const toCreateGame = createFakeCreateGameDto({
        players: [
          createFakeCreateGamePlayerDto({ group: "group1" }),
          createFakeCreateGamePlayerDto({ group: "group2" }),
        ],
      });
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);
      const expectedGame = createFakeCreateGameDto({
        ...toCreateGame,
        currentPlay: createFakeGamePlaySurvivorsVote(),
        upcomingPlays: [],
        playerGroups: ["group1", "group2"],
      });

      expect(repositories.game.create).toHaveBeenCalledExactlyOnceWith(expectedGame);
    });

    it("should call augmentCurrentGamePlay method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);

      expect(mocks.gamePlayService.augmentCurrentGamePlay).toHaveBeenCalledExactlyOnceWith(createdGame);
    });

    it("should set game phase as night when twilight phase is over.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      mocks.gamePhaseService.isTwilightPhaseOver.mockReturnValue(true);
      await services.game.createGame(toCreateGame);
      const expectedGame = createFakeGameWithCurrentPlay({
        ...createdGame,
        phase: createFakeGamePhase({
          ...createdGame.phase,
          name: "night",
        }),
      });

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(createdGame._id, expectedGame);
    });

    it("should not set game phase as night when twilight phase is not over.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      mocks.gamePhaseService.isTwilightPhaseOver.mockReturnValue(false);
      await services.game.createGame(toCreateGame);

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(createdGame._id, createdGame);
    });

    it("should call generate game events method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);

      expect(mocks.gameEventsGeneratorService.generateGameEventsFromGameAndLastRecord).toHaveBeenCalledExactlyOnceWith(createdGame);
    });

    it("should call updateGame repository method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getPhaseUpcomingPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      await services.game.createGame(toCreateGame);

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(createdGame._id, createdGame);
    });
  });

  describe("cancelGame", () => {
    const existingPlayingGame = createFakeGame({ status: "playing" });

    beforeEach(() => {
      mocks.gameService.updateGame = jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockResolvedValue(existingPlayingGame);
    });

    it("should throw error when game is not playing.", async() => {
      const canceledGame = createFakeGame({ status: "canceled" });
      const expectedException = new BadResourceMutationException(ApiResources.GAMES, canceledGame._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);
      const error = await getError<BadResourceMutationException>(async() => services.game.cancelGame(canceledGame));

      expect(error).toStrictEqual<BadResourceMutationException>(expectedException);
      expect(error).toHaveProperty("options", { description: "Game doesn't have status with value \"playing\"" });
    });

    it("should call update method when game can be canceled.", async() => {
      await services.game.cancelGame(existingPlayingGame);

      expect(mocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(existingPlayingGame._id, { status: "canceled" });
    });
  });

  describe("makeGamePlay", () => {
    const players = [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
    ];
    const game = createFakeGame({ status: "playing", players, currentPlay: createFakeGamePlaySurvivorsVote() });
    const play = createFakeMakeGamePlayWithRelationsDto();

    beforeEach(() => {
      mocks.gamePlayHelper.createMakeGamePlayDtoWithRelations.mockReturnValue(play);
      mocks.gamePlayMakerService.makeGamePlay.mockResolvedValue(game);
      mocks.gamePlayService.refreshUpcomingPlays.mockReturnValue(game);
      mocks.gamePlayService.proceedToNextGamePlay.mockReturnValue(game);
      mocks.gamePlayService.augmentCurrentGamePlay.mockReturnValue(game);
      mocks.gameVictoryService.isGameOver.mockReturnValue(false);
      mocks.gameService.handleTwilightPhaseCompletion = jest.spyOn(services.game as unknown as { handleTwilightPhaseCompletion }, "handleTwilightPhaseCompletion").mockReturnValue(game);
      mocks.gameService.handleGamePhaseCompletion = jest.spyOn(services.game as unknown as { handleGamePhaseCompletion }, "handleGamePhaseCompletion").mockResolvedValue(game);
      mocks.gameService.updateGame = jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockReturnValue(game);
      mocks.gameService.setGameAsOver = jest.spyOn(services.game as unknown as { setGameAsOver }, "setGameAsOver").mockReturnValue(game);
    });

    it("should throw an error when game is not playing.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const canceledGame = createFakeGame({ status: "canceled" });
      const expectedException = new BadResourceMutationException(ApiResources.GAMES, canceledGame._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);
      const error = await getError<BadResourceMutationException>(async() => services.game.makeGamePlay(canceledGame, makeGamePlayDto));

      expect(error).toStrictEqual<BadResourceMutationException>(expectedException);
      expect(error).toHaveProperty("options", { description: "Game doesn't have status with value \"playing\"" });
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

    it("should handle twilight phase completion when phase is twilight and phase is over.", async() => {
      const clonedGame = createFakeGame({
        ...game,
        phase: createFakeGamePhase({ name: "twilight", tick: 1 }),
      });
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      mocks.gamePhaseService.isTwilightPhaseOver.mockReturnValue(true);
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gameService.handleTwilightPhaseCompletion).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should not handle twilight phase completion when phase is not twilight.", async() => {
      const clonedGame = createFakeGame({
        ...game,
        phase: createFakeGamePhase({ name: "night", tick: 1 }),
      });
      mocks.gamePhaseService.isTwilightPhaseOver.mockReturnValue(true);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gameService.handleTwilightPhaseCompletion).not.toHaveBeenCalled();
    });

    it("should not handle twilight phase completion when phase is not over.", async() => {
      const clonedGame = createFakeGame({
        ...game,
        phase: createFakeGamePhase({ name: "twilight", tick: 1 }),
      });
      mocks.gamePhaseService.isTwilightPhaseOver.mockReturnValue(false);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(clonedGame, makeGamePlayDto);

      expect(mocks.gameService.handleTwilightPhaseCompletion).not.toHaveBeenCalled();
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

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordToInsert).toHaveBeenCalledExactlyOnceWith(clonedGame, game, play);
    });

    it("should call createGameHistoryRecord method when called.", async() => {
      const clonedGame = createFakeGame(game);
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const currentGameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordToInsert.mockReturnValue(currentGameHistoryRecordToInsert);
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

    it("should generate game events when the game is not over.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const gameHistoryRecord = createFakeGameHistoryRecord();
      mocks.gameHistoryRecordService.createGameHistoryRecord.mockResolvedValue(gameHistoryRecord);
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(mocks.gameEventsGeneratorService.generateGameEventsFromGameAndLastRecord).toHaveBeenCalledExactlyOnceWith(game, gameHistoryRecord);
    });
  });

  describe("createGameFeedback", () => {
    it("should create game feedback when called.", async() => {
      const game = createFakeGame();
      const createGameFeedbackDto = createFakeCreateGameFeedbackDto();
      const updatedGame = await services.game.createGameFeedback(game, createGameFeedbackDto);

      expect(mocks.gameFeedbackService.createGameFeedback).toHaveBeenCalledExactlyOnceWith(updatedGame, createGameFeedbackDto);
    });

    it("should return game with feedback when called.", async() => {
      const game = createFakeGame();
      const createGameFeedbackDto = createFakeCreateGameFeedbackDto();
      const feedback = createFakeGameFeedback();
      mocks.gameFeedbackService.createGameFeedback.mockResolvedValue(feedback);
      const expectedGame = createFakeGame({
        ...game,
        feedback,
      });

      await expect(services.game.createGameFeedback(game, createGameFeedbackDto)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });

  describe("validateGameIsPlaying", () => {
    it("should throw error when game is not playing.", async() => {
      const game = createFakeGame({ status: "canceled" });
      const expectedError = new BadResourceMutationException(ApiResources.GAMES, game._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);
      const error = await getError<BadResourceMutationException>(() => services.game["validateGameIsPlaying"](game));

      expect(error).toStrictEqual<BadResourceMutationException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Game doesn't have status with value \"playing\"" });
    });

    it("should not throw error when game is playing.", () => {
      const game = createFakeGame({ status: "playing" });

      expect(() => services.game["validateGameIsPlaying"](game)).not.toThrow();
    });
  });

  describe("handleTwilightPhaseCompletion", () => {
    const game = createFakeGame({ phase: createFakeGamePhase({ name: "twilight", tick: 133 }) });

    it("should set game phase as night and reset tick when called.", () => {
      const expectedGame = createFakeGame({
        ...game,
        phase: createFakeGamePhase({ name: "night", tick: 1 }),
      });

      expect(services.game["handleTwilightPhaseCompletion"](game)).toStrictEqual<Game>(expectedGame);
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
      const expectedError = new ResourceNotFoundException(ApiResources.GAMES, unknownObjectId.toString());
      const error = await getError<ResourceNotFoundException>(async() => services.game["updateGame"](unknownObjectId, { status: "over" }));

      expect(error).toStrictEqual<ResourceNotFoundException>(expectedError);
      expect(error).toHaveProperty("options", { description: undefined });
    });

    it("should return updated game when called.", async() => {
      const game = createFakeGame();
      const gameDataToUpdate: Partial<Game> = { status: "over" };
      mocks.gameRepository.updateOne.mockResolvedValue(game);

      await expect(services.game["updateGame"](game._id, gameDataToUpdate)).resolves.toStrictEqual<Game>(game);
      expect(mocks.gameRepository.updateOne).toHaveBeenCalledExactlyOnceWith({ _id: game._id }, gameDataToUpdate);
    });
  });

  describe("setGameAsOver", () => {
    it("should set game as over when called.", () => {
      const game = createFakeGame({ status: "playing" });
      const gameVictoryData = createFakeGameVictory();
      mocks.gameVictoryService.generateGameVictoryData.mockReturnValue(gameVictoryData);
      const expectedGame = createFakeGame({
        ...game,
        status: "over",
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