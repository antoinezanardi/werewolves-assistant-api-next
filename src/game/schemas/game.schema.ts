import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import type { HydratedDocument } from "mongoose";
import { gameApiProperties } from "../constants/game.constant";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import { GameOptions, GameOptionsSchema } from "./game-options/schemas/game-options.schema";
import { PlayerSchema } from "./player/schemas/player.schema";
import type { Player } from "./player/schemas/player.schema";

@Schema({
  timestamps: true,
  versionKey: false,
})
class Game {
  @ApiProperty(gameApiProperties._id)
  public _id: string;

  @ApiProperty(gameApiProperties.turn)
  @Prop({ default: gameApiProperties.turn.default as number })
  public turn: number;

  @ApiProperty(gameApiProperties.phase)
  @Prop({ default: gameApiProperties.phase.default as GAME_PHASES })
  public phase: GAME_PHASES;

  @ApiProperty(gameApiProperties.tick)
  @Prop({ default: gameApiProperties.tick.default as number })
  public tick: number;

  @ApiProperty(gameApiProperties.status)
  @Prop({ default: gameApiProperties.status.default as GAME_STATUSES })
  public status: GAME_STATUSES;

  @ApiProperty(gameApiProperties.players)
  @Prop({
    required: true,
    type: [PlayerSchema],
  })
  public players: Player[];

  @ApiProperty(gameApiProperties.options)
  @Prop({
    type: GameOptionsSchema,
    default: () => ({}),
  })
  public options: GameOptions;

  @ApiProperty(gameApiProperties.createdAt)
  public createdAt: Date;

  @ApiProperty(gameApiProperties.updatedAt)
  public updatedAt: Date;
}

const GameSchema = SchemaFactory.createForClass(Game);

type GameDocument = HydratedDocument<Game>;

export type { GameDocument };

export { Game, GameSchema };