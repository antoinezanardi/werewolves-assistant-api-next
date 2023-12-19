import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { Player } from "@/modules/game/schemas/player/player.schema";
import { PLAYER_API_PROPERTIES, PLAYER_FIELDS_SPECS } from "@/modules/game/schemas/player/player.schema.constant";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";

@Schema({ versionKey: false })
class DeadPlayer extends Player {
  @ApiProperty(PLAYER_API_PROPERTIES.isAlive as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.isAlive)
  @Expose()
  declare public isAlive: false;

  @ApiProperty(PLAYER_API_PROPERTIES.death as ApiPropertyOptions)
  @Prop({
    ...PLAYER_FIELDS_SPECS.death,
    required: true,
  })
  @Type(() => PlayerDeath)
  @Expose()
  declare public death: PlayerDeath;
}

const DEAD_PLAYER_SCHEMA = SchemaFactory.createForClass(DeadPlayer);

export {
  DeadPlayer,
  DEAD_PLAYER_SCHEMA,
};