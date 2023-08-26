import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { gamePlaySourceApiProperties, gamePlaySourceFieldsSpecs } from "../../../constants/game-play/game-play-source.constant";
import { GameSource } from "../../../types/game.type";
import { Player, PlayerSchema } from "../../player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlaySource {
  @ApiProperty(gamePlaySourceApiProperties.name)
  @Prop({
    required: gamePlaySourceFieldsSpecs.name.required,
    enum: gamePlaySourceFieldsSpecs.name.enum,
  })
  @Expose()
  public name: GameSource;

  @ApiProperty(gamePlaySourceApiProperties.players)
  @Prop({
    required: gamePlaySourceFieldsSpecs.players.required,
    default: undefined,
    type: [PlayerSchema],
  })
  @Type(() => Player)
  @Expose()
  public players?: Player[];
}

const GamePlaySourceSchema = SchemaFactory.createForClass(GamePlaySource);

export { GamePlaySource, GamePlaySourceSchema };