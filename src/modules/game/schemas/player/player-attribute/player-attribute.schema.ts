import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { PLAYER_ATTRIBUTE_API_PROPERTIES, PLAYER_ATTRIBUTE_FIELDS_SPECS } from "@/modules/game/constants/player/player-attribute/player-attribute.constant";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { PlayerAttributeActivation, PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation.schema";
import { GameSource } from "@/modules/game/types/game.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerAttribute {
  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.name)
  @Prop({ required: true })
  @Expose()
  public name: PlayerAttributeNames;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.source)
  @Prop({ required: true })
  @Expose()
  public source: GameSource;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.remainingPhases)
  @Prop({ min: PLAYER_ATTRIBUTE_FIELDS_SPECS.remainingPhases.minimum })
  @Expose()
  public remainingPhases?: number;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.activeAt)
  @Prop({ type: PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA })
  @Type(() => PlayerAttributeActivation)
  @Expose()
  public activeAt?: PlayerAttributeActivation;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.doesRemainAfterDeath)
  @Prop({ required: false })
  @Expose()
  public doesRemainAfterDeath?: boolean;
}

const PLAYER_ATTRIBUTE_SCHEMA = SchemaFactory.createForClass(PlayerAttribute);

export {
  PlayerAttribute,
  PLAYER_ATTRIBUTE_SCHEMA,
};