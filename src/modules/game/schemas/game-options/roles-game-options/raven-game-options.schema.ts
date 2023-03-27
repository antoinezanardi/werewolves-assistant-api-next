import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ravenGameOptionsApiProperties, ravenGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/raven-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class RavenGameOptions {
  @ApiProperty(ravenGameOptionsApiProperties.markPenalty)
  @Prop({
    default: ravenGameOptionsFieldsSpecs.markPenalty.default,
    min: ravenGameOptionsFieldsSpecs.markPenalty.minimum,
    max: ravenGameOptionsFieldsSpecs.markPenalty.maximum,
  })
  public markPenalty: number;
}

const RavenGameOptionsSchema = SchemaFactory.createForClass(RavenGameOptions);

export { RavenGameOptions, RavenGameOptionsSchema };