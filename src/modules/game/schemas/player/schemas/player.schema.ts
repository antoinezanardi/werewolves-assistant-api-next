import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { playerApiProperties, playersFieldsSpecs } from "../constants/player.constant";
import type { PlayerAttribute } from "./player-attribute/schemas/player-attribute.schema";
import { PlayerAttributeSchema } from "./player-attribute/schemas/player-attribute.schema";
import { PlayerDeath, PlayerDeathSchema } from "./player-death/schemas/player-death.schema";
import { PlayerRole, PlayerRoleSchema } from "./player-role/schemas/player-role.schema";
import { PlayerSide, PlayerSideSchema } from "./player-side/schemas/player-side.schema";

@Schema({ versionKey: false })
class Player {
  @ApiProperty(playerApiProperties._id)
  public _id: string;

  @ApiProperty(playerApiProperties.name)
  @Prop({
    required: true,
    minlength: playersFieldsSpecs.name.minLength,
    maxLength: playersFieldsSpecs.name.maxLength,
  })
  public name: string;

  @ApiProperty(playerApiProperties.role)
  @Prop({
    required: true,
    type: PlayerRoleSchema,
  })
  public role: PlayerRole;

  @ApiProperty(playerApiProperties.side)
  @Prop({
    required: true,
    type: PlayerSideSchema,
  })
  public side: PlayerSide;

  @ApiProperty(playerApiProperties.attributes)
  @Prop({
    required: true,
    type: [PlayerAttributeSchema],
    default: playersFieldsSpecs.attributes.default,
  })
  public attributes: PlayerAttribute[];

  @ApiProperty(playerApiProperties.position)
  @Prop({
    required: true,
    min: playersFieldsSpecs.position.minimum,
  })
  public position: number;

  @ApiProperty(playerApiProperties.isAlive)
  @Prop({ default: playersFieldsSpecs.isAlive.default })
  public isAlive: boolean;

  @ApiProperty(playerApiProperties.death)
  @Prop({ type: PlayerDeathSchema })
  public death?: PlayerDeath;
}

const PlayerSchema = SchemaFactory.createForClass(Player);

export { Player, PlayerSchema };