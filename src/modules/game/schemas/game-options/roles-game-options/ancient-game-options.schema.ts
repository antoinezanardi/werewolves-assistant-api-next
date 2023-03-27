import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ancientGameOptionsApiProperties, ancientGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/ancient-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class AncientGameOptions {
  @ApiProperty(ancientGameOptionsApiProperties.livesCountAgainstWerewolves)
  @Prop({
    default: ancientGameOptionsFieldsSpecs.livesCountAgainstWerewolves.default,
    min: ancientGameOptionsFieldsSpecs.livesCountAgainstWerewolves.minimum,
    max: ancientGameOptionsFieldsSpecs.livesCountAgainstWerewolves.maximum,
  })
  public livesCountAgainstWerewolves: number;

  @ApiProperty(ancientGameOptionsApiProperties.doesTakeHisRevenge)
  @Prop({ default: ancientGameOptionsFieldsSpecs.doesTakeHisRevenge.default })
  public doesTakeHisRevenge: boolean;
}

const AncientGameOptionsSchema = SchemaFactory.createForClass(AncientGameOptions);

export { AncientGameOptions, AncientGameOptionsSchema };