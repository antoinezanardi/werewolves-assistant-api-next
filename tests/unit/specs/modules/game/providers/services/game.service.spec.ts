import { faker } from "@faker-js/faker";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import { GAME_STATUSES } from "../../../../../../../src/modules/game/enums/game.enum";
import * as GameVictoryHelper from "../../../../../../../src/modules/game/helpers/game-victory/game-victory.helper";
import { GameHistoryRecordRepository } from "../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "../../../../../../../src/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlaysManagerService } from "../../../../../../../src/modules/game/providers/services/game-play/game-plays-manager.service";
import { GamePlaysValidatorService } from "../../../../../../../src/modules/game/providers/services/game-play/game-plays-validator.service";
import { GameService } from "../../../../../../../src/modules/game/providers/services/game.service";
import { API_RESOURCES } from "../../../../../../../src/shared/api/enums/api.enum";
import { BadResourceMutationException } from "../../../../../../../src/shared/exception/types/bad-resource-mutation-exception.type";
import { ResourceNotFoundException } from "../../../../../../../src/shared/exception/types/resource-not-found-exception.type";
import { createFakeCreateGameDto } from "../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayDto } from "../../../../../../factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGameVictory } from "../../../../../../factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createObjectIdFromString } from "../../../../../../helpers/mongoose/mongoose.helper";

jest.mock("../../../../../../../src/shared/exception/types/bad-resource-mutation-exception.type");
jest.mock("../../../../../../../src/shared/exception/types/resource-not-found-exception.type");

describe("Game Service", () => {
  let service: GameService;
  let repository: GameRepository;

  const gameRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  };

  const gameHistoryRecordRepositoryMock = {
    find: jest.fn(),
    create: jest.fn(),
  };
  
  const gamePlaysValidatorServiceMock = { validateGamePlayWithRelationsDtoData: jest.fn() };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
        {
          provide: GameHistoryRecordRepository,
          useValue: gameHistoryRecordRepositoryMock,
        },
        GamePlaysManagerService,
        {
          provide: GamePlaysValidatorService,
          useValue: gamePlaysValidatorServiceMock,
        },
        GameHistoryRecordService,
        GameService,
      ],
    }).compile();
    service = module.get<GameService>(GameService);
    repository = module.get<GameRepository>(GameRepository);
  });

  describe("getGames", () => {
    it("should get all games when called.", async() => {
      await service.getGames();
      expect(repository.find).toHaveBeenCalledWith();
    });
  });

  describe("getGameById", () => {
    const existingId = "good-id";
    const existingGame = createFakeGame();
    const unknownId = "bad-id";

    beforeEach(() => {
      when(gameRepositoryMock.findOne).calledWith({ _id: existingId }).mockResolvedValue(existingGame);
      when(gameRepositoryMock.findOne).calledWith({ _id: unknownId }).mockResolvedValue(null);
    });

    it("should return a game when called with existing id.", async() => {
      const result = await service.getGameById(existingId);
      expect(result).toStrictEqual(existingGame);
    });

    it("should throw an error when called with unknown id.", async() => {
      await expect(service.getGameById(unknownId)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledWith(API_RESOURCES.GAMES, unknownId);
    });
  });

  describe("createGame", () => {
    it("should create game when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      await service.createGame(toCreateGame);
      expect(repository.create).toHaveBeenCalledOnce();
    });
  });

  describe("getGameAndCheckPlayingStatus", () => {
    const existingPlayingId = createObjectIdFromString(faker.database.mongodbObjectId());
    const existingPlayingGame = createFakeGame({ _id: existingPlayingId, status: GAME_STATUSES.PLAYING });
    const existingDoneId = createObjectIdFromString(faker.database.mongodbObjectId());
    const existingDoneGame = createFakeGame({ _id: existingDoneId, status: GAME_STATUSES.OVER });
    const unknownId = createObjectIdFromString(faker.database.mongodbObjectId());

    beforeEach(() => {
      when(gameRepositoryMock.findOne).calledWith({ _id: existingPlayingId }).mockResolvedValue(existingPlayingGame);
      when(gameRepositoryMock.findOne).calledWith({ _id: existingDoneId }).mockResolvedValue(existingDoneGame);
      when(gameRepositoryMock.findOne).calledWith({ _id: unknownId }).mockResolvedValue(null);
    });

    it("should throw an error when called with unknown id.", async() => {
      await expect(service.getGameAndCheckPlayingStatus(unknownId)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledWith(API_RESOURCES.GAMES, unknownId.toString());
    });

    it("should throw an error when game doesn't have playing status.", async() => {
      await expect(service.getGameAndCheckPlayingStatus(existingDoneId)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledWith(API_RESOURCES.GAMES, existingDoneId.toString(), `Game doesn't have status with value "playing"`);
    });

    it("should return existing when game exists in database.", async() => {
      await expect(service.getGameAndCheckPlayingStatus(existingPlayingId)).resolves.toStrictEqual(existingPlayingGame);
    });
  });

  describe("cancelGame", () => {
    const existingPlayingGame = createFakeGame({ status: GAME_STATUSES.PLAYING });

    beforeEach(() => {
      jest.spyOn(service, "getGameAndCheckPlayingStatus").mockImplementation();
    });

    it("should throw error when game is not playing.", async() => {
      const canceledGame = createFakeGame({ status: GAME_STATUSES.CANCELED });
      await expect(service.cancelGame(canceledGame)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledWith(API_RESOURCES.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
    });
    
    it("should call update method from repository when game can be canceled.", async() => {
      await service.cancelGame(existingPlayingGame);
      expect(gameRepositoryMock.updateOne).toHaveBeenCalledWith({ _id: existingPlayingGame._id }, { status: GAME_STATUSES.CANCELED });
    });

    it("should throw an error when game not found by update repository method.", async() => {
      gameRepositoryMock.updateOne.mockResolvedValue(null);
      await expect(service.cancelGame(existingPlayingGame)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledWith(API_RESOURCES.GAMES, existingPlayingGame._id.toString());
    });
  });

  describe("makeGamePlay", () => {
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

    beforeEach(() => {
      gameRepositoryMock.updateOne.mockResolvedValue(game);
    });

    it("should throw an error when game is not playing.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const canceledGame = createFakeGame({ status: GAME_STATUSES.CANCELED });
      await expect(service.makeGamePlay(canceledGame, makeGamePlayDto)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledWith(API_RESOURCES.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
    });

    it("should call play validator when called.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await expect(service.makeGamePlay(game, makeGamePlayDto)).resolves.toStrictEqual(game);
      expect(gamePlaysValidatorServiceMock.validateGamePlayWithRelationsDtoData).toHaveBeenCalledOnce();
    });

    it("should throw an error when game not found by update repository method.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      gameRepositoryMock.updateOne.mockResolvedValue(null);
      await expect(service.makeGamePlay(game, makeGamePlayDto)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledWith(API_RESOURCES.GAMES, game._id.toString());
    });

    it("should set game as over when the game is done.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const gameVictoryData = createFakeGameVictory();
      jest.spyOn(GameVictoryHelper, "generateGameVictoryData").mockReturnValue(gameVictoryData);
      await service.makeGamePlay(soonToBeOverGame, makeGamePlayDto);
      expect(gameRepositoryMock.updateOne).toHaveBeenCalledWith({ _id: soonToBeOverGame._id }, { status: GAME_STATUSES.OVER, victory: gameVictoryData });
    });
  });
});