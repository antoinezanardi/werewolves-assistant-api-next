import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ancientGameOptionsApiProperties } from "../../constants/roles-game-options/ancient-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class AncientGameOptions {
  @ApiProperty(ancientGameOptionsApiProperties.livesCountAgainstWerewolves)
  @Prop({
    default: ancientGameOptionsApiProperties.livesCountAgainstWerewolves.default as number,
    min: ancientGameOptionsApiProperties.livesCountAgainstWerewolves.minimum,
    max: ancientGameOptionsApiProperties.livesCountAgainstWerewolves.maximum,
  })
  public livesCountAgainstWerewolves: number;

  @ApiProperty(ancientGameOptionsApiProperties.doesTakeHisRevenge)
  @Prop({ default: ancientGameOptionsApiProperties.doesTakeHisRevenge.default as boolean })
  public doesTakeHisRevenge: boolean;
}

const AncientGameOptionsSchema = SchemaFactory.createForClass(AncientGameOptions);

export { AncientGameOptions, AncientGameOptionsSchema };