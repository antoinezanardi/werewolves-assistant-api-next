import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import { GamePlayActions, GamePlayCauses, GamePlayOccurrences } from "@/modules/game/enums/game-play.enum";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GAME_PLAY_API_PROPERTIES, GAME_PLAY_SPECS_FIELDS } from "@/modules/game/schemas/game-play/game-play.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlay {
  @ApiProperty(GAME_PLAY_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.source)
  @Type(() => GamePlaySource)
  @Expose()
  public source: GamePlaySource;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.action as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.action)
  @Expose()
  public action: GamePlayActions;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.cause as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.cause)
  @Expose()
  public cause?: GamePlayCauses;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.eligibleTargets as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.eligibleTargets)
  @Type(() => GamePlayEligibleTargets)
  @Expose()
  public eligibleTargets?: GamePlayEligibleTargets;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.canBeSkipped as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.canBeSkipped)
  @Expose()
  public canBeSkipped?: boolean;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.occurrence as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.occurrence)
  @Expose()
  public occurrence: GamePlayOccurrences;
}

const GAME_PLAY_SCHEMA = SchemaFactory.createForClass(GamePlay);

export {
  GamePlay,
  GAME_PLAY_SCHEMA,
};