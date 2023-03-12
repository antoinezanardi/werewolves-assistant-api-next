import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ravenGameOptionsApiProperties } from "../../constants/roles-game-options/raven-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class RavenGameOptions {
  @ApiProperty(ravenGameOptionsApiProperties.markPenalty)
  @Prop({
    default: ravenGameOptionsApiProperties.markPenalty.default as number,
    min: ravenGameOptionsApiProperties.markPenalty.minimum,
    max: ravenGameOptionsApiProperties.markPenalty.maximum,
  })
  public markPenalty: number;
}

const RavenGameOptionsSchema = SchemaFactory.createForClass(RavenGameOptions);

export { RavenGameOptions, RavenGameOptionsSchema };