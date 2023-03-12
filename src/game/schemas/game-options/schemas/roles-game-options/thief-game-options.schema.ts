import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { thiefGameOptionsApiProperties } from "../../constants/roles-game-options/thief-judge-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThiefGameOptions {
  @ApiProperty(thiefGameOptionsApiProperties.mustChooseBetweenWerewolves)
  @Prop({ default: thiefGameOptionsApiProperties.mustChooseBetweenWerewolves.default as boolean })
  public mustChooseBetweenWerewolves: boolean;

  @ApiProperty(thiefGameOptionsApiProperties.additionalCardsCount)
  @Prop({
    default: thiefGameOptionsApiProperties.additionalCardsCount.default as number,
    min: thiefGameOptionsApiProperties.additionalCardsCount.minimum,
    max: thiefGameOptionsApiProperties.additionalCardsCount.maximum,
  })
  public additionalCardsCount: number;
}

const ThiefGameOptionsSchema = SchemaFactory.createForClass(ThiefGameOptions);

export { ThiefGameOptions, ThiefGameOptionsSchema };