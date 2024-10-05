import type { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { SchemaTypes } from "mongoose";
import type { ReadonlyDeep } from "type-fest";

const GAME_FEEDBACK_FIELDS_SPECS = {
  _id: { required: true },
  gameId: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  score: {
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    required: false,
    maxLength: 1000,
  },
  hasEncounteredError: {
    required: true,
  },
  createdAt: {
    required: true,
  },
} as const satisfies Record<keyof GameFeedback, MongoosePropOptions>;

const GAME_FEEDBACK_API_PROPERTIES: ReadonlyDeep<Record<keyof GameFeedback, ApiPropertyOptions>> = {
  _id: {
    description: "Game feedback's Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FEEDBACK_FIELDS_SPECS._id),
  },
  gameId: {
    description: "Game's Mongo ObjectId related to this feedback",
    example: "507f1f77bcf86cd799439011",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FEEDBACK_FIELDS_SPECS.gameId),
  },
  score: {
    description: "Game feedback's score",
    example: 4,
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FEEDBACK_FIELDS_SPECS.score),
  },
  review: {
    description: "Game feedback's review",
    example: "The game was awesome!",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FEEDBACK_FIELDS_SPECS.review),
  },
  hasEncounteredError: {
    description: "Whether the game has encountered an error",
    example: false,
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FEEDBACK_FIELDS_SPECS.hasEncounteredError),
  },
  createdAt: {
    description: "Game feedback's creation date",
    example: "2021-01-01T00:00:00.000Z",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_FEEDBACK_FIELDS_SPECS.createdAt),
  },
};

export {
  GAME_FEEDBACK_FIELDS_SPECS,
  GAME_FEEDBACK_API_PROPERTIES,
};