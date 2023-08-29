import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES, WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/white-werewolf-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WhiteWerewolfGameOptions {
  @ApiProperty(WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval)
  @Prop({
    default: WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.default,
    min: WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.minimum,
    max: WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.maximum,
  })
  @Expose()
  public wakingUpInterval: number;
}

const WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(WhiteWerewolfGameOptions);

export {
  WhiteWerewolfGameOptions,
  WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA,
};