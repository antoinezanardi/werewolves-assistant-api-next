import { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import { OmitType } from "@nestjs/swagger";
import type { HydratedDocument } from "mongoose";

class GameFeedbackToInsert extends OmitType(GameFeedback, ["_id", "createdAt"] as const) {}

type GameFeedbackDocument = HydratedDocument<GameFeedback>;

export {
  GameFeedbackToInsert,
};

export type {
  GameFeedbackDocument,
};