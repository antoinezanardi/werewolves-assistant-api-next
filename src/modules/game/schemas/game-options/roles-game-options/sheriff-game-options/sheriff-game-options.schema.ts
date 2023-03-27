import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
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
  public isEnabled: boolean;

  @ApiProperty(sheriffGameOptionsApiProperties.electedAt)
  @Prop({
    type: SheriffElectionGameOptionsSchema,
    default: () => ({}),
  })
  public electedAt: SheriffElectionGameOptions;

  @ApiProperty(sheriffGameOptionsApiProperties.hasDoubledVote)
  @Prop({ default: sheriffGameOptionsFieldsSpecs.hasDoubledVote.default })
  public hasDoubledVote: boolean;
}

const SheriffGameOptionsSchema = SchemaFactory.createForClass(SheriffGameOptions);

export { SheriffGameOptions, SheriffGameOptionsSchema };