import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";
import type { HydratedDocument } from "mongoose";
import { gameApiProperties, gameFieldsSpecs } from "../constants/game.constant";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import type { GameAdditionalCard } from "./game-additional-card/game-additional-card.schema";
import { GameAdditionalCardSchema } from "./game-additional-card/game-additional-card.schema";
import { GameOptions, GameOptionsSchema } from "./game-options/game-options.schema";
import type { GamePlay } from "./game-play.schema";
import { GamePlaySchema } from "./game-play.schema";
import { PlayerSchema } from "./player/player.schema";
import type { Player } from "./player/player.schema";

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
  @Expose()
  public players: Player[];

  @ApiProperty(gameApiProperties.upcomingPlays)
  @Prop({
    required: true,
    type: [GamePlaySchema],
  })
  @Expose()
  public upcomingPlays: GamePlay[];

  @ApiProperty(gameApiProperties.options)
  @Prop({
    type: GameOptionsSchema,
    default: () => ({}),
  })
  @Expose()
  public options: GameOptions;

  @ApiProperty(gameApiProperties.additionalCards)
  @Prop({ type: [GameAdditionalCardSchema], default: undefined })
  @Expose()
  public additionalCards?: GameAdditionalCard[];

  @ApiProperty(gameApiProperties.createdAt)
  @Expose()
  public createdAt: Date;

  @ApiProperty(gameApiProperties.updatedAt)
  @Expose()
  public updatedAt: Date;
}

const GameSchema = SchemaFactory.createForClass(Game);

type GameDocument = HydratedDocument<Game>;

export type { GameDocument };

export { Game, GameSchema };