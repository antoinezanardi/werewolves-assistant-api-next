import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../../constants/game-options/game-options.constant";
import { SheriffElectionGameOptions, SheriffElectionGameOptionsSchema } from "./sheriff-election-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffGameOptions {
  @ApiProperty({
    description: "If set to `true`, `sheriff` will be elected the first tick and the responsibility will be delegated when he dies. Otherwise, there will be no sheriff in the game and tie in votes will result in another vote between the tied players. In case of another equality, there will be no vote.",
    default: defaultGameOptions.roles.sheriff.isEnabled,
  })
  @Prop({ default: defaultGameOptions.roles.sheriff.isEnabled })
  public isEnabled: boolean;

  @ApiProperty({ description: "When the sheriff is elected during the game" })
  @Prop({
    type: SheriffElectionGameOptionsSchema,
    default: () => ({}),
  })
  public electedAt: SheriffElectionGameOptions;

  @ApiProperty({
    description: "If set to `true`, `sheriff` vote during the village's vote is doubled, otherwise, it's a regular vote.",
    default: defaultGameOptions.roles.sheriff.hasDoubledVote,
  })
  @Prop({ default: defaultGameOptions.roles.sheriff.hasDoubledVote })
  public hasDoubledVote: boolean;
}

const SheriffGameOptionsSchema = SchemaFactory.createForClass(SheriffGameOptions);

export { SheriffGameOptions, SheriffGameOptionsSchema };