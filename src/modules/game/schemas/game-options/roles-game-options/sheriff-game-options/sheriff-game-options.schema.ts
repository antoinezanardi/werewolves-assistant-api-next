import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { sheriffGameOptionsApiProperties, sheriffGameOptionsFieldsSpecs } from "../../../../constants/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.constant";
import { SheriffElectionGameOptions, SheriffElectionGameOptionsSchema } from "./sheriff-election-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffGameOptions {
  @ApiProperty(sheriffGameOptionsApiProperties.isEnabled)
  @Prop({ default: sheriffGameOptionsFieldsSpecs.isEnabled.default })
  @Expose()
  public isEnabled: boolean;

  @ApiProperty(sheriffGameOptionsApiProperties.electedAt)
  @Prop({
    type: SheriffElectionGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => SheriffElectionGameOptions)
  @Expose()
  public electedAt: SheriffElectionGameOptions;

  @ApiProperty(sheriffGameOptionsApiProperties.hasDoubledVote)
  @Prop({ default: sheriffGameOptionsFieldsSpecs.hasDoubledVote.default })
  @Expose()
  public hasDoubledVote: boolean;
}

const SheriffGameOptionsSchema = SchemaFactory.createForClass(SheriffGameOptions);

export { SheriffGameOptions, SheriffGameOptionsSchema };