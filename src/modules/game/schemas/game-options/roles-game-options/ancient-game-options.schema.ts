import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { ANCIENT_GAME_OPTIONS_API_PROPERTIES, ANCIENT_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/ancient-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class AncientGameOptions {
  @ApiProperty(ANCIENT_GAME_OPTIONS_API_PROPERTIES.livesCountAgainstWerewolves)
  @Prop({
    default: ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.default,
    min: ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.minimum,
    max: ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.maximum,
  })
  @Expose()
  public livesCountAgainstWerewolves: number;

  @ApiProperty(ANCIENT_GAME_OPTIONS_API_PROPERTIES.doesTakeHisRevenge)
  @Prop({ default: ANCIENT_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge.default })
  @Expose()
  public doesTakeHisRevenge: boolean;
}

const ANCIENT_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(AncientGameOptions);

export {
  AncientGameOptions,
  ANCIENT_GAME_OPTIONS_SCHEMA,
};