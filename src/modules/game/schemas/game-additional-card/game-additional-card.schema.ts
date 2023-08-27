import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";

import { gameAdditionalCardApiProperties, gameAdditionalCardFieldsSpecs } from "@/modules/game/constants/game-additional-card/game-additional-card.constant";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

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