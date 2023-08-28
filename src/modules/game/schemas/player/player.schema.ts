import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";

import { PLAYER_API_PROPERTIES, PLAYER_FIELDS_SPECS } from "@/modules/game/constants/player/player.constant";
import { PlayerAttribute, PLAYER_ATTRIBUTE_SCHEMA } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { PlayerDeath, PLAYER_DEATH_SCHEMA } from "@/modules/game/schemas/player/player-death.schema";
import { PlayerRole, PLAYER_ROLE_SCHEMA } from "@/modules/game/schemas/player/player-role.schema";
import { PlayerSide, PLAYER_SIDE_SCHEMA } from "@/modules/game/schemas/player/player-side.schema";

@Schema({ versionKey: false })
class Player {
  @ApiProperty(PLAYER_API_PROPERTIES._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(PLAYER_API_PROPERTIES.name)
  @Prop({
    required: true,
    minlength: PLAYER_FIELDS_SPECS.name.minLength,
    maxLength: PLAYER_FIELDS_SPECS.name.maxLength,
  })
  @Expose()
  public name: string;

  @ApiProperty(PLAYER_API_PROPERTIES.role)
  @Prop({
    required: true,
    type: PLAYER_ROLE_SCHEMA,
  })
  @Type(() => PlayerRole)
  @Expose()
  public role: PlayerRole;

  @ApiProperty(PLAYER_API_PROPERTIES.side)
  @Prop({
    required: true,
    type: PLAYER_SIDE_SCHEMA,
  })
  @Type(() => PlayerSide)
  @Expose()
  public side: PlayerSide;

  @ApiProperty(PLAYER_API_PROPERTIES.attributes)
  @Prop({
    required: true,
    type: [PLAYER_ATTRIBUTE_SCHEMA],
    default: PLAYER_FIELDS_SPECS.attributes.default,
  })
  @Type(() => PlayerAttribute)
  @Expose()
  public attributes: PlayerAttribute[];

  @ApiProperty(PLAYER_API_PROPERTIES.position)
  @Prop({
    required: true,
    min: PLAYER_FIELDS_SPECS.position.minimum,
  })
  @Expose()
  public position: number;

  @ApiProperty(PLAYER_API_PROPERTIES.isAlive)
  @Prop({ default: PLAYER_FIELDS_SPECS.isAlive.default })
  @Expose()
  public isAlive: boolean;

  @ApiProperty(PLAYER_API_PROPERTIES.death)
  @Prop({ type: PLAYER_DEATH_SCHEMA })
  @Type(() => PlayerDeath)
  @Expose()
  public death?: PlayerDeath;
}

const PLAYER_SCHEMA = SchemaFactory.createForClass(Player);

export {
  Player,
  PLAYER_SCHEMA,
};