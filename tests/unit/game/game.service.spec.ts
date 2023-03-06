import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { GameRepository } from "../../../src/game/game.repository";
import { GameService } from "../../../src/game/game.service";

describe("Game Service", () => {
  let service: GameService;
  let repository: GameRepository;

  const gameRepositoryMock = {
    find: jest.fn(),
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

    it("should create game when called.", async() => {
      await service.createGame({});
      expect(repository.create).toHaveBeenCalledWith({});
    });
  });
});