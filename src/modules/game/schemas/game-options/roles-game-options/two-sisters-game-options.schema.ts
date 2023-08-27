import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { twoSistersGameOptionsApiProperties, twoSistersGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/two-sisters-game-options.constant";

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
  @Expose()
  public wakingUpInterval: number;
}

const TwoSistersGameOptionsSchema = SchemaFactory.createForClass(TwoSistersGameOptions);

export { TwoSistersGameOptions, TwoSistersGameOptionsSchema };