import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { Types } from "mongoose";

import { RoleName } from "@/modules/role/types/role.types";
import { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card/game-additional-card.types";
import { GAME_ADDITIONAL_CARDS_API_PROPERTIES, GAME_ADDITIONAL_CARDS_FIELDS_SPECS } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema.constants";

import { toObjectId } from "@/shared/validation/transformers/validation.transformer";

@Schema({ versionKey: false })
class GameAdditionalCard {
  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES._id as ApiPropertyOptions)
  @Transform(toObjectId)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.roleName as ApiPropertyOptions)
  @Prop(GAME_ADDITIONAL_CARDS_FIELDS_SPECS.roleName)
  @Expose()
  public roleName: RoleName;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.recipient as ApiPropertyOptions)
  @Prop(GAME_ADDITIONAL_CARDS_FIELDS_SPECS.recipient)
  @Expose()
  public recipient: GameAdditionalCardRecipientRoleName;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.isUsed as ApiPropertyOptions)
  @Prop(GAME_ADDITIONAL_CARDS_FIELDS_SPECS.isUsed)
  @Expose()
  public isUsed: boolean;
}

const GAME_ADDITIONAL_CARD_SCHEMA = SchemaFactory.createForClass(GameAdditionalCard);

export {
  GameAdditionalCard,
  GAME_ADDITIONAL_CARD_SCHEMA,
};