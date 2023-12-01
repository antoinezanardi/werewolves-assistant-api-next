import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";

import { PLAYER_API_PROPERTIES, PLAYER_FIELDS_SPECS } from "@/modules/game/schemas/player/player.schema.constant";
import { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";
import { PlayerRole } from "@/modules/game/schemas/player/player-role/player-role.schema";
import { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";

import { toObjectId } from "@/shared/validation/transformers/validation.transformer";

@Schema({ versionKey: false })
class Player {
  @ApiProperty(PLAYER_API_PROPERTIES._id as ApiPropertyOptions)
  @Transform(toObjectId)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(PLAYER_API_PROPERTIES.name as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.name)
  @Expose()
  public name: string;

  @ApiProperty(PLAYER_API_PROPERTIES.role as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.role)
  @Type(() => PlayerRole)
  @Expose()
  public role: PlayerRole;

  @ApiProperty(PLAYER_API_PROPERTIES.side as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.side)
  @Type(() => PlayerSide)
  @Expose()
  public side: PlayerSide;

  @ApiProperty(PLAYER_API_PROPERTIES.attributes as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.attributes)
  @Type(() => PlayerAttribute)
  @Expose()
  public attributes: PlayerAttribute[];

  @ApiProperty(PLAYER_API_PROPERTIES.position as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.position)
  @Expose()
  public position: number;

  @ApiProperty(PLAYER_API_PROPERTIES.group as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.group)
  @Expose()
  public group?: string;

  @ApiProperty(PLAYER_API_PROPERTIES.isAlive as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.isAlive)
  @Expose()
  public isAlive: boolean;

  @ApiProperty(PLAYER_API_PROPERTIES.death as ApiPropertyOptions)
  @Prop(PLAYER_FIELDS_SPECS.death)
  @Type(() => PlayerDeath)
  @Expose()
  public death?: PlayerDeath;
}

const PLAYER_SCHEMA = SchemaFactory.createForClass(Player);

export {
  Player,
  PLAYER_SCHEMA,
};