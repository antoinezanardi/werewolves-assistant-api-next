import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PlayerDeathCause } from "@/modules/game/types/player/player-death/player-death.types";
import { GameSource } from "@/modules/game/types/game.types";
import { PLAYER_DEATH_API_PROPERTIES, PLAYER_DEATH_FIELDS_SPECS } from "@/modules/game/schemas/player/player-death/player-death.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerDeath {
  @ApiProperty(PLAYER_DEATH_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(PLAYER_DEATH_FIELDS_SPECS.source)
  @Expose()
  public source: GameSource;

  @ApiProperty(PLAYER_DEATH_API_PROPERTIES.cause as ApiPropertyOptions)
  @Prop(PLAYER_DEATH_FIELDS_SPECS.cause)
  @Expose()
  public cause: PlayerDeathCause;
}

const PLAYER_DEATH_SCHEMA = SchemaFactory.createForClass(PlayerDeath);

export {
  PlayerDeath,
  PLAYER_DEATH_SCHEMA,
};