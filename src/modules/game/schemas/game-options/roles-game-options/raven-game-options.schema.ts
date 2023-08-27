import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { ravenGameOptionsApiProperties, ravenGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/raven-game-options.constant";

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
  @Expose()
  public markPenalty: number;
}

const RavenGameOptionsSchema = SchemaFactory.createForClass(RavenGameOptions);

export { RavenGameOptions, RavenGameOptionsSchema };