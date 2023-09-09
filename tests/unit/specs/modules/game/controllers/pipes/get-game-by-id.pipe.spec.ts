import { faker } from "@faker-js/faker";
import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";

import { GetGameByIdPipe } from "@/modules/game/controllers/pipes/get-game-by-id.pipe";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";

import { createObjectIdFromString } from "@tests/helpers/mongoose/mongoose.helper";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";

describe("Get Game By Id Pipe", () => {
  let getGameByIdPipe: GetGameByIdPipe;
  let mocks: { gameRepository: { findOne: jest.SpyInstance } };
  let repositories: { game: GameRepository };
  
  beforeEach(async() => {
    mocks = { gameRepository: { findOne: jest.fn() } };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameRepository,
        {
          provide: GameRepository,
          useValue: mocks.gameRepository,
        },
      ],
    }).compile();
    
    repositories = { game: module.get<GameRepository>(GameRepository) };
    getGameByIdPipe = new GetGameByIdPipe(repositories.game);
  });
  
  describe("transform", () => {
    const gameId = faker.database.mongodbObjectId();

    it("should throw error when value is not a valid object id.", async() => {
      const expectedError = new BadRequestException("Validation failed (Mongo ObjectId is expected)");

      await expect(getGameByIdPipe.transform("bad-id")).rejects.toThrow(expectedError);
    });

    it("should throw error when game is not found.", async() => {
      mocks.gameRepository.findOne.mockResolvedValue(null);
      const expectedError = new ResourceNotFoundException(ApiResources.GAMES, gameId.toString());

      await expect(getGameByIdPipe.transform(gameId)).rejects.toThrow(expectedError);
    });
    
    it("should return existing game when game is found.", async() => {
      const game = createFakeGame();
      mocks.gameRepository.findOne.mockResolvedValue(game);
      
      await expect(getGameByIdPipe.transform(gameId)).resolves.toStrictEqual(game);
      expect(mocks.gameRepository.findOne).toHaveBeenCalledExactlyOnceWith({ _id: createObjectIdFromString(gameId) });
    });
  });
});