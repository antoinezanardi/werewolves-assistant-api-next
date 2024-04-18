import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { RoleSide } from "@/modules/role/types/role.types";
import { PLAYER_SIDE_API_PROPERTIES, PLAYER_SIDE_FIELDS_SPECS } from "@/modules/game/schemas/player/player-side/player-side.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerSide {
  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.original as ApiPropertyOptions)
  @Prop(PLAYER_SIDE_FIELDS_SPECS.original)
  @Expose()
  public original: RoleSide;

  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.current as ApiPropertyOptions)
  @Prop(PLAYER_SIDE_FIELDS_SPECS.current)
  @Expose()
  public current: RoleSide;
}

const PLAYER_SIDE_SCHEMA = SchemaFactory.createForClass(PlayerSide);

export {
  PlayerSide,
  PLAYER_SIDE_SCHEMA,
};