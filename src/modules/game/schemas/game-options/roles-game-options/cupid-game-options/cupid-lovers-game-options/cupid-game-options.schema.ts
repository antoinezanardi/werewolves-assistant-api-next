import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { CUPID_LOVERS_GAME_OPTIONS_API_PROPERTIES, CUPID_LOVERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-lovers-game-options/cupid-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class CupidLoversGameOptions {
  @ApiProperty(CUPID_LOVERS_GAME_OPTIONS_API_PROPERTIES.doRevealRoleToEachOther as ApiPropertyOptions)
  @Prop(CUPID_LOVERS_GAME_OPTIONS_FIELDS_SPECS.doRevealRoleToEachOther)
  @Expose()
  public doRevealRoleToEachOther: boolean;
}

const CUPID_LOVERS_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(CupidLoversGameOptions);

export {
  CupidLoversGameOptions,
  CUPID_LOVERS_GAME_OPTIONS_SCHEMA,
};