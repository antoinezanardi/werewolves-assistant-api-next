import { faker } from "@faker-js/faker";
import { BadRequestException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { GetGameByIdPipe } from "../../../../../../../src/modules/game/controllers/pipes/get-game-by-id.pipe";
import { GameRepository } from "../../../../../../../src/modules/game/providers/repositories/game.repository";
import { API_RESOURCES } from "../../../../../../../src/shared/api/enums/api.enum";
import { ResourceNotFoundException } from "../../../../../../../src/shared/exception/types/resource-not-found-exception.type";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";
import { createObjectIdFromString } from "../../../../../../helpers/mongoose/mongoose.helper";

describe("Get Game By Id Pipe", () => {
  let pipe: GetGameByIdPipe;
  
  const gameRepositoryMock = { findOne: jest.fn() };
  
  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameRepository,
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
      ],
    }).compile();
    
    const gameRepository = module.get<GameRepository>(GameRepository);
    pipe = new GetGameByIdPipe(gameRepository);
  });
  
  describe("transform", () => {
    const gameId = faker.database.mongodbObjectId();

    it("should throw error when value is not a valid object id.", async() => {
      const expectedError = new BadRequestException("Validation failed (Mongo ObjectId is expected)");

      await expect(pipe.transform("bad-id")).rejects.toThrow(expectedError);
    });

    it("should throw error when game is not found.", async() => {
      gameRepositoryMock.findOne.mockResolvedValue(null);
      const expectedError = new ResourceNotFoundException(API_RESOURCES.GAMES, gameId.toString());

      await expect(pipe.transform(gameId)).rejects.toThrow(expectedError);
    });
    
    it("should return existing game when game is found.", async() => {
      const game = createFakeGame();
      gameRepositoryMock.findOne.mockResolvedValue(game);
      
      await expect(pipe.transform(gameId)).resolves.toStrictEqual(game);
      expect(gameRepositoryMock.findOne).toHaveBeenCalledOnceWith({ _id: createObjectIdFromString(gameId) });
    });
  });
});