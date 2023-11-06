import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { PlayerInteraction } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/player-interaction/player-interaction.schema";
import { INTERACTABLE_PLAYER_API_PROPERTIES, INTERACTABLE_PLAYER_SPECS_FIELDS } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema.constant";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class InteractablePlayer {
  @ApiProperty(INTERACTABLE_PLAYER_API_PROPERTIES.player as ApiPropertyOptions)
  @Prop(INTERACTABLE_PLAYER_SPECS_FIELDS.player)
  @Type(() => Player)
  @Expose()
  public player: Player;

  @ApiProperty(INTERACTABLE_PLAYER_API_PROPERTIES.interactions as ApiPropertyOptions)
  @Prop(INTERACTABLE_PLAYER_SPECS_FIELDS.interactions)
  @Type(() => PlayerInteraction)
  @Expose()
  public interactions: PlayerInteraction[];
}

const GAME_PLAY_ELIGIBLE_TARGETS_INTERACTABLE_PLAYER_SCHEMA = SchemaFactory.createForClass(InteractablePlayer);

export {
  InteractablePlayer,
  GAME_PLAY_ELIGIBLE_TARGETS_INTERACTABLE_PLAYER_SCHEMA,
};