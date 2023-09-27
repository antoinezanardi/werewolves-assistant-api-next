import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";

import { GameStatuses } from "@/modules/game/enums/game.enum";
import * as GamePhaseHelper from "@/modules/game/helpers/game-phase/game-phase.helper";
import * as GamePlayHelper from "@/modules/game/helpers/game-play/game-play.helper";
import * as GameVictoryHelper from "@/modules/game/helpers/game-victory/game-victory.helper";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePhaseService } from "@/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { GameService } from "@/modules/game/providers/services/game.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import { BadResourceMutationException } from "@/shared/exception/types/bad-resource-mutation-exception.type";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeGameVictory } from "@tests/factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGamePlaySurvivorsVote } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeMakeGamePlayDto } from "@tests/factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";

jest.mock("@/shared/exception/types/bad-resource-mutation-exception.type");
jest.mock("@/shared/exception/types/resource-not-found-exception.type");

describe("Game Service", () => {
  let mocks: {
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
    };
    gamePlayValidatorService: { validateGamePlayWithRelationsDto: jest.SpyInstance };
    gamePlayMakerService: { makeGamePlay: jest.SpyInstance };
    gamePhaseService: {
      applyEndingGamePhaseOutcomes: jest.SpyInstance;
      switchPhaseAndAppendGamePhaseUpcomingPlays: jest.SpyInstance;
      applyStartingGamePhaseOutcomes: jest.SpyInstance;
    };
    playerAttributeService: {
      decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes: jest.SpyInstance;
    };
    gameHelper: { getExpectedPlayersToPlay: jest.SpyInstance };
    gamePhaseHelper: { isGamePhaseOver: jest.SpyInstance };
    gamePlayHelper: { createMakeGamePlayDtoWithRelations: jest.SpyInstance };
    gameVictoryHelper: { isGameOver: jest.SpyInstance };

  };
  let services: { game: GameService };
  let repositories: { game: GameRepository };

  beforeEach(async() => {
    mocks = {
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
      },
      gamePlayValidatorService: { validateGamePlayWithRelationsDto: jest.fn() },
      gamePlayMakerService: { makeGamePlay: jest.fn() },
      gamePhaseService: {
        applyEndingGamePhaseOutcomes: jest.fn(),
        switchPhaseAndAppendGamePhaseUpcomingPlays: jest.fn(),
        applyStartingGamePhaseOutcomes: jest.fn(),
      },
      playerAttributeService: { decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes: jest.fn() },
      gameHelper: { getExpectedPlayersToPlay: jest.spyOn(GameHelper, "getExpectedPlayersToPlay").mockReturnValue([]) },
      gamePhaseHelper: { isGamePhaseOver: jest.spyOn(GamePhaseHelper, "isGamePhaseOver").mockImplementation() },
      gamePlayHelper: { createMakeGamePlayDtoWithRelations: jest.spyOn(GamePlayHelper, "createMakeGamePlayDtoWithRelations").mockImplementation() },
      gameVictoryHelper: { isGameOver: jest.spyOn(GameVictoryHelper, "isGameOver").mockImplementation() },
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
    let localMocks: { gameService: { updateGame: jest.SpyInstance } };
    const createdGame = createFakeGameWithCurrentPlay();
    
    beforeEach(() => {
      mocks.gameRepository.create.mockResolvedValue(createdGame);
      localMocks = { gameService: { updateGame: jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockResolvedValue(createdGame) } };
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

    it("should call updateGame repository method when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlayService.getUpcomingNightPlays.mockReturnValue([createFakeGamePlaySurvivorsVote()]);
      const expectedPlayersToPlay = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      mocks.gameHelper.getExpectedPlayersToPlay.mockReturnValue(expectedPlayersToPlay);
      await services.game.createGame(toCreateGame);
      const expectedGame = createFakeGameWithCurrentPlay(createdGame);
      expectedGame.currentPlay.source.players = expectedPlayersToPlay;

      expect(localMocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(createdGame._id, expectedGame);
    });
  });

  describe("cancelGame", () => {
    let localMocks: { gameService: { updateGame: jest.SpyInstance } };
    const existingPlayingGame = createFakeGame({ status: GameStatuses.PLAYING });

    beforeEach(() => {
      localMocks = { gameService: { updateGame: jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockReturnValue(existingPlayingGame) } };
    });

    it("should throw error when game is not playing.", async() => {
      const canceledGame = createFakeGame({ status: GameStatuses.CANCELED });

      await expect(services.game.cancelGame(canceledGame)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledExactlyOnceWith(ApiResources.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
    });

    it("should call update method when game can be canceled.", async() => {
      await services.game.cancelGame(existingPlayingGame);

      expect(localMocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(existingPlayingGame._id, { status: GameStatuses.CANCELED });
    });
  });

  describe("makeGamePlay", () => {
    let localMocks: {
      gameService: {
        handleGamePhaseCompletion: jest.SpyInstance ;
        updateGame: jest.SpyInstance;
        setGameAsOver: jest.SpyInstance;
      };
    };
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
      mocks.gameVictoryHelper.isGameOver.mockReturnValue(false);
      localMocks = {
        gameService: {
          handleGamePhaseCompletion: jest.spyOn(services.game as unknown as { handleGamePhaseCompletion }, "handleGamePhaseCompletion").mockResolvedValue(game),
          updateGame: jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockReturnValue(game),
          setGameAsOver: jest.spyOn(services.game as unknown as { setGameAsOver }, "setGameAsOver").mockReturnValue(game),
        },
      };
    });

    it("should throw an error when game is not playing.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const canceledGame = createFakeGame({ status: GameStatuses.CANCELED });

      await expect(services.game.makeGamePlay(canceledGame, makeGamePlayDto)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledExactlyOnceWith(ApiResources.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
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

      expect(localMocks.gameService.handleGamePhaseCompletion).toHaveBeenCalledExactlyOnceWith(game);
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

      expect(localMocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(game._id, game);
    });

    it("should call set game over method when the game is done.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const gameVictoryData = createFakeGameVictory();
      jest.spyOn(GameVictoryHelper, "generateGameVictoryData").mockReturnValue(gameVictoryData);
      mocks.gameVictoryHelper.isGameOver.mockReturnValue(true);
      mocks.gamePlayMakerService.makeGamePlay.mockReturnValue(game);
      mocks.gamePlayService.proceedToNextGamePlay.mockReturnValue(game);
      mocks.gamePlayService.refreshUpcomingPlays.mockReturnValue(game.upcomingPlays);
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(localMocks.gameService.setGameAsOver).toHaveBeenCalledExactlyOnceWith(game);
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
  });

  describe("updateGame", () => {
    it("should throw an error when game not found by update repository method.", async() => {
      const unknownObjectId = createFakeObjectId();
      mocks.gameRepository.updateOne.mockResolvedValue(null);

      await expect(services.game["updateGame"](unknownObjectId, { status: GameStatuses.OVER })).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(ApiResources.GAMES, unknownObjectId.toString());
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
      jest.spyOn(GameVictoryHelper, "generateGameVictoryData").mockReturnValue(gameVictoryData);
      const expectedGame = createFakeGame({
        ...game,
        status: GameStatuses.OVER,
        victory: gameVictoryData,
      });

      expect(services.game["setGameAsOver"](game)).toStrictEqual<Game>(expectedGame);
    });
  });
});