import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import { GAME_STATUSES } from "../../../../../../../src/modules/game/enums/game.enum";
import { GameRepository } from "../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GamePlaysManagerService } from "../../../../../../../src/modules/game/providers/services/game-plays-manager.service";
import { GameService } from "../../../../../../../src/modules/game/providers/services/game.service";
import { createFakeCreateGameDto } from "../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";

describe("Game Service", () => {
  let service: GameService;
  let repository: GameRepository;

  const gameRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
        GamePlaysManagerService,
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
      when(gameRepositoryMock.findOne).calledWith({ id: existingId }).mockResolvedValue(existingGame);
      when(gameRepositoryMock.findOne).calledWith({ id: unknownId }).mockResolvedValue(null);
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
      expect(repository.create).toHaveBeenCalledWith(toCreateGame);
    });
  });

  describe("cancelGameById", () => {
    const existingPlayingId = "playing-id";
    const existingPlayingGame = createFakeGame({ _id: existingPlayingId, status: GAME_STATUSES.PLAYING });
    const existingDoneId = "done-id";
    const existingDoneGame = createFakeGame({ _id: existingDoneId, status: GAME_STATUSES.DONE });
    const unknownId = "bad-id";

    beforeEach(() => {
      when(gameRepositoryMock.findOne).calledWith({ id: existingPlayingId }).mockResolvedValue(existingPlayingGame);
      when(gameRepositoryMock.findOne).calledWith({ id: existingDoneId }).mockResolvedValue(existingDoneGame);
      when(gameRepositoryMock.findOne).calledWith({ id: unknownId }).mockResolvedValue(null);
    });

    it("should call update method from repository when game can be canceled.", async() => {
      await service.cancelGameById(existingPlayingId);
      expect(gameRepositoryMock.updateOne).toHaveBeenCalledWith({ id: existingPlayingId }, { status: GAME_STATUSES.CANCELED });
    });

    it("should throw an error when called with unknown id.", async() => {
      await expect(service.cancelGameById(unknownId)).rejects.toThrow(`Game with id "${unknownId}" not found`);
    });

    it("should throw an error when game doesn't have playing status.", async() => {
      await expect(service.cancelGameById(existingDoneId)).rejects.toThrow(`Bad mutation for Game with id "${existingDoneId}" : Game doesn't have status with value "playing"`);
    });

    it("should throw an error when game not found by update repository method.", async() => {
      gameRepositoryMock.updateOne.mockResolvedValue(null);
      await expect(service.cancelGameById(existingPlayingId)).rejects.toThrow(`Game with id "${existingPlayingId}" not found`);
    });
  });
});