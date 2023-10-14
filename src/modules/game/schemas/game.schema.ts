import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";

import { GamePhases, GameStatuses } from "@/modules/game/enums/game.enum";
import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import { GAME_API_PROPERTIES, GAME_FIELDS_SPECS } from "@/modules/game/schemas/game.schema.constant";
import { Player } from "@/modules/game/schemas/player/player.schema";

import { toObjectId } from "@/shared/validation/transformers/validation.transformer";

@Schema({
  timestamps: true,
  versionKey: false,
})
class Game {
  @ApiProperty(GAME_API_PROPERTIES._id as ApiPropertyOptions)
  @Transform(toObjectId)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(GAME_API_PROPERTIES.turn as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.turn)
  @Expose()
  public turn: number;

  @ApiProperty(GAME_API_PROPERTIES.phase as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.phase)
  @Expose()
  public phase: GamePhases;

  @ApiProperty(GAME_API_PROPERTIES.tick as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.tick)
  @Expose()
  public tick: number;

  @ApiProperty(GAME_API_PROPERTIES.status as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.status)
  @Expose()
  public status: GameStatuses;

  @ApiProperty(GAME_API_PROPERTIES.players as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.players)
  @Type(() => Player)
  @Expose()
  public players: Player[];

  @ApiProperty(GAME_API_PROPERTIES.currentPlay as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.currentPlay)
  @Type(() => GamePlay)
  @Expose()
  public currentPlay: GamePlay | null;

  @ApiProperty(GAME_API_PROPERTIES.upcomingPlays as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.upcomingPlays)
  @Type(() => GamePlay)
  @Expose()
  public upcomingPlays: GamePlay[];

  @ApiProperty(GAME_API_PROPERTIES.options as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.options)
  @Type(() => GameOptions)
  @Expose()
  public options: GameOptions;

  @ApiProperty(GAME_API_PROPERTIES.additionalCards as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.additionalCards)
  @Type(() => GameAdditionalCard)
  @Expose()
  public additionalCards?: GameAdditionalCard[];

  @ApiProperty(GAME_API_PROPERTIES.victory as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.victory)
  @Type(() => GameVictory)
  @Expose()
  public victory?: GameVictory;

  @ApiProperty(GAME_API_PROPERTIES.createdAt as ApiPropertyOptions)
  @Type(() => Date)
  @Expose()
  public createdAt: Date;

  @ApiProperty(GAME_API_PROPERTIES.updatedAt as ApiPropertyOptions)
  @Type(() => Date)
  @Expose()
  public updatedAt: Date;
}

const GAME_SCHEMA = SchemaFactory.createForClass(Game);

export {
  Game,
  GAME_SCHEMA,
};