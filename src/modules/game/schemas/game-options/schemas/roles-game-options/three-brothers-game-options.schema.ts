import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { threeBrothersGameOptionsApiProperties, threeBrothersGameOptionsFieldsSpecs } from "../../constants/roles-game-options/three-brothers-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThreeBrothersGameOptions {
  @ApiProperty(threeBrothersGameOptionsApiProperties.wakingUpInterval)
  @Prop({
    default: threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.default,
    min: threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.minimum,
    max: threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.maximum,
  })
  public wakingUpInterval: number;
}

const ThreeBrothersGameOptionsSchema = SchemaFactory.createForClass(ThreeBrothersGameOptions);

export { ThreeBrothersGameOptions, ThreeBrothersGameOptionsSchema };