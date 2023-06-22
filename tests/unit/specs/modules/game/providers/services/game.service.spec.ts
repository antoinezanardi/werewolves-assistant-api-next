import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { GAME_STATUSES } from "../../../../../../../src/modules/game/enums/game.enum";
import * as GamePlayerHelper from "../../../../../../../src/modules/game/helpers/game-play/game-play.helper";
import * as GameVictoryHelper from "../../../../../../../src/modules/game/helpers/game-victory/game-victory.helper";
import { GameHistoryRecordRepository } from "../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "../../../../../../../src/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlaysMakerService } from "../../../../../../../src/modules/game/providers/services/game-play/game-plays-maker.service";
import { GamePlaysManagerService } from "../../../../../../../src/modules/game/providers/services/game-play/game-plays-manager.service";
import { GamePlaysValidatorService } from "../../../../../../../src/modules/game/providers/services/game-play/game-plays-validator.service";
import { GameService } from "../../../../../../../src/modules/game/providers/services/game.service";
import type { Game } from "../../../../../../../src/modules/game/schemas/game.schema";
import { API_RESOURCES } from "../../../../../../../src/shared/api/enums/api.enum";
import { UNEXPECTED_EXCEPTION_REASONS } from "../../../../../../../src/shared/exception/enums/unexpected-exception.enum";
import { BadResourceMutationException } from "../../../../../../../src/shared/exception/types/bad-resource-mutation-exception.type";
import { ResourceNotFoundException } from "../../../../../../../src/shared/exception/types/resource-not-found-exception.type";
import { UnexpectedException } from "../../../../../../../src/shared/exception/types/unexpected-exception.type";
import { createFakeCreateGameDto } from "../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeMakeGamePlayDto } from "../../../../../../factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGamePlayAllVote } from "../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameVictory } from "../../../../../../factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeObjectId } from "../../../../../../factories/shared/mongoose/mongoose.factory";

jest.mock("../../../../../../../src/shared/exception/types/bad-resource-mutation-exception.type");
jest.mock("../../../../../../../src/shared/exception/types/resource-not-found-exception.type");

