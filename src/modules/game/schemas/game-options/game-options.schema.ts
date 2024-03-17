import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_OPTIONS_API_PROPERTIES, GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/game-options.schema.constants";
import { CompositionGameOptions } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema";
import { RolesGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";
import { VotesGameOptions } from "@/modules/game/schemas/game-options/votes-game-options/votes-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameOptions {
  @ApiProperty(GAME_OPTIONS_API_PROPERTIES.composition as ApiPropertyOptions)
  @Prop(GAME_OPTIONS_FIELDS_SPECS.composition)
  @Type(() => CompositionGameOptions)
  @Expose()
  public composition: CompositionGameOptions;

  @ApiProperty(GAME_OPTIONS_API_PROPERTIES.votes as ApiPropertyOptions)
  @Prop(GAME_OPTIONS_FIELDS_SPECS.votes)
  @Type(() => VotesGameOptions)
  @Expose()
  public votes: VotesGameOptions;

  @ApiProperty(GAME_OPTIONS_API_PROPERTIES.roles as ApiPropertyOptions)
  @Prop(GAME_OPTIONS_FIELDS_SPECS.roles)
  @Type(() => RolesGameOptions)
  @Expose()
  public roles: RolesGameOptions;
}

const GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(GameOptions);

export {
  GameOptions,
  GAME_OPTIONS_SCHEMA,
};