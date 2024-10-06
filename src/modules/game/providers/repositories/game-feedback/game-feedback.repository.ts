import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GameFeedbackDocument, GameFeedbackToInsert } from "@/modules/game/types/game-feedback/game-feedback.types";
import { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";

@Injectable()
export class GameFeedbackRepository {
  public constructor(@InjectModel(GameFeedback.name) private readonly gameFeedbackModel: Model<GameFeedbackDocument>) {}

  public async create(gameFeedback: GameFeedbackToInsert): Promise<GameFeedback> {
    return this.gameFeedbackModel.create(gameFeedback);
  }
}