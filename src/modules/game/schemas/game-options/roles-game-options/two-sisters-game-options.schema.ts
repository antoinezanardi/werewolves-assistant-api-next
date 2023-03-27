import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { twoSistersGameOptionsApiProperties, twoSistersGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/two-sisters-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class TwoSistersGameOptions {
  @ApiProperty(twoSistersGameOptionsApiProperties.wakingUpInterval)
  @Prop({
    default: twoSistersGameOptionsFieldsSpecs.wakingUpInterval.default,
    min: twoSistersGameOptionsFieldsSpecs.wakingUpInterval.minimum,
    max: twoSistersGameOptionsFieldsSpecs.wakingUpInterval.maximum,
  })
  public wakingUpInterval: number;
}

const TwoSistersGameOptionsSchema = SchemaFactory.createForClass(TwoSistersGameOptions);

export { TwoSistersGameOptions, TwoSistersGameOptionsSchema };