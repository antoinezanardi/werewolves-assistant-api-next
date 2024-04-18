import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { GAME_PHASE_API_PROPERTIES, GAME_PHASE_FIELDS_SPECS } from "@/modules/game/schemas/game-phase/game-phase.schema.constants";
import type { GamePhaseName } from "@/modules/game/types/game-phase/game-phase.types";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePhase {
  @ApiProperty(GAME_PHASE_API_PROPERTIES.name as ApiPropertyOptions)
  @Prop(GAME_PHASE_FIELDS_SPECS.name)
  @Expose()
  public name: GamePhaseName = GAME_PHASE_FIELDS_SPECS.name.default;

  @ApiProperty(GAME_PHASE_API_PROPERTIES.tick as ApiPropertyOptions)
  @Prop(GAME_PHASE_FIELDS_SPECS.tick)
  public tick: number = GAME_PHASE_FIELDS_SPECS.tick.default;
}

const GAME_PHASE_SCHEMA = SchemaFactory.createForClass(GamePhase);

export {
  GamePhase,
  GAME_PHASE_SCHEMA,
};