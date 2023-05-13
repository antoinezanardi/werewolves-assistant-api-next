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
import { createFakeCreateGameDto } from "../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayDto } from "../../../../../../factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGameVictory } from "../../../../../../factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createObjectIdFromString } from "../../../../../../helpers/mongoose/mongoose.helper";

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
      await expect(service.getGameById(unknownId)).rejects.toThrow(`Game with id "${unknownId}" not found`);
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
      await expect(service.getGameAndCheckPlayingStatus(unknownId)).rejects.toThrow(`Game with id "${unknownId.toString()}" not found`);
    });

    it("should throw an error when game doesn't have playing status.", async() => {
      await expect(service.getGameAndCheckPlayingStatus(existingDoneId)).rejects.toThrow(`Bad mutation for Game with id "${existingDoneId.toString()}" : Game doesn't have status with value "playing"`);
    });

    it("should return existing when game exists in database.", async() => {
      await expect(service.getGameAndCheckPlayingStatus(existingPlayingId)).resolves.toStrictEqual(existingPlayingGame);
    });
  });

  describe("cancelGameById", () => {
    const existingPlayingId = createObjectIdFromString(faker.database.mongodbObjectId());
    
    beforeEach(() => {
      jest.spyOn(service, "getGameAndCheckPlayingStatus").mockImplementation();
    });

    it("should call update method from repository when game can be canceled.", async() => {
      await service.cancelGameById(existingPlayingId);
      expect(gameRepositoryMock.updateOne).toHaveBeenCalledWith({ _id: existingPlayingId }, { status: GAME_STATUSES.CANCELED });
    });

    it("should throw an error when game not found by update repository method.", async() => {
      gameRepositoryMock.updateOne.mockResolvedValue(null);
      await expect(service.cancelGameById(existingPlayingId)).rejects.toThrow(`Game with id "${existingPlayingId.toString()}" not found`);
    });
  });

  describe("makeGamePlay", () => {
    const gameId = createObjectIdFromString(faker.database.mongodbObjectId());
    const soonToBeOverGameId = createObjectIdFromString(faker.database.mongodbObjectId());
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
    let getGameAndCheckPlayingStatusMock: jest.SpyInstance;
    
    beforeEach(() => {
      getGameAndCheckPlayingStatusMock = jest.spyOn(service, "getGameAndCheckPlayingStatus");
      when(getGameAndCheckPlayingStatusMock).calledWith(gameId).mockResolvedValue(game);
      when(getGameAndCheckPlayingStatusMock).calledWith(soonToBeOverGameId).mockResolvedValue(soonToBeOverGame);
      gameRepositoryMock.updateOne.mockResolvedValue(game);
    });

    it("should call play validator when called.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      await expect(service.makeGamePlay(gameId, makeGamePlayDto)).resolves.toStrictEqual(game);
      expect(gamePlaysValidatorServiceMock.validateGamePlayWithRelationsDtoData).toHaveBeenCalledOnce();
    });

    it("should throw an error when game not found by update repository method.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      gameRepositoryMock.updateOne.mockResolvedValue(null);
      await expect(service.makeGamePlay(gameId, makeGamePlayDto)).rejects.toThrow(`Game with id "${gameId.toString()}" not found`);
    });

    it("should set game as over when the game is done.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const gameVictoryData = createFakeGameVictory();
      jest.spyOn(GameVictoryHelper, "generateGameVictoryData").mockReturnValue(gameVictoryData);
      await service.makeGamePlay(soonToBeOverGameId, makeGamePlayDto);
      expect(gameRepositoryMock.updateOne).toHaveBeenCalledWith({ _id: soonToBeOverGameId }, { status: GAME_STATUSES.OVER, victory: gameVictoryData });
    });
  });
});