import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { playerRoleApiProperties } from "@/modules/game/constants/player/player-role.constant";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerRole {
  @ApiProperty(playerRoleApiProperties.original)
  @Prop({ required: true })
  @Expose()
  public original: ROLE_NAMES;

  @ApiProperty(playerRoleApiProperties.current)
  @Prop({ required: true })
  @Expose()
  public current: ROLE_NAMES;

  @ApiProperty(playerRoleApiProperties.isRevealed)
  @Prop({ required: true })
  @Expose()
  public isRevealed: boolean;
}

const PlayerRoleSchema = SchemaFactory.createForClass(PlayerRole);

export { PlayerRole, PlayerRoleSchema };