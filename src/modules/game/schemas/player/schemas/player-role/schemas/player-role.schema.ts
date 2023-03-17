import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../../../../role/enums/role.enum";
import { playerRoleApiProperties } from "../constants/player-role.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerRole {
  @ApiProperty(playerRoleApiProperties.original)
  @Prop({ required: true })
  public original: ROLE_NAMES;

  @ApiProperty(playerRoleApiProperties.current)
  @Prop({ required: true })
  public current: ROLE_NAMES;

  @ApiProperty(playerRoleApiProperties.isRevealed)
  @Prop({ required: true })
  public isRevealed: boolean;
}

const PlayerRoleSchema = SchemaFactory.createForClass(PlayerRole);

export { PlayerRole, PlayerRoleSchema };