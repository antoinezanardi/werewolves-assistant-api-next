import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { idiotGameOptionsApiProperties } from "../../constants/roles-game-options/idiot-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class IdiotGameOptions {
  @ApiProperty(idiotGameOptionsApiProperties.doesDieOnAncientDeath)
  @Prop({ default: idiotGameOptionsApiProperties.doesDieOnAncientDeath.default as boolean })
  public doesDieOnAncientDeath: boolean;
}

const IdiotGameOptionsSchema = SchemaFactory.createForClass(IdiotGameOptions);

export { IdiotGameOptions, IdiotGameOptionsSchema };