import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";

import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import { GamePhase } from "@/modules/game/schemas/game-phase/game-phase.schema";
import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";
import { GAME_API_PROPERTIES, GAME_FIELDS_SPECS } from "@/modules/game/schemas/game.schema.constants";
import { Player } from "@/modules/game/schemas/player/player.schema";
import { GameStatus } from "@/modules/game/types/game.types";

import { toObjectId } from "@/shared/validation/transformers/validation.transformer";

@Schema({
  timestamps: true,
  id: false,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
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
  @Type(() => GamePhase)
  @Expose()
  public phase: GamePhase;

  @ApiProperty(GAME_API_PROPERTIES.tick as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.tick)
  @Expose()
  public tick: number;

  @ApiProperty(GAME_API_PROPERTIES.status as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.status)
  @Expose()
  public status: GameStatus;

  @ApiProperty(GAME_API_PROPERTIES.players as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.players)
  @Type(() => Player)
  @Expose()
  public players: Player[];

  @ApiProperty(GAME_API_PROPERTIES.playerGroups as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.playerGroups)
  @Expose()
  public playerGroups?: string[];

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

  @ApiProperty(GAME_API_PROPERTIES.events as ApiPropertyOptions)
  @Prop(GAME_FIELDS_SPECS.events)
  @Type(() => GameEvent)
  @Expose()
  public events?: GameEvent[];

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

  @ApiProperty(GAME_API_PROPERTIES.lastGameHistoryRecord as ApiPropertyOptions)
  @Type(() => GameHistoryRecord)
  @Expose()
  public lastGameHistoryRecord: GameHistoryRecord | null = null;

  @ApiProperty(GAME_API_PROPERTIES.feedback as ApiPropertyOptions)
  @Type(() => GameFeedback)
  @Expose()
  public feedback: GameFeedback | null = null;
}

const GAME_SCHEMA = SchemaFactory.createForClass(Game);

GAME_SCHEMA.virtual("lastGameHistoryRecord", {
  ref: GameHistoryRecord.name,
  localField: "_id",
  foreignField: "gameId",
  justOne: true,
  options: { sort: { createdAt: -1 } },
});

GAME_SCHEMA.virtual("feedback", {
  ref: GameFeedback.name,
  localField: "_id",
  foreignField: "gameId",
  justOne: true,
  options: { sort: { createdAt: -1 } },
});

export {
  Game,
  GAME_SCHEMA,
};