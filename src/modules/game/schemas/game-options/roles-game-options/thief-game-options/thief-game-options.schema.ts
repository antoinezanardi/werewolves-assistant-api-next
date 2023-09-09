import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { THIEF_GAME_OPTIONS_API_PROPERTIES, THIEF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThiefGameOptions {
  @ApiProperty(THIEF_GAME_OPTIONS_API_PROPERTIES.mustChooseBetweenWerewolves)
  @Prop({ default: THIEF_GAME_OPTIONS_FIELDS_SPECS.mustChooseBetweenWerewolves.default })
  @Expose()
  public mustChooseBetweenWerewolves: boolean;

  @ApiProperty(THIEF_GAME_OPTIONS_API_PROPERTIES.additionalCardsCount)
  @Prop({
    default: THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.default,
    min: THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.minimum,
    max: THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.maximum,
  })
  @Expose()
  public additionalCardsCount: number;
}

const THIEF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(ThiefGameOptions);

export {
  ThiefGameOptions,
  THIEF_GAME_OPTIONS_SCHEMA,
};