import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { ancientGameOptionsApiProperties, ancientGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/ancient-game-options.constant";

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
  @Expose()
  public livesCountAgainstWerewolves: number;

  @ApiProperty(ancientGameOptionsApiProperties.doesTakeHisRevenge)
  @Prop({ default: ancientGameOptionsFieldsSpecs.doesTakeHisRevenge.default })
  @Expose()
  public doesTakeHisRevenge: boolean;
}

const AncientGameOptionsSchema = SchemaFactory.createForClass(AncientGameOptions);

export { AncientGameOptions, AncientGameOptionsSchema };