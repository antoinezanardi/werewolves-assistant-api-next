import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligibile-targets-boudaries/game-play-eligible-targets-boundaries.schema";
import { GAME_PLAY_ELIGIBLE_TARGETS_API_PROPERTIES, GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlayEligibleTargets {
  @ApiProperty(GAME_PLAY_ELIGIBLE_TARGETS_API_PROPERTIES.boundaries as ApiPropertyOptions)
  @Prop(GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS.boundaries)
  @Expose()
  public boundaries?: GamePlayEligibleTargetsBoundaries;
}

const GAME_PLAY_ELIGIBLE_TARGETS_SCHEMA = SchemaFactory.createForClass(GamePlayEligibleTargets);

export {
  GamePlayEligibleTargets,
  GAME_PLAY_ELIGIBLE_TARGETS_SCHEMA,
};