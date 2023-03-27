import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { playerDeathApiProperties } from "../../constants/player/player-death.constant";
import { PLAYER_DEATH_CAUSES } from "../../enums/player.enum";
import { GameSource } from "../../types/game.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerDeath {
  @ApiProperty(playerDeathApiProperties.source)
  @Prop({ required: true })
  public source: GameSource;

  @ApiProperty(playerDeathApiProperties.cause)
  @Prop({ required: true })
  public cause: PLAYER_DEATH_CAUSES;
}

const PlayerDeathSchema = SchemaFactory.createForClass(PlayerDeath);

export { PlayerDeath, PlayerDeathSchema };