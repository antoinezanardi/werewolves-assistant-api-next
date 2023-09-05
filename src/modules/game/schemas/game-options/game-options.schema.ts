import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_OPTIONS_API_PROPERTIES } from "@/modules/game/schemas/game-options/game-options.schema.constant";
import { CompositionGameOptions, COMPOSITION_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema";
import { RolesGameOptions, ROLES_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";
import { VotesGameOptions, VOTES_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/votes-game-options/votes-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameOptions {
  @ApiProperty(GAME_OPTIONS_API_PROPERTIES.composition)
  @Prop({
    type: COMPOSITION_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => CompositionGameOptions)
  @Expose()
  public composition: CompositionGameOptions;

  @ApiProperty(GAME_OPTIONS_API_PROPERTIES.votes)
  @Prop({
    type: VOTES_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => VotesGameOptions)
  @Expose()
  public votes: VotesGameOptions;

  @ApiProperty(GAME_OPTIONS_API_PROPERTIES.roles)
  @Prop({
    type: ROLES_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => RolesGameOptions)
  @Expose()
  public roles: RolesGameOptions;
}

const GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(GameOptions);

export {
  GameOptions,
  GAME_OPTIONS_SCHEMA,
};