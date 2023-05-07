import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";
import { playerApiProperties, playersFieldsSpecs } from "../../constants/player/player.constant";
import type { PlayerAttribute } from "./player-attribute/player-attribute.schema";
import { PlayerAttributeSchema } from "./player-attribute/player-attribute.schema";
import { PlayerDeath, PlayerDeathSchema } from "./player-death.schema";
import { PlayerRole, PlayerRoleSchema } from "./player-role.schema";
import { PlayerSide, PlayerSideSchema } from "./player-side.schema";

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
  @Expose()
  public role: PlayerRole;

  @ApiProperty(playerApiProperties.side)
  @Prop({
    required: true,
    type: PlayerSideSchema,
  })
  @Expose()
  public side: PlayerSide;

  @ApiProperty(playerApiProperties.attributes)
  @Prop({
    required: true,
    type: [PlayerAttributeSchema],
    default: playersFieldsSpecs.attributes.default,
  })
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
  @Expose()
  public death?: PlayerDeath;
}

const PlayerSchema = SchemaFactory.createForClass(Player);

export { Player, PlayerSchema };