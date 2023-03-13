import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { playerApiProperties, playersFieldsSpecs } from "../constants/player.constant";

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
  @Prop({ required: true })
  public role: ROLE_NAMES;

  @ApiProperty(playerApiProperties.position)
  @Prop({
    required: false,
    min: playersFieldsSpecs.position.minimum,
  })
  public position?: number;
}

const PlayerSchema = SchemaFactory.createForClass(Player);

export { Player, PlayerSchema };