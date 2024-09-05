import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { ACTOR_GAME_OPTIONS_API_PROPERTIES, ACTOR_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/actor-game-options/actor-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ActorGameOptions {
  @ApiProperty(ACTOR_GAME_OPTIONS_API_PROPERTIES.isPowerlessOnWerewolvesSide as ApiPropertyOptions)
  @Prop(ACTOR_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide)
  @Expose()
  public isPowerlessOnWerewolvesSide: boolean;
}

const ACTOR_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(ActorGameOptions);

export {
  ActorGameOptions,
  ACTOR_GAME_OPTIONS_SCHEMA,
};