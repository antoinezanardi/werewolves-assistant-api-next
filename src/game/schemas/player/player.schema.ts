import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../role/enums/role.enum";

@Schema({
  versionKey: false,
  _id: true,
  id: true,
})
class Player {
  @ApiProperty({
    description: "Player's ID",
    example: "507f1f77bcf86cd799439011",
  })
  public _id: string;

  @ApiProperty({
    description: "Player's name",
    example: "Antoine",
  })
  @Prop({ required: true })
  public name: string;

  @ApiProperty({
    description: "Player's role",
    example: ROLE_NAMES.WITCH,
  })
  @Prop({ required: true })
  public role: ROLE_NAMES;

  @ApiProperty({
    description: "Unique player's position among all game's players. Increment from 0 to `players.length - 1`",
    example: 1,
  })
  @Prop({ required: false })
  public position?: number;
}

const PlayerSchema = SchemaFactory.createForClass(Player);

export { Player, PlayerSchema };