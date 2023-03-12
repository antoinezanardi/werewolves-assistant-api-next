import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { twoSistersGameOptionsApiProperties } from "../../constants/roles-game-options/two-sisters-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class TwoSistersGameOptions {
  @ApiProperty(twoSistersGameOptionsApiProperties.wakingUpInterval)
  @Prop({
    default: twoSistersGameOptionsApiProperties.wakingUpInterval.default as number,
    min: twoSistersGameOptionsApiProperties.wakingUpInterval.minimum,
    max: twoSistersGameOptionsApiProperties.wakingUpInterval.maximum,
  })
  public wakingUpInterval: number;
}

const TwoSistersGameOptionsSchema = SchemaFactory.createForClass(TwoSistersGameOptions);

export { TwoSistersGameOptions, TwoSistersGameOptionsSchema };