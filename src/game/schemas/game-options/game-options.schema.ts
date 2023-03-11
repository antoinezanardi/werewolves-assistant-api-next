import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { CompositionGameOptions, CompositionGameOptionsSchema } from "./composition-game-options.schema";
import { RolesGameOptions, RolesGameOptionsSchema } from "./roles-game-options/roles-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameOptions {
  @ApiProperty({ description: "Game's composition options" })
  @Prop({
    type: CompositionGameOptionsSchema,
    default: () => ({}),
  })
  public composition: CompositionGameOptions;

  @ApiProperty({ description: "Game's roles options" })
  @Prop({
    type: RolesGameOptionsSchema,
    default: () => ({}),
  })
  public roles: RolesGameOptions;
}

const GameOptionsSchema = SchemaFactory.createForClass(GameOptions);

export { GameOptions, GameOptionsSchema };