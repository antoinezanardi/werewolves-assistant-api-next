import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import { gameAdditionalCardApiProperties, gameAdditionalCardFieldsSpecs } from "../../constants/game-additional-card/game-additional-card.constant";

@Schema({ versionKey: false })
class GameAdditionalCard {
  @ApiProperty(gameAdditionalCardApiProperties._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(gameAdditionalCardApiProperties.roleName)
  @Prop({
    required: gameAdditionalCardFieldsSpecs.roleName.required,
    enum: gameAdditionalCardFieldsSpecs.roleName.enum,
  })
  @Expose()
  public roleName: ROLE_NAMES;

  @ApiProperty(gameAdditionalCardApiProperties.recipient)
  @Prop({
    required: gameAdditionalCardFieldsSpecs.recipient.required,
    enum: gameAdditionalCardFieldsSpecs.recipient.enum,
  })
  @Expose()
  public recipient: ROLE_NAMES.THIEF;

  @ApiProperty(gameAdditionalCardApiProperties.isUsed)
  @Prop({ default: gameAdditionalCardFieldsSpecs.isUsed.default as boolean })
  @Expose()
  public isUsed: boolean;
}

const GameAdditionalCardSchema = SchemaFactory.createForClass(GameAdditionalCard);

export { GameAdditionalCard, GameAdditionalCardSchema };