import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { VOTES_GAME_OPTIONS_API_PROPERTIES, VOTES_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/votes-game-options/votes-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class VotesGameOptions {
  @ApiProperty(VOTES_GAME_OPTIONS_API_PROPERTIES.canBeSkipped as ApiPropertyOptions)
  @Prop(VOTES_GAME_OPTIONS_FIELDS_SPECS.canBeSkipped)
  @Expose()
  public canBeSkipped: boolean;
}

const VOTES_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(VotesGameOptions);

export {
  VotesGameOptions,
  VOTES_GAME_OPTIONS_SCHEMA,
};