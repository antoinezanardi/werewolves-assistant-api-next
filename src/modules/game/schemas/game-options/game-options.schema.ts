import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { gameOptionsApiProperties } from "@/modules/game/constants/game-options/game-options.constant";
import { CompositionGameOptions, CompositionGameOptionsSchema } from "@/modules/game/schemas/game-options/composition-game-options.schema";
import { RolesGameOptions, RolesGameOptionsSchema } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";
import { VotesGameOptions, VotesGameOptionsSchema } from "@/modules/game/schemas/game-options/votes-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameOptions {
  @ApiProperty(gameOptionsApiProperties.composition)
  @Prop({
    type: CompositionGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => CompositionGameOptions)
  @Expose()
  public composition: CompositionGameOptions;

  @ApiProperty(gameOptionsApiProperties.votes)
  @Prop({
    type: VotesGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => VotesGameOptions)
  @Expose()
  public votes: VotesGameOptions;

  @ApiProperty(gameOptionsApiProperties.roles)
  @Prop({
    type: RolesGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => RolesGameOptions)
  @Expose()
  public roles: RolesGameOptions;
}

const GameOptionsSchema = SchemaFactory.createForClass(GameOptions);

export { GameOptions, GameOptionsSchema };