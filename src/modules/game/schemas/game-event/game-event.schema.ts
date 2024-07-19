import { GAME_EVENT_API_PROPERTIES, GAME_EVENT_FIELDS_SPECS } from "@/modules/game/schemas/game-event/game-event.schema.constants";
import { Player } from "@/modules/game/schemas/player/player.schema";
import { GameEventType } from "@/modules/game/types/game-event/game-event.types";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, type ApiPropertyOptions } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameEvent {
  @ApiProperty(GAME_EVENT_API_PROPERTIES.type as ApiPropertyOptions)
  @Prop(GAME_EVENT_FIELDS_SPECS.type)
  @Expose()
  public type: GameEventType;

  @ApiProperty(GAME_EVENT_API_PROPERTIES.players as ApiPropertyOptions)
  @Prop(GAME_EVENT_FIELDS_SPECS.players)
  @Type(() => Player)
  @Expose()
  public players?: Player[];
}

const GAME_EVENT_SCHEMA = SchemaFactory.createForClass(GameEvent);

export {
  GameEvent,
  GAME_EVENT_SCHEMA,
};