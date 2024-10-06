import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { WEREWOLF_GAME_OPTIONS_API_PROPERTIES, WEREWOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/werewolf-game-options/werewolf-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WerewolfGameOptions {
  @ApiProperty(WEREWOLF_GAME_OPTIONS_API_PROPERTIES.canEatEachOther as ApiPropertyOptions)
  @Prop(WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.canEatEachOther)
  @Expose()
  public canEatEachOther: boolean;
}

const WEREWOLF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(WerewolfGameOptions);

export {
  WerewolfGameOptions,
  WEREWOLF_GAME_OPTIONS_SCHEMA,
};