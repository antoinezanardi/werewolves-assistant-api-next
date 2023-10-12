import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PLAYER_SIDE_API_PROPERTIES, PLAYER_SIDE_FIELDS_SPECS } from "@/modules/game/schemas/player/player-side/player-side.schema.constant";
import { RoleSides } from "@/modules/role/enums/role.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerSide {
  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.original as ApiPropertyOptions)
  @Prop(PLAYER_SIDE_FIELDS_SPECS.original)
  @Expose()
  public original: RoleSides;

  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.current as ApiPropertyOptions)
  @Prop(PLAYER_SIDE_FIELDS_SPECS.current)
  @Expose()
  public current: RoleSides;
}

const PLAYER_SIDE_SCHEMA = SchemaFactory.createForClass(PlayerSide);

export {
  PlayerSide,
  PLAYER_SIDE_SCHEMA,
};