import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";
import type { HydratedDocument } from "mongoose";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import { GameAdditionalCardSchema, GameAdditionalCard } from "./game-additional-card/game-additional-card.schema";
import { GameOptions, GameOptionsSchema } from "./game-options/game-options.schema";
import { GamePlaySchema, GamePlay } from "./game-play/game-play.schema";
import { GameVictory, GameVictorySchema } from "./game-victory/game-victory.schema";
import { gameApiProperties, gameFieldsSpecs } from "./game.schema.constant";
import { PlayerSchema, Player } from "./player/player.schema";

@Schema({
  timestamps: true,
  versionKey: false,
})
class Game {
  @ApiProperty(gameApiProperties._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(gameApiProperties.turn)
  @Prop({ default: gameFieldsSpecs.turn.default })
  @Expose()
  public turn: number;

  @ApiProperty(gameApiProperties.phase)
  @Prop({ default: gameFieldsSpecs.phase.default })
  @Expose()
  public phase: GAME_PHASES;

  @ApiProperty(gameApiProperties.tick)
  @Prop({ default: gameFieldsSpecs.tick.default })
  @Expose()
  public tick: number;

  @ApiProperty(gameApiProperties.status)
  @Prop({ default: gameFieldsSpecs.status.default })
  @Expose()
  public status: GAME_STATUSES;

  @ApiProperty(gameApiProperties.players)
  @Prop({
    required: true,
    type: [PlayerSchema],
  })
  @Type(() => Player)
  @Expose()
  public players: Player[];

  @ApiProperty(gameApiProperties.currentPlay)
  @Prop({
    required: true,
    type: GamePlaySchema,
  })
  @Type(() => GamePlay)
  @Expose()
  public currentPlay: GamePlay | null;

  @ApiProperty(gameApiProperties.upcomingPlays)
  @Prop({
    required: true,
    type: [GamePlaySchema],
  })
  @Type(() => GamePlay)
  @Expose()
  public upcomingPlays: GamePlay[];

  @ApiProperty(gameApiProperties.options)
  @Prop({
    type: GameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => GameOptions)
  @Expose()
  public options: GameOptions;

  @ApiProperty(gameApiProperties.additionalCards)
  @Prop({ type: [GameAdditionalCardSchema], default: undefined })
  @Type(() => GameAdditionalCard)
  @Expose()
  public additionalCards?: GameAdditionalCard[];

  @ApiProperty(gameApiProperties.victory)
  @Prop({ type: GameVictorySchema, default: undefined })
  @Type(() => GameVictory)
  @Expose()
  public victory?: GameVictory;

  @ApiProperty(gameApiProperties.createdAt)
  @Type(() => Date)
  @Expose()
  public createdAt: Date;

  @ApiProperty(gameApiProperties.updatedAt)
  @Type(() => Date)
  @Expose()
  public updatedAt: Date;
}

const GameSchema = SchemaFactory.createForClass(Game);

type GameDocument = HydratedDocument<Game>;

export type { GameDocument };

export { Game, GameSchema };