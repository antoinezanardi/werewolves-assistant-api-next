import { GameFeedbackRepository } from "@/modules/game/providers/repositories/game-feedback/game-feedback.repository";
import { GameFeedbackService } from "@/modules/game/providers/services/game-feedback/game-feedback.service";
import { ApiResources } from "@/shared/api/enums/api.enums";
import { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enum";
import { BadResourceMutationException } from "@/shared/exception/types/bad-resource-mutation-exception.types";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { createFakeCreateGameFeedbackDto } from "@tests/factories/game/dto/create-game-feedback/create-game-feedback.dto.factory";
import { createFakeGameFeedback, createFakeGameFeedbackToInsert } from "@tests/factories/game/schemas/game-feedback/game-feedback.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { getError } from "@tests/helpers/exception/exception.helpers";

describe("Game Feedback Service", () => {
  let mocks: {
    gameFeedbackService: {
      validateCreateGameFeedback: jest.SpyInstance;
    };
    gameFeedbackRepository: {
      create: jest.SpyInstance;
    };
  };
  let services: { gameFeedBack: GameFeedbackService };

  beforeEach(async() => {
    mocks = {
      gameFeedbackService: {
        validateCreateGameFeedback: jest.fn(),
      },
      gameFeedbackRepository: {
        create: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameFeedbackRepository,
          useValue: mocks.gameFeedbackRepository,
        },
        GameFeedbackService,
      ],
    }).compile();

    services = { gameFeedBack: module.get<GameFeedbackService>(GameFeedbackService) };
  });

  describe("createGameFeedback", () => {
    beforeEach(() => {
      mocks.gameFeedbackService.validateCreateGameFeedback = jest.spyOn(services.gameFeedBack as unknown as { validateCreateGameFeedback }, "validateCreateGameFeedback");
    });

    it("should validate create game feedback when called.", async() => {
      const game = createFakeGame();
      const createGameFeedbackDto = createFakeCreateGameFeedbackDto();
      await services.gameFeedBack.createGameFeedback(game, createGameFeedbackDto);

      expect(mocks.gameFeedbackService.validateCreateGameFeedback).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should create game feedback when called.", async() => {
      const game = createFakeGame();
      const createGameFeedbackDto = createFakeCreateGameFeedbackDto();
      await services.gameFeedBack.createGameFeedback(game, createGameFeedbackDto);
      const expectedGameFeedbackToInsert = createFakeGameFeedbackToInsert({
        gameId: game._id,
        ...createGameFeedbackDto,
      });

      expect(mocks.gameFeedbackRepository.create).toHaveBeenCalledExactlyOnceWith(expectedGameFeedbackToInsert);
    });
  });

  describe("validateCreateGameFeedback", () => {
    it("should throw Bad Resource Mutation Exception when feedback already exists.", async() => {
      const game = createFakeGame({ feedback: createFakeGameFeedback() });
      const expectedError = new BadResourceMutationException(ApiResources.GAMES, game._id.toString(), BadResourceMutationReasons.FEEDBACK_ALREADY_EXISTS);
      const error = await getError(() => services.gameFeedBack["validateCreateGameFeedback"](game));

      expect(error).toStrictEqual<BadResourceMutationException>(expectedError);
    });

    it("should not throw Bad Resource Mutation Exception when feedback does not exist.", () => {
      const game = createFakeGame();

      expect(() => services.gameFeedBack["validateCreateGameFeedback"](game)).not.toThrow();
    });
  });
});