import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { RoleName } from "@/modules/role/types/role.types";
import { PLAYER_ROLE_API_PROPERTIES, PLAYER_ROLE_FIELDS_SPECS } from "@/modules/game/schemas/player/player-role/player-role.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerRole {
  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.original as ApiPropertyOptions)
  @Prop(PLAYER_ROLE_FIELDS_SPECS.original)
  @Expose()
  public original: RoleName;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.current as ApiPropertyOptions)
  @Prop(PLAYER_ROLE_FIELDS_SPECS.current)
  @Expose()
  public current: RoleName;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.isRevealed as ApiPropertyOptions)
  @Prop(PLAYER_ROLE_FIELDS_SPECS.isRevealed)
  @Expose()
  public isRevealed: boolean;
}

const PLAYER_ROLE_SCHEMA = SchemaFactory.createForClass(PlayerRole);

export {
  PlayerRole,
  PLAYER_ROLE_SCHEMA,
};