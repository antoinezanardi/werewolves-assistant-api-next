import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { ANCIENT_GAME_OPTIONS_API_PROPERTIES, ANCIENT_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/ancient-game-options/ancient-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class AncientGameOptions {
  @ApiProperty(ANCIENT_GAME_OPTIONS_API_PROPERTIES.livesCountAgainstWerewolves as ApiPropertyOptions)
  @Prop(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves)
  @Expose()
  public livesCountAgainstWerewolves: number;

  @ApiProperty(ANCIENT_GAME_OPTIONS_API_PROPERTIES.doesTakeHisRevenge as ApiPropertyOptions)
  @Prop(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge)
  @Expose()
  public doesTakeHisRevenge: boolean;
}

const ANCIENT_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(AncientGameOptions);

export {
  AncientGameOptions,
  ANCIENT_GAME_OPTIONS_SCHEMA,
};