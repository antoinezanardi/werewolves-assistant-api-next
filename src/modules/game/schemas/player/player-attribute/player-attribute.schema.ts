import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { playerAttributeApiProperties, playerAttributeFieldsSpecs } from "../../../constants/player/player-attribute/player-attribute.constant";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../enums/player.enum";
import { GameSource } from "../../../types/game.type";
import { PlayerAttributeActivation, PlayerAttributeActivationSchema } from "./player-attribute-activation.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerAttribute {
  @ApiProperty(playerAttributeApiProperties.name)
  @Prop({ required: true })
  @Expose()
  public name: PLAYER_ATTRIBUTE_NAMES;

  @ApiProperty(playerAttributeApiProperties.source)
  @Prop({ required: true })
  @Expose()
  public source: GameSource;

  @ApiProperty(playerAttributeApiProperties.remainingPhases)
  @Prop({ min: playerAttributeFieldsSpecs.remainingPhases.minimum })
  @Expose()
  public remainingPhases?: number;

  @ApiProperty(playerAttributeApiProperties.activeAt)
  @Prop({ type: PlayerAttributeActivationSchema })
  @Type(() => PlayerAttributeActivation)
  @Expose()
  public activeAt?: PlayerAttributeActivation;

  @ApiProperty(playerAttributeApiProperties.doesRemainAfterDeath)
  @Prop({ required: false })
  @Expose()
  public doesRemainAfterDeath?: boolean;
}

const PlayerAttributeSchema = SchemaFactory.createForClass(PlayerAttribute);

export { PlayerAttribute, PlayerAttributeSchema };