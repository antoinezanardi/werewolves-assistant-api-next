import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { thiefGameOptionsApiProperties, thiefGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/thief-judge-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThiefGameOptions {
  @ApiProperty(thiefGameOptionsApiProperties.mustChooseBetweenWerewolves)
  @Prop({ default: thiefGameOptionsFieldsSpecs.mustChooseBetweenWerewolves.default })
  public mustChooseBetweenWerewolves: boolean;

  @ApiProperty(thiefGameOptionsApiProperties.additionalCardsCount)
  @Prop({
    default: thiefGameOptionsFieldsSpecs.additionalCardsCount.default,
    min: thiefGameOptionsFieldsSpecs.additionalCardsCount.minimum,
    max: thiefGameOptionsFieldsSpecs.additionalCardsCount.maximum,
  })
  public additionalCardsCount: number;
}

const ThiefGameOptionsSchema = SchemaFactory.createForClass(ThiefGameOptions);

export { ThiefGameOptions, ThiefGameOptionsSchema };