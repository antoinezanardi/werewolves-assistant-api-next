import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_API_PROPERTIES, GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SPECS_FIELDS } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligibile-targets-boudaries/game-play-eligible-targets-boundaries.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlayEligibleTargetsBoundaries {
  @ApiProperty(GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_API_PROPERTIES.min as ApiPropertyOptions)
  @Prop(GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SPECS_FIELDS.min)
  @Expose()
  public min: number;

  @ApiProperty(GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_API_PROPERTIES.max as ApiPropertyOptions)
  @Prop(GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SPECS_FIELDS.max)
  @Expose()
  public max: number;
}

const GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SCHEMA = SchemaFactory.createForClass(GamePlayEligibleTargetsBoundaries);

export {
  GamePlayEligibleTargetsBoundaries,
  GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SCHEMA,
};