describe("Game Service", () => {
  let mocks: {
    gameRepository: {
      find: jest.SpyInstance;
      findOne: jest.SpyInstance;
      create: jest.SpyInstance;
      updateOne: jest.SpyInstance;
    };
    gameHistoryRecordRepository: {
      find: jest.SpyInstance;
      create: jest.SpyInstance;
    };
    gamePlaysManagerService: {
      getUpcomingNightPlays: jest.SpyInstance;
      proceedToNextGamePlay: jest.SpyInstance;
    };
    gamePlaysValidatorService: { validateGamePlayWithRelationsDtoData: jest.SpyInstance };
    gamePlaysMakerService: { makeGamePlay: jest.SpyInstance };
    gamePlayerHelper: { createMakeGamePlayDtoWithRelations: jest.SpyInstance };
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
      gameHistoryRecordRepository: {
        find: jest.fn(),
        create: jest.fn(),
      },
      gamePlaysManagerService: {
        getUpcomingNightPlays: jest.fn(),
        proceedToNextGamePlay: jest.fn(),
      },
      gamePlaysValidatorService: { validateGamePlayWithRelationsDtoData: jest.fn() },
      gamePlaysMakerService: { makeGamePlay: jest.fn() },
      gamePlayerHelper: { createMakeGamePlayDtoWithRelations: jest.spyOn(GamePlayerHelper, "createMakeGamePlayDtoWithRelations").mockImplementation() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameRepository,
          useValue: mocks.gameRepository,
        },
        {
          provide: GameHistoryRecordRepository,
          useValue: mocks.gameHistoryRecordRepository,
        },
        {
          provide: GamePlaysManagerService,
          useValue: mocks.gamePlaysManagerService,
        },
        {
          provide: GamePlaysValidatorService,
          useValue: mocks.gamePlaysValidatorService,
        },
        {
          provide: GamePlaysMakerService,
          useValue: mocks.gamePlaysMakerService,
        },
        GameHistoryRecordService,
        GameService,
      ],
    }).compile();

    services = { game: module.get<GameService>(GameService) };
    repositories = { game: module.get<GameRepository>(GameRepository) };
  });

  describe("getGames", () => {
    it("should get all games when called.", async() => {
      await services.game.getGames();

      expect(repositories.game.find).toHaveBeenCalledWith();
    });
  });

  describe("createGame", () => {
    it("should throw error when can't generate upcoming plays.", async() => {
      mocks.gamePlaysManagerService.getUpcomingNightPlays.mockReturnValue([]);
      const toCreateGame = createFakeCreateGameDto();
      const exception = new UnexpectedException("createGame", UNEXPECTED_EXCEPTION_REASONS.CANT_GENERATE_GAME_PLAYS);

      await expect(services.game.createGame(toCreateGame)).rejects.toThrow(exception);
    });

    it("should create game when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      mocks.gamePlaysManagerService.getUpcomingNightPlays.mockReturnValue([createFakeGamePlayAllVote()]);
      await services.game.createGame(toCreateGame);

      expect(repositories.game.create).toHaveBeenCalledOnce();
    });
  });

  describe("cancelGame", () => {
    let localMocks: { gameService: { updateGame: jest.SpyInstance } };
    const existingPlayingGame = createFakeGame({ status: GAME_STATUSES.PLAYING });

    beforeEach(() => {
      localMocks = { gameService: { updateGame: jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockReturnValue(existingPlayingGame) } };
    });
    
    it("should throw error when game is not playing.", async() => {
      const canceledGame = createFakeGame({ status: GAME_STATUSES.CANCELED });

      await expect(services.game.cancelGame(canceledGame)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledWith(API_RESOURCES.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
    });

    it("should call update method when game can be canceled.", async() => {
      await services.game.cancelGame(existingPlayingGame);
      
      expect(localMocks.gameService.updateGame).toHaveBeenCalledWith(existingPlayingGame._id, { status: GAME_STATUSES.CANCELED });
    });
  });

  describe("makeGamePlay", () => {
    let localMocks: { gameService: { updateGame: jest.SpyInstance; setGameAsOver: jest.SpyInstance } };
    const players = [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
    ];
    const game = createFakeGame({ status: GAME_STATUSES.PLAYING, players });
    const nearlyAllDeadPlayers = [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer({ isAlive: false }),
      createFakeVillagerAlivePlayer({ isAlive: false }),
      createFakeVillagerAlivePlayer({ isAlive: false }),
    ];
    const soonToBeOverGame = createFakeGame({ status: GAME_STATUSES.PLAYING, players: nearlyAllDeadPlayers });
    const play = createFakeMakeGamePlayWithRelationsDto();

    beforeEach(() => {
      mocks.gamePlaysMakerService.makeGamePlay.mockReturnValue(game);
      mocks.gamePlaysManagerService.proceedToNextGamePlay.mockReturnValue(game);
      mocks.gamePlayerHelper.createMakeGamePlayDtoWithRelations.mockReturnValue(play);
      localMocks = {
        gameService: {
          updateGame: jest.spyOn(services.game as unknown as { updateGame }, "updateGame").mockReturnValue(game),
          setGameAsOver: jest.spyOn(services.game as unknown as { setGameAsOver }, "setGameAsOver").mockReturnValue(game),
        },
      };
    });

    it("should throw an error when game is not playing.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const canceledGame = createFakeGame({ status: GAME_STATUSES.CANCELED });

      await expect(services.game.makeGamePlay(canceledGame, makeGamePlayDto)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledWith(API_RESOURCES.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
    });

    it("should call play validator method when called.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(mocks.gamePlaysValidatorService.validateGamePlayWithRelationsDtoData).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call play maker method when called.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(mocks.gamePlaysMakerService.makeGamePlay).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call update method when game can be canceled.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await services.game.makeGamePlay(game, makeGamePlayDto);

      expect(localMocks.gameService.updateGame).toHaveBeenCalledExactlyOnceWith(game._id, game);
    });

    it("should call set game over method when the game is done.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const gameVictoryData = createFakeGameVictory();
      jest.spyOn(GameVictoryHelper, "generateGameVictoryData").mockReturnValue(gameVictoryData);
      mocks.gamePlaysMakerService.makeGamePlay.mockReturnValue(soonToBeOverGame);
      mocks.gamePlaysManagerService.proceedToNextGamePlay.mockReturnValue(soonToBeOverGame);
      await services.game.makeGamePlay(soonToBeOverGame, makeGamePlayDto);

      expect(localMocks.gameService.setGameAsOver).toHaveBeenCalledWith(soonToBeOverGame);
    });
  });

  describe("updateGame", () => {
    it("should throw an error when game not found by update repository method.", async() => {
      const unknownObjectId = createFakeObjectId();
      mocks.gameRepository.updateOne.mockResolvedValue(null);

      await expect(services.game["updateGame"](unknownObjectId, { status: GAME_STATUSES.OVER })).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledWith(API_RESOURCES.GAMES, unknownObjectId.toString());
    });

    it("should return updated game when called.", async() => {
      const game = createFakeGame();
      const gameDataToUpdate: Partial<Game> = { status: GAME_STATUSES.OVER };
      mocks.gameRepository.updateOne.mockResolvedValue(game);

      await expect(services.game["updateGame"](game._id, gameDataToUpdate)).resolves.toStrictEqual<Game>(game);
      expect(mocks.gameRepository.updateOne).toHaveBeenCalledWith({ _id: game._id }, gameDataToUpdate);
    });
  });

  describe("setGameAsOver", () => {
    it("should set game as over when called.", () => {
      const game = createFakeGame({ status: GAME_STATUSES.PLAYING });
      const gameVictoryData = createFakeGameVictory();
      jest.spyOn(GameVictoryHelper, "generateGameVictoryData").mockReturnValue(gameVictoryData);
      const expectedGame = createFakeGame({
        ...game,
        status: GAME_STATUSES.OVER,
        victory: gameVictoryData,
      });

      expect(services.game["setGameAsOver"](game)).toStrictEqual<Game>(expectedGame);
    });
  });
});