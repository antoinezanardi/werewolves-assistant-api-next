import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
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
  public _id: string;

  @ApiProperty(gameApiProperties.turn)
  @Prop({ default: gameFieldsSpecs.turn.default })
  public turn: number;

  @ApiProperty(gameApiProperties.phase)
  @Prop({ default: gameFieldsSpecs.phase.default })
  public phase: GAME_PHASES;

  @ApiProperty(gameApiProperties.tick)
  @Prop({ default: gameFieldsSpecs.tick.default })
  public tick: number;

  @ApiProperty(gameApiProperties.status)
  @Prop({ default: gameFieldsSpecs.status.default })
  public status: GAME_STATUSES;

  @ApiProperty(gameApiProperties.players)
  @Prop({
    required: true,
    type: [PlayerSchema],
  })
  public players: Player[];

  @ApiProperty(gameApiProperties.upcomingPlays)
  @Prop({
    required: true,
    type: [GamePlaySchema],
  })
  public upcomingPlays: GamePlay[];

  @ApiProperty(gameApiProperties.options)
  @Prop({
    type: GameOptionsSchema,
    default: () => ({}),
  })
  public options: GameOptions;
  
  @ApiProperty(gameApiProperties.additionalCards)
  @Prop({ type: [GameAdditionalCardSchema], default: undefined })
  public additionalCards?: GameAdditionalCard[];

  @ApiProperty(gameApiProperties.createdAt)
  public createdAt: Date;

  @ApiProperty(gameApiProperties.updatedAt)
  public updatedAt: Date;
}

const GameSchema = SchemaFactory.createForClass(Game);

type GameDocument = HydratedDocument<Game>;

export type { GameDocument };

export { Game, GameSchema };