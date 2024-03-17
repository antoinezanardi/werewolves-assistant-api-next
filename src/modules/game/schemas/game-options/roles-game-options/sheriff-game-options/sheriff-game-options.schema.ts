import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { SHERIFF_GAME_OPTIONS_API_PROPERTIES, SHERIFF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema.constants";
import { SheriffElectionGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffGameOptions {
  @ApiProperty(SHERIFF_GAME_OPTIONS_API_PROPERTIES.isEnabled as ApiPropertyOptions)
  @Prop(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.isEnabled)
  @Expose()
  public isEnabled: boolean;

  @ApiProperty(SHERIFF_GAME_OPTIONS_API_PROPERTIES.electedAt as ApiPropertyOptions)
  @Prop(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.electedAt)
  @Type(() => SheriffElectionGameOptions)
  @Expose()
  public electedAt: SheriffElectionGameOptions;

  @ApiProperty(SHERIFF_GAME_OPTIONS_API_PROPERTIES.hasDoubledVote as ApiPropertyOptions)
  @Prop(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.hasDoubledVote)
  @Expose()
  public hasDoubledVote: boolean;

  @ApiProperty(SHERIFF_GAME_OPTIONS_API_PROPERTIES.mustSettleTieInVotes as ApiPropertyOptions)
  @Prop(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.mustSettleTieInVotes)
  @Expose()
  public mustSettleTieInVotes: boolean;
}

const SHERIFF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(SheriffGameOptions);

export {
  SheriffGameOptions,
  SHERIFF_GAME_OPTIONS_SCHEMA,
};