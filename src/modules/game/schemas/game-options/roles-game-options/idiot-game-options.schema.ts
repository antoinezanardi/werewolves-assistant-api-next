import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { idiotGameOptionsApiProperties, idiotGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/idiot-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class IdiotGameOptions {
  @ApiProperty(idiotGameOptionsApiProperties.doesDieOnAncientDeath)
  @Prop({ default: idiotGameOptionsFieldsSpecs.doesDieOnAncientDeath.default })
  @Expose()
  public doesDieOnAncientDeath: boolean;
}

const IdiotGameOptionsSchema = SchemaFactory.createForClass(IdiotGameOptions);

export { IdiotGameOptions, IdiotGameOptionsSchema };