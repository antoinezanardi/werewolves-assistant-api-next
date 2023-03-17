import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import { GameRepository } from "../../../../../src/modules/game/game.repository";
import { GameService } from "../../../../../src/modules/game/game.service";
import { createFakeCreateGameDto } from "../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGame } from "../../../../factories/game/schemas/game.schema.factory";

describe("Game Service", () => {
  let service: GameService;
  let repository: GameRepository;

  const gameRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
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
});