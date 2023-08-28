import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PLAYER_SIDE_API_PROPERTIES } from "@/modules/game/constants/player/player-side.constant";
import { RoleSides } from "@/modules/role/enums/role.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerSide {
  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.original)
  @Prop({ required: true })
  @Expose()
  public original: RoleSides;

  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.current)
  @Prop({ required: true })
  @Expose()
  public current: RoleSides;
}

const PLAYER_SIDE_SCHEMA = SchemaFactory.createForClass(PlayerSide);

export {
  PlayerSide,
  PLAYER_SIDE_SCHEMA,
};