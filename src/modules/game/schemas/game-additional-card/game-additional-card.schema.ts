import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import { gameAdditionalCardApiProperties, gameAdditionalCardFieldsSpecs } from "../../constants/game-additional-card/game-additional-card.constant";

@Schema({ versionKey: false })
class GameAdditionalCard {
  @ApiProperty(gameAdditionalCardApiProperties._id)
  public _id: string;
  
  @ApiProperty(gameAdditionalCardApiProperties.roleName)
  @Prop({
    required: gameAdditionalCardFieldsSpecs.roleName.required,
    enum: gameAdditionalCardFieldsSpecs.roleName.enum,
  })
  public roleName: ROLE_NAMES;

  @ApiProperty(gameAdditionalCardApiProperties.recipient)
  @Prop({
    required: gameAdditionalCardFieldsSpecs.recipient.required,
    enum: gameAdditionalCardFieldsSpecs.recipient.enum,
  })
  public recipient: ROLE_NAMES.THIEF;

  @ApiProperty(gameAdditionalCardApiProperties.isUsed)
  @Prop({ default: gameAdditionalCardFieldsSpecs.isUsed.default as boolean })
  public isUsed: boolean;
}

const GameAdditionalCardSchema = SchemaFactory.createForClass(GameAdditionalCard);

export { GameAdditionalCard, GameAdditionalCardSchema };