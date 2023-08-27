import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";

import { playerApiProperties, playersFieldsSpecs } from "@/modules/game/constants/player/player.constant";
import { PlayerAttribute, PlayerAttributeSchema } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { PlayerDeath, PlayerDeathSchema } from "@/modules/game/schemas/player/player-death.schema";
import { PlayerRole, PlayerRoleSchema } from "@/modules/game/schemas/player/player-role.schema";
import { PlayerSide, PlayerSideSchema } from "@/modules/game/schemas/player/player-side.schema";

@Schema({ versionKey: false })
class Player {
  @ApiProperty(playerApiProperties._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(playerApiProperties.name)
  @Prop({
    required: true,
    minlength: playersFieldsSpecs.name.minLength,
    maxLength: playersFieldsSpecs.name.maxLength,
  })
  @Expose()
  public name: string;

  @ApiProperty(playerApiProperties.role)
  @Prop({
    required: true,
    type: PlayerRoleSchema,
  })
  @Type(() => PlayerRole)
  @Expose()
  public role: PlayerRole;

  @ApiProperty(playerApiProperties.side)
  @Prop({
    required: true,
    type: PlayerSideSchema,
  })
  @Type(() => PlayerSide)
  @Expose()
  public side: PlayerSide;

  @ApiProperty(playerApiProperties.attributes)
  @Prop({
    required: true,
    type: [PlayerAttributeSchema],
    default: playersFieldsSpecs.attributes.default,
  })
  @Type(() => PlayerAttribute)
  @Expose()
  public attributes: PlayerAttribute[];

  @ApiProperty(playerApiProperties.position)
  @Prop({
    required: true,
    min: playersFieldsSpecs.position.minimum,
  })
  @Expose()
  public position: number;

  @ApiProperty(playerApiProperties.isAlive)
  @Prop({ default: playersFieldsSpecs.isAlive.default })
  @Expose()
  public isAlive: boolean;

  @ApiProperty(playerApiProperties.death)
  @Prop({ type: PlayerDeathSchema })
  @Type(() => PlayerDeath)
  @Expose()
  public death?: PlayerDeath;
}

const PlayerSchema = SchemaFactory.createForClass(Player);

export { Player, PlayerSchema };