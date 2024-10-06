import { Injectable } from "@nestjs/common";

import { CreateGameFeedbackDto } from "@/modules/game/dto/create-game-feedback/create-game-feedback.dto";
import { createGameFeedbackToInsert } from "@/modules/game/helpers/game-feedback/game-feedback.factory";
import { GameFeedbackRepository } from "@/modules/game/providers/repositories/game-feedback/game-feedback.repository";
import { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import { Game } from "@/modules/game/schemas/game.schema";

import { ApiResources } from "@/shared/api/enums/api.enums";
import { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enums";
import { BadResourceMutationException } from "@/shared/exception/types/bad-resource-mutation-exception.types";

@Injectable()
export class GameFeedbackService {
  public constructor(private readonly gameFeedbackRepository: GameFeedbackRepository) {}

  public async createGameFeedback(game: Game, createGameFeedbackDto: CreateGameFeedbackDto): Promise<GameFeedback> {
    this.validateCreateGameFeedback(game);
    const gameFeedbackToInsert = createGameFeedbackToInsert({
      ...createGameFeedbackDto,
      gameId: game._id,
    });

    return this.gameFeedbackRepository.create(gameFeedbackToInsert);
  }

  private validateCreateGameFeedback(game: Game): void {
    if (game.feedback) {
      throw new BadResourceMutationException(ApiResources.GAMES, game._id.toString(), BadResourceMutationReasons.FEEDBACK_ALREADY_EXISTS);
    }
  }
}