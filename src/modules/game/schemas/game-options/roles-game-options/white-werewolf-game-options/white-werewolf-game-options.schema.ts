import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES, WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options/white-werewolf-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WhiteWerewolfGameOptions {
  @ApiProperty(WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval as ApiPropertyOptions)
  @Prop(WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval)
  @Expose()
  public wakingUpInterval: number;
}

const WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(WhiteWerewolfGameOptions);

export {
  WhiteWerewolfGameOptions,
  WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA,
};