import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE_SIDES } from "../../../../../../role/enums/role.enum";
import { playerSideApiProperties } from "../constants/player-side.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerSide {
  @ApiProperty(playerSideApiProperties.original)
  @Prop({ required: true })
  public original: ROLE_SIDES;

  @ApiProperty(playerSideApiProperties.current)
  @Prop({ required: true })
  public current: ROLE_SIDES;
}

const PlayerSideSchema = SchemaFactory.createForClass(PlayerSide);

export { PlayerSide, PlayerSideSchema };