import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { whiteWerewolfGameOptionsApiProperties } from "../../constants/roles-game-options/white-werewolf-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WhiteWerewolfGameOptions {
  @ApiProperty(whiteWerewolfGameOptionsApiProperties.wakingUpInterval)
  @Prop({
    default: whiteWerewolfGameOptionsApiProperties.wakingUpInterval.default as number,
    min: whiteWerewolfGameOptionsApiProperties.wakingUpInterval.minimum,
    max: whiteWerewolfGameOptionsApiProperties.wakingUpInterval.maximum,
  })
  public wakingUpInterval: number;
}

const WhiteWerewolfGameOptionsSchema = SchemaFactory.createForClass(WhiteWerewolfGameOptions);

export { WhiteWerewolfGameOptions, WhiteWerewolfGameOptionsSchema };