import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PLAYER_ROLE_API_PROPERTIES } from "@/modules/game/schemas/player/player-role/player-role.schema.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerRole {
  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.original)
  @Prop({ required: true })
  @Expose()
  public original: RoleNames;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.current)
  @Prop({ required: true })
  @Expose()
  public current: RoleNames;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.isRevealed)
  @Prop({ required: true })
  @Expose()
  public isRevealed: boolean;
}

const PLAYER_ROLE_SCHEMA = SchemaFactory.createForClass(PlayerRole);

export {
  PlayerRole,
  PLAYER_ROLE_SCHEMA,
};