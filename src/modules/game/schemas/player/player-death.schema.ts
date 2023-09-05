import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PLAYER_DEATH_API_PROPERTIES } from "@/modules/game/schemas/player/player-death.schema.constant";
import { PlayerDeathCauses } from "@/modules/game/enums/player.enum";
import { GameSource } from "@/modules/game/types/game.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerDeath {
  @ApiProperty(PLAYER_DEATH_API_PROPERTIES.source)
  @Prop({ required: true })
  @Expose()
  public source: GameSource;

  @ApiProperty(PLAYER_DEATH_API_PROPERTIES.cause)
  @Prop({ required: true })
  @Expose()
  public cause: PlayerDeathCauses;
}

const PLAYER_DEATH_SCHEMA = SchemaFactory.createForClass(PlayerDeath);

export {
  PlayerDeath,
  PLAYER_DEATH_SCHEMA,
};