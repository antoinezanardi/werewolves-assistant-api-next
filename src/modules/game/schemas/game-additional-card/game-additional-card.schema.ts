import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";

import { GAME_ADDITIONAL_CARDS_API_PROPERTIES, GAME_ADDITIONAL_CARDS_FIELDS_SPECS } from "@/modules/game/constants/game-additional-cards/game-additional-cards.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

@Schema({ versionKey: false })
class GameAdditionalCard {
  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.roleName)
  @Prop({
    required: GAME_ADDITIONAL_CARDS_FIELDS_SPECS.roleName.required,
    enum: GAME_ADDITIONAL_CARDS_FIELDS_SPECS.roleName.enum,
  })
  @Expose()
  public roleName: RoleNames;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.recipient)
  @Prop({
    required: GAME_ADDITIONAL_CARDS_FIELDS_SPECS.recipient.required,
    enum: GAME_ADDITIONAL_CARDS_FIELDS_SPECS.recipient.enum,
  })
  @Expose()
  public recipient: RoleNames.THIEF;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.isUsed)
  @Prop({ default: GAME_ADDITIONAL_CARDS_FIELDS_SPECS.isUsed.default as boolean })
  @Expose()
  public isUsed: boolean;
}

const GAME_ADDITIONAL_CARD_SCHEMA = SchemaFactory.createForClass(GameAdditionalCard);

export {
  GameAdditionalCard,
  GAME_ADDITIONAL_CARD_SCHEMA,
};