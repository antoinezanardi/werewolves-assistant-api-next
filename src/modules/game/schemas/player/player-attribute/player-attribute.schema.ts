import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { playerAttributeApiProperties, playerAttributeFieldsSpecs } from "@/modules/game/constants/player/player-attribute/player-attribute.constant";
import { PLAYER_ATTRIBUTE_NAMES } from "@/modules/game/enums/player.enum";
import { PlayerAttributeActivation, PlayerAttributeActivationSchema } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation.schema";
import { GameSource } from "@/modules/game/types/game.type";

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