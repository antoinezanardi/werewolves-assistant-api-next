import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PLAYER_INTERACTION_API_PROPERTIES, PLAYER_INTERACTION_SPECS_FIELDS } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/player-interaction/player-interaction.schema.constant";
import { PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { GameSource } from "@/modules/game/types/game.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerInteraction {
  @ApiProperty(PLAYER_INTERACTION_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(PLAYER_INTERACTION_SPECS_FIELDS.source)
  @Expose()
  public source: GameSource;

  @ApiProperty(PLAYER_INTERACTION_API_PROPERTIES.type as ApiPropertyOptions)
  @Prop(PLAYER_INTERACTION_SPECS_FIELDS.type)
  @Expose()
  public type: PlayerInteractionTypes;
}

const PLAYER_INTERACTION_SCHEMA = SchemaFactory.createForClass(PlayerInteraction);

export {
  PlayerInteraction,
  PLAYER_INTERACTION_SCHEMA,
};