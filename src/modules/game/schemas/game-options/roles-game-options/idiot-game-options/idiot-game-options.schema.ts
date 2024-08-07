import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { IDIOT_GAME_OPTIONS_API_PROPERTIES, IDIOT_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class IdiotGameOptions {
  @ApiProperty(IDIOT_GAME_OPTIONS_API_PROPERTIES.doesDieOnElderDeath as ApiPropertyOptions)
  @Prop(IDIOT_GAME_OPTIONS_FIELDS_SPECS.doesDieOnElderDeath)
  @Expose()
  public doesDieOnElderDeath: boolean;
}

const IDIOT_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(IdiotGameOptions);

export {
  IdiotGameOptions,
  IDIOT_GAME_OPTIONS_SCHEMA,
};