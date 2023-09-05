import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { SHERIFF_GAME_OPTIONS_API_PROPERTIES, SHERIFF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema.constant";
import { SheriffElectionGameOptions, SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffGameOptions {
  @ApiProperty(SHERIFF_GAME_OPTIONS_API_PROPERTIES.isEnabled)
  @Prop({ default: SHERIFF_GAME_OPTIONS_FIELDS_SPECS.isEnabled.default })
  @Expose()
  public isEnabled: boolean;

  @ApiProperty(SHERIFF_GAME_OPTIONS_API_PROPERTIES.electedAt)
  @Prop({
    type: SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => SheriffElectionGameOptions)
  @Expose()
  public electedAt: SheriffElectionGameOptions;

  @ApiProperty(SHERIFF_GAME_OPTIONS_API_PROPERTIES.hasDoubledVote)
  @Prop({ default: SHERIFF_GAME_OPTIONS_FIELDS_SPECS.hasDoubledVote.default })
  @Expose()
  public hasDoubledVote: boolean;
}

const SHERIFF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(SheriffGameOptions);

export {
  SheriffGameOptions,
  SHERIFF_GAME_OPTIONS_SCHEMA,
};