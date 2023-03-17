import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { playerDeathApiProperties } from "../constants/player-death.constant";
import { PLAYER_DEATH_CAUSES } from "../enums/player-death.enum";
import { PlayerDeathSource } from "../types/player-death.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerDeath {
  @ApiProperty(playerDeathApiProperties.source)
  @Prop({ required: true })
  public source: PlayerDeathSource;

  @ApiProperty(playerDeathApiProperties.cause)
  @Prop({ required: true })
  public cause: PLAYER_DEATH_CAUSES;
}

const PlayerDeathSchema = SchemaFactory.createForClass(PlayerDeath);

export { PlayerDeath, PlayerDeathSchema };