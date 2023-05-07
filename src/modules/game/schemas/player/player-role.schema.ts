import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import { playerRoleApiProperties } from "../../constants/player/player-role.constant";

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