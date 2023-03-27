import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { whiteWerewolfGameOptionsApiProperties, whiteWerewolfGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/white-werewolf-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WhiteWerewolfGameOptions {
  @ApiProperty(whiteWerewolfGameOptionsApiProperties.wakingUpInterval)
  @Prop({
    default: whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.default,
    min: whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.minimum,
    max: whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.maximum,
  })
  public wakingUpInterval: number;
}

const WhiteWerewolfGameOptionsSchema = SchemaFactory.createForClass(WhiteWerewolfGameOptions);

export { WhiteWerewolfGameOptions, WhiteWerewolfGameOptionsSchema };