import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { playerSideApiProperties } from "@/modules/game/constants/player/player-side.constant";
import { ROLE_SIDES } from "@/modules/role/enums/role.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerSide {
  @ApiProperty(playerSideApiProperties.original)
  @Prop({ required: true })
  @Expose()
  public original: ROLE_SIDES;

  @ApiProperty(playerSideApiProperties.current)
  @Prop({ required: true })
  @Expose()
  public current: ROLE_SIDES;
}

const PlayerSideSchema = SchemaFactory.createForClass(PlayerSide);

export { PlayerSide, PlayerSideSchema };