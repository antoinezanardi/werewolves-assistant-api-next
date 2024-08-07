import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES, BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options/big-bad-wolf-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class BigBadWolfGameOptions {
  @ApiProperty(BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES.isPowerlessIfWerewolfDies as ApiPropertyOptions)
  @Prop(BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfWerewolfDies)
  @Expose()
  public isPowerlessIfWerewolfDies: boolean;
}

const BIG_BAD_WOLF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(BigBadWolfGameOptions);

export { BigBadWolfGameOptions, BIG_BAD_WOLF_GAME_OPTIONS_SCHEMA };