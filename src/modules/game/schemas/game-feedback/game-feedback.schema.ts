import { GAME_FEEDBACK_API_PROPERTIES, GAME_FEEDBACK_FIELDS_SPECS } from "@/modules/game/schemas/game-feedback/game-feedback.schema.constants";
import { toObjectId } from "@/shared/validation/transformers/validation.transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, type ApiPropertyOptions } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
  versionKey: false,
})
class GameFeedback {
  @ApiProperty(GAME_FEEDBACK_API_PROPERTIES._id as ApiPropertyOptions)
  @Transform(toObjectId)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(GAME_FEEDBACK_API_PROPERTIES.gameId as ApiPropertyOptions)
  @Prop(GAME_FEEDBACK_FIELDS_SPECS.gameId)
  @Type(() => String)
  @Expose()
  public gameId: Types.ObjectId;

  @ApiProperty(GAME_FEEDBACK_API_PROPERTIES.score as ApiPropertyOptions)
  @Prop(GAME_FEEDBACK_FIELDS_SPECS.score)
  @Expose()
  public score: number;

  @ApiProperty(GAME_FEEDBACK_API_PROPERTIES.review as ApiPropertyOptions)
  @Prop(GAME_FEEDBACK_FIELDS_SPECS.review)
  @Expose()
  public review?: string;

  @ApiProperty(GAME_FEEDBACK_API_PROPERTIES.hasEncounteredError as ApiPropertyOptions)
  @Prop(GAME_FEEDBACK_FIELDS_SPECS.hasEncounteredError)
  public hasEncounteredError: boolean;

  @ApiProperty(GAME_FEEDBACK_API_PROPERTIES.createdAt as ApiPropertyOptions)
  @Type(() => Date)
  @Expose()
  public createdAt: Date;
}

const GAME_FEEDBACK_SCHEMA = SchemaFactory.createForClass(GameFeedback);

export {
  GameFeedback,
  GAME_FEEDBACK_SCHEMA,
};