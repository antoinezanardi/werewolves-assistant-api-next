import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { gameOptionsApiProperties } from "../../constants/game-options/game-options.constant";
import { CompositionGameOptions, CompositionGameOptionsSchema } from "./composition-game-options.schema";
import { RolesGameOptions, RolesGameOptionsSchema } from "./roles-game-options/roles-game-options.schema";

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
  public composition: CompositionGameOptions;

  @ApiProperty(gameOptionsApiProperties.roles)
  @Prop({
    type: RolesGameOptionsSchema,
    default: () => ({}),
  })
  public roles: RolesGameOptions;
}

const GameOptionsSchema = SchemaFactory.createForClass(GameOptions);

export { GameOptions, GameOptionsSchema